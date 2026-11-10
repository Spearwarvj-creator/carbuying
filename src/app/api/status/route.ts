import { NextResponse } from "next/server";
import { aiConfigured } from "@/server/ai";

/** Whether the AI helpers are switched on, so the interface can hide the ones that need a key. Says nothing about the key. */
export function GET() {
  return NextResponse.json({ ai: aiConfigured() }, { headers: { "Cache-Control": "no-store" } });
}
