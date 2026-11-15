/**
 * The one place the app talks to an AI model, through OpenRouter. Every AI feature goes through here so
 * the key, the model choice and the time limit are in one file (the daily credits are in credits.ts). Nothing sent or received is
 * stored or logged. Without OPENROUTER_API_KEY every feature says it is not switched on and the interface
 * falls back to the typed or template way.
 */
export class AiError extends Error {
  constructor(
    message: string,
    readonly kind: "not-configured" | "limit" | "burst" | "too-big" | "bad-input" | "upstream",
  ) {
    super(message);
    this.name = "AiError";
  }
}

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

/** The model for each job. Both can be changed in the environment without touching the code. */
export const models = () => ({
  vision: process.env.MODEL_VISION ?? "anthropic/claude-haiku-5.5",
  text: process.env.MODEL_TEXT ?? "anthropic/claude-haiku-5.5",
  /** Tried by OpenRouter only if the main model is down or busy. */
  fallback: process.env.MODEL_FALLBACK ?? "google/gemini-2.5-flash-lite",
});

export type Part = { type: "text"; text: string } | { type: "image_url"; image_url: { url: string } };

export interface ChatArgs {
  job: "vision" | "text";
  system: string;
  user: string | Part[];
  maxTokens?: number;
  json?: boolean;
  temperature?: number;
  fetcher?: typeof fetch;
}

/** The key as typed into a dashboard: spaces, a line break or quote marks pasted around it are not part of it. */
const apiKey = () => (process.env.OPENROUTER_API_KEY ?? "").trim().replace(/^["']|["']$/g, "").trim();

export const aiConfigured = () => Boolean(apiKey());

export async function chat({ job, system, user, maxTokens = 400, json = false, temperature = 0, fetcher }: ChatArgs): Promise<string> {
  const key = apiKey();
  if (!key) throw new AiError("AI is not switched on", "not-configured");
  const res = await (fetcher ?? fetch)(ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      models: [models()[job], models().fallback],
      temperature,
      max_tokens: maxTokens,
      // These jobs copy numbers or write a few plain sentences. Thinking first only spends the token budget
      // (and can leave the answer empty), so it is off.
      reasoning: { enabled: false },
      ...(json ? { response_format: { type: "json_object" } } : {}),
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
    signal: AbortSignal.timeout(job === "vision" ? 30_000 : 20_000),
    cache: "no-store",
  }).catch(() => {
    throw new AiError("The model did not answer", "upstream");
  });
  if (!res.ok) throw new AiError("The model did not answer", "upstream");
  const body = (await res.json().catch(() => null)) as { choices?: { message?: { content?: string } }[] } | null;
  const content = body?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) throw new AiError("The model sent an answer we could not use", "upstream");
  return content;
}
