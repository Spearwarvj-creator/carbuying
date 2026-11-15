/** The groups the dictionary is sorted into. */
export type LearnCat = "price" | "loan" | "extras" | "trade" | "lease" | "own";
export const LEARN_CATS: LearnCat[] = ["price", "loan", "extras", "trade", "lease", "own"];

/** The everyday pictures. Each term is paired with one so it can be tied to something the reader already knows. */
export type ArtKey =
  | "menu" | "receipt" | "package" | "keys" | "fineprint" | "recall" | "scale" | "fingerprint" | "phone" | "umbrella"
  | "coupon" | "friend" | "piggy" | "pizza" | "seesaw" | "coffee" | "report" | "handshake" | "calendar" | "gym"
  | "stairs" | "melt" | "swap" | "ladder" | "rent" | "fuel";

/** What the reader sees in their own language. */
export interface TermText {
  term: string;
  /** One short sentence. */
  plain: string;
  meaning: string;
  /** Why it matters to the buyer. */
  why: string;
  /** A question to put to the dealer. */
  ask: string;
  /** The everyday comparison, as one or two sentences. */
  daily: string;
  /** Words and phrases in text that stand for this term. Whole words only, any case. */
  match: string[];
}

/** What does not change with the language. */
export interface TermBase {
  id: string;
  cat: LearnCat;
  art: ArtKey;
  /** Ids of terms worth reading next. */
  related: string[];
}
