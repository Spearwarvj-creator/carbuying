import { ES_A } from "./es-a";
import { ES_B } from "./es-b";
import { ES_C } from "./es-c";
import type { TermText } from "./types";

/** The Spanish dictionary. Loaded only when Spanish is chosen, so English readers never download it. */
export const ES: Record<string, TermText> = { ...ES_A, ...ES_B, ...ES_C };
