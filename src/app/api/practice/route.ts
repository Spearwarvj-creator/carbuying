import type { NextRequest } from "next/server";
import { practice, practiceInput } from "@/server/language";
import { aiRoute } from "../_ai-route";

/** One turn of practice with a pretend finance manager. Needs a key. */
export const POST = (request: NextRequest) => aiRoute(request, practiceInput, "practice", (input) => practice(input), { needsKey: true });
