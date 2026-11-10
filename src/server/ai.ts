/**
 * The one place the app talks to an AI model, through OpenRouter. Every AI feature goes through here so
 * the key, the model choice, the time limit and the daily caps are in one file. Nothing sent or received is
 * stored or logged. Without OPENROUTER_API_KEY every feature says it is not switched on and the interface
 * falls back to the typed or template way.
 */
export class AiError extends Error {
  constructor(
    message: string,
    readonly kind: "not-configured" | "limit" | "too-big" | "bad-input" | "upstream",
  ) {
    super(message);
    this.name = "AiError";
  }
}

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

/** The model for each job. Both can be changed in the environment without touching the code. */
export const models = () => ({
  vision: process.env.MODEL_VISION ?? process.env.EXTRACT_MODEL ?? "anthropic/claude-sonnet-4.5",
  text: process.env.MODEL_TEXT ?? "anthropic/claude-haiku-4.5",
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

export const aiConfigured = () => Boolean(process.env.OPENROUTER_API_KEY);

export async function chat({ job, system, user, maxTokens = 400, json = false, temperature = 0, fetcher }: ChatArgs): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new AiError("AI is not switched on", "not-configured");
  const res = await (fetcher ?? fetch)(ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: models()[job],
      temperature,
      max_tokens: maxTokens,
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

/**
 * Daily caps, per visitor and for the whole service. The count lives in the memory of one server instance, so
 * on serverless hosting it is a soft brake; the plan is to move it to Upstash Redis. It keeps a number per
 * visitor and nothing else, and drops the previous day's numbers. When UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN are set, takeSharedSlot keeps the counts in Redis instead, so they hold across every
 * server instance; the visitor is stored only as a one-way hash that changes each day.
 */
export type Feature = "photo" | "explain" | "draft" | "practice";
const VISITOR_CAP: Record<Feature, number> = {
  photo: Number(process.env.PHOTO_DAILY_CAP ?? 6),
  explain: 20,
  draft: 12,
  practice: 60,
};
const GLOBAL_CAP: Record<Feature, number> = {
  photo: Number(process.env.EXTRACT_DAILY_CAP ?? 200),
  explain: Number(process.env.AI_DAILY_CAP ?? 3000),
  draft: Number(process.env.AI_DAILY_CAP ?? 3000),
  practice: Number(process.env.AI_DAILY_CAP ?? 3000),
};
export const visitorCap = (f: Feature) => VISITOR_CAP[f];

const perVisitor = new Map<string, { day: string; n: number }>();
const globalCount = new Map<Feature, { day: string; n: number }>();

export function takeSlot(feature: Feature, visitor: string, units = 1, now = new Date()): void {
  const day = now.toISOString().slice(0, 10);
  const g = globalCount.get(feature);
  const gn = g && g.day === day ? g.n : 0;
  const key = `${feature}:${visitor}`;
  const mine = perVisitor.get(key);
  const n = mine && mine.day === day ? mine.n : 0;
  if (n + units > VISITOR_CAP[feature] || gn + units > GLOBAL_CAP[feature]) throw new AiError("The daily limit is reached", "limit");
  perVisitor.set(key, { day, n: n + units });
  globalCount.set(feature, { day, n: gn + units });
  if (perVisitor.size > 5000) for (const [k, v] of perVisitor) if (v.day !== day) perVisitor.delete(k);
}

export const visitorOf = (headers: Headers) => headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";

const upstash = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
};

async function dayHash(text: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
  return Array.from(bytes.slice(0, 10), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Counts one use against the daily caps, in Redis when it is set up and in this server's memory otherwise. If Redis
 * cannot be reached it falls back to the memory count rather than turning every visitor away.
 */
export async function takeSharedSlot(feature: Feature, visitor: string, units = 1, now = new Date(), fetcher: typeof fetch = fetch): Promise<void> {
  const store = upstash();
  if (!store) return takeSlot(feature, visitor, units, now);
  const day = now.toISOString().slice(0, 10);
  const vKey = `dd:${day}:${feature}:v:${await dayHash(`${day}:${visitor}`)}`;
  const gKey = `dd:${day}:${feature}:all`;
  const call = (commands: (string | number)[][]) =>
    fetcher(`${store.url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${store.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    });
  let counts: { result?: unknown }[] | null = null;
  try {
    const res = await call([["INCRBY", vKey, units], ["EXPIRE", vKey, 172800], ["INCRBY", gKey, units], ["EXPIRE", gKey, 172800]]);
    counts = res.ok ? ((await res.json()) as { result?: unknown }[]) : null;
  } catch {
    counts = null;
  }
  const v = counts?.[0]?.result;
  const g = counts?.[2]?.result;
  if (typeof v !== "number" || typeof g !== "number") return takeSlot(feature, visitor, units, now);
  if (v > VISITOR_CAP[feature] || g > GLOBAL_CAP[feature]) {
    // Give the use back, so a refused try does not count against the visitor or the service.
    void call([["DECRBY", vKey, units], ["DECRBY", gKey, units]]).catch(() => undefined);
    throw new AiError("The daily limit is reached", "limit");
  }
}
