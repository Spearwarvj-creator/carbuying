import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { AiError } from "@/server/ai";
import { boostFor, checkBurst, refundCredits, takeCredits, visitorOf, type Credits, type Feature } from "@/server/credits";

const MESSAGES: Record<AiError["kind"], { status: number; message: string }> = {
  "not-configured": { status: 503, message: "This helper is not switched on yet." },
  limit: { status: 429, message: "You have used today's free AI uses." },
  burst: { status: 429, message: "That was a lot at once. Wait a minute and try again." },
  "too-big": { status: 413, message: "That is too large. Try a smaller one." },
  "bad-input": { status: 400, message: "Check what you sent and try again." },
  upstream: { status: 502, message: "The helper is not answering right now." },
};

const creditHeaders = (c: Credits | null): Record<string, string> =>
  c ? { "x-credits-left": String(c.left), "x-credits-limit": String(c.limit), "x-credits-resets": c.resetsAt } : {};

/**
 * Shared shape for the AI routes: read JSON, check it, take the visitor's credits, run, answer in plain words.
 * Credits are given back when the visitor got nothing for them: the model failed, or only the plain text was shown.
 * Nothing about the request or the answer is logged.
 */
export async function aiRoute<S extends z.ZodTypeAny, R>(
  request: NextRequest,
  schema: S,
  feature: Feature,
  run: (input: z.infer<S>) => Promise<R>,
  opts: { units?: (input: z.infer<S>) => number; needsKey?: boolean } = {},
) {
  const visitor = visitorOf(request.headers);
  const boost = boostFor(request.headers.get("x-boost-code"));
  let units = 1;
  let taken: Credits | null = null;
  try {
    const input = schema.parse(await request.json());
    units = opts.units?.(input) ?? 1;
    if (opts.needsKey && !process.env.OPENROUTER_API_KEY) throw new AiError("not configured", "not-configured");
    if (process.env.OPENROUTER_API_KEY) {
      checkBurst(visitor);
      taken = await takeCredits({ feature, units, visitor, boost });
    }
    const result = await run(input);
    const plain = typeof result === "object" && result !== null && (result as { source?: string }).source === "template";
    if (taken && plain) {
      await refundCredits({ feature, units, visitor });
      taken = { ...taken, used: taken.used - units, left: taken.left + units };
    }
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store", ...creditHeaders(taken) } });
  } catch (err) {
    const kind: AiError["kind"] = err instanceof AiError ? err.kind : err instanceof z.ZodError ? "bad-input" : "upstream";
    if (taken && kind === "upstream") await refundCredits({ feature, units, visitor });
    const { status, message } = MESSAGES[kind];
    return NextResponse.json({ error: kind, message, fallback: "manual" }, { status, headers: { "Cache-Control": "no-store", ...(kind === "limit" ? { "x-credits-left": "0" } : {}) } });
  }
}
