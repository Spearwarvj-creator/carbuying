import { computeDeal, costBreakdown, extrasRealCostCents, type Offer } from "@/engine";

/**
 * "What matters most here": the one thing in this deal that moves the total the most, picked by fixed rules from the
 * calculator's own figures. The words come from strings; nothing here is written by an AI. Rules run in order and the
 * first that applies wins, so a buyer is pointed at one thing, not five.
 */
export type MatterKey = "trade" | "extras" | "length" | "rate" | "fees" | "price";

export interface Matter {
  key: MatterKey;
  /** Whole dollars, as figures for the sentence. */
  dollars: number;
  /** A second figure where the sentence needs one (payments, months, points). */
  other: number;
  /** The glossary entry that explains the matter. */
  gloss: string;
}

export function spotlight(o: Offer): Matter | null {
  if (o.price <= 0) return null;
  const d = computeDeal(o);
  const b = costBreakdown(o);
  const total = d.totalCents || 1;

  if (b.rolledInCents / total >= 0.05) return { key: "trade", dollars: Math.round(b.rolledInCents / 100), other: 0, gloss: "negative-equity" };

  const extras = extrasRealCostCents(o);
  if (extras / total >= 0.06) return { key: "extras", dollars: Math.round(extras / 100), other: d.payCents > 0 ? Math.round((extras / d.payCents) * 10) / 10 : 0, gloss: "add-ons" };

  if (o.months >= 72 && b.interestCents / total >= 0.15) {
    const shorter = computeDeal({ ...o, months: 60 });
    return { key: "length", dollars: Math.max(Math.round((d.totalCents - shorter.totalCents) / 100), 0), other: o.months, gloss: "loan-term" };
  }

  if (o.apr >= 9) return { key: "rate", dollars: Math.round(b.interestCents / 100), other: o.apr, gloss: "apr" };

  if (o.price > 0 && o.fees / o.price >= 0.03) return { key: "fees", dollars: Math.round(o.fees), other: 0, gloss: "doc-fee" };

  return { key: "price", dollars: Math.round(b.carCents / 100), other: Math.round((b.carCents / total) * 100), gloss: "selling-price" };
}

/** The payment in everyday terms: what it costs each day, and how many payments the interest alone equals. */
export function everyday(o: Offer): { perDay: number; interestPayments: number; payments: number } | null {
  if (o.price <= 0) return null;
  const d = computeDeal(o);
  if (d.payCents <= 0) return null;
  return {
    perDay: Math.round((d.pay * 12) / 365),
    interestPayments: Math.round((d.interestCents / d.payCents) * 10) / 10,
    payments: o.months,
  };
}
