import type { NextRequest } from "next/server";
import { draft, draftInput } from "@/server/language";
import { aiRoute } from "../_ai-route";

/** Reword the ask in a tone or in Spanish. Without a key it returns the text unchanged. */
export const POST = (request: NextRequest) => aiRoute(request, draftInput, "draft", (input) => draft(input));
