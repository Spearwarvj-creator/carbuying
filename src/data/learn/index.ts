import { BASE } from "./base";
import { EN_A } from "./en-a";
import { EN_B } from "./en-b";
import { EN_C } from "./en-c";
import type { LearnCat, TermBase, TermText } from "./types";

export * from "./types";

export const EN: Record<string, TermText> = { ...EN_A, ...EN_B, ...EN_C };

export interface LearnTerm extends TermBase, TermText {}

/** The dictionary in one language, in the order of the list above. */
export function termsFor(text: Record<string, TermText>): LearnTerm[] {
  return BASE.flatMap((b) => (text[b.id] ? [{ ...b, ...text[b.id] }] : []));
}

export const CAT_ORDER: LearnCat[] = ["price", "loan", "extras", "trade", "lease", "own"];
export { BASE };

