import type { NextRequest } from "next/server";
import { translate, translateInput } from "@/server/language";
import { aiRoute } from "../_ai-route";

/** Dealer words in, plain words out. Needs a key. Costs one credit, given back if only the fixed text was shown. */
export const POST = (request: NextRequest) => aiRoute(request, translateInput, "explain", (input) => translate(input), { needsKey: true });
