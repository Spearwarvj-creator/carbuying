import { NextResponse, type NextRequest } from "next/server";
import { aiConfigured } from "@/server/ai";
import { boostFor, checkBurst, peekCredits, visitorOf } from "@/server/credits";

/**
 * Whether the AI helpers are switched on, and how many AI credits this visitor has left today, so the interface can
 * hide the helpers that need a key and show the count. Says nothing about the key. Using this uses no credits.
 */
export async function GET(request: NextRequest) {
  const ai = aiConfigured();
  const visitor = visitorOf(request.headers);
  const code = request.headers.get("x-boost-code");
  let boost = 0;
  if (code) {
    // Every try with a code counts against the visitor's minute, so codes cannot be guessed one after another.
    try {
      checkBurst(`code:${visitor}`);
      boost = boostFor(code);
    } catch {
      boost = 0;
    }
  }
  const credits = ai ? await peekCredits({ visitor, boost }) : null;
  return NextResponse.json({ ai, credits }, { headers: { "Cache-Control": "no-store" } });
}
