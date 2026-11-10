import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { AiError, takeSharedSlot, visitorOf, type Feature } from "@/server/ai";

const MESSAGES: Record<AiError["kind"], { status: number; message: string }> = {
  "not-configured": { status: 503, message: "This helper is not switched on yet." },
  limit: { status: 429, message: "You have used today's limit for this helper." },
  "too-big": { status: 413, message: "That is too large. Try a smaller one." },
  "bad-input": { status: 400, message: "Check what you sent and try again." },
  upstream: { status: 502, message: "The helper is not answering right now." },
};

/** Shared shape for the AI routes: read JSON, check it, count the visitor's use, run, answer in plain words. Nothing is logged. */
export async function aiRoute<S extends z.ZodTypeAny, R>(
  request: NextRequest,
  schema: S,
  feature: Feature,
  run: (input: z.infer<S>) => Promise<R>,
  opts: { units?: (input: z.infer<S>) => number; needsKey?: boolean } = {},
) {
  try {
    const input = schema.parse(await request.json());
    if (opts.needsKey && !process.env.OPENROUTER_API_KEY) throw new AiError("not configured", "not-configured");
    if (process.env.OPENROUTER_API_KEY) await takeSharedSlot(feature, visitorOf(request.headers), opts.units?.(input) ?? 1);
    return NextResponse.json(await run(input), { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    const kind: AiError["kind"] = err instanceof AiError ? err.kind : err instanceof z.ZodError ? "bad-input" : "upstream";
    const { status, message } = MESSAGES[kind];
    return NextResponse.json({ error: kind, message, fallback: "manual" }, { status, headers: { "Cache-Control": "no-store" } });
  }
}
