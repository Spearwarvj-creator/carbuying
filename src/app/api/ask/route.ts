import type { NextRequest } from "next/server";
import { explain, askInput } from "@/server/language";
import { aiRoute } from "../_ai-route";

/** Explain one line of the deal in plain words. Works without a key, showing the fixed text. */
export const POST = (request: NextRequest) => aiRoute(request, askInput, "explain", (input) => explain(input));
