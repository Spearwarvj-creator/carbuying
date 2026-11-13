import { loanSchedule } from "./schedule";
import { toCents } from "./money";

/**
 * An ESTIMATE of what the car is worth as it ages, used only to show whether the loan balance is above the car's value
 * ("underwater"). It is not a number from the dealer and not a valuation. Published figures vary: first-year loss from
 * about 12% to 24%, and 40% to 55% of the value gone after five years. The three speeds below sit inside that range
 * (about 37%, 49% and 58% lost after five years). The calculator's own figures never use this.
 */
export const DEPRECIATION = {
  slow: { first: 0.12, after: 0.08 },
  typical: { first: 0.18, after: 0.11 },
  fast: { first: 0.24, after: 0.14 },
} as const;
export type DepreciationKey = keyof typeof DEPRECIATION;
export const DEPRECIATION_KEYS: DepreciationKey[] = ["slow", "typical", "fast"];

/** The estimated value after `month` months. The first year loses `first` of the price, later years lose `after` a year. */
export function carValue(price: number, key: DepreciationKey, month: number): number {
  if (price <= 0 || month < 0) return 0;
  const r = DEPRECIATION[key];
  const firstYear = Math.min(month, 12) / 12;
  const later = Math.max(month - 12, 0) / 12;
  return price * Math.pow(1 - r.first, firstYear) * Math.pow(1 - r.after, later);
}

export interface Underwater {
  /** Points for the chart: month, balance and estimated value, in cents. */
  points: { month: number; balanceCents: number; valueCents: number }[];
  /** Months with the balance above the estimated value. 0 means never. */
  monthsUnder: number;
  /** The first month the balance is at or below the value. null if that does not happen within the loan. */
  clearsAt: number | null;
  /** The biggest gap (balance minus value), in cents. 0 if never underwater. */
  worstGapCents: number;
}

/** Walks the loan month by month and compares the balance with the estimated value of the car. */
export function underwater(price: number, financed: number, apr: number, months: number, key: DepreciationKey): Underwater {
  const sched = loanSchedule(financed, apr, months);
  const points = sched.map((p) => ({ month: p.month, balanceCents: p.balanceCents, valueCents: toCents(carValue(price, key, p.month)) }));
  const under = points.filter((p) => p.balanceCents > p.valueCents);
  // "Clears" means the balance drops to the value and stays there: the last month under, plus one.
  const lastUnder = under.length ? under[under.length - 1].month : -1;
  const clearsAt = lastUnder >= 0 && lastUnder < months ? lastUnder + 1 : null;
  return {
    points,
    monthsUnder: under.length,
    clearsAt,
    worstGapCents: under.reduce((m, p) => Math.max(m, p.balanceCents - p.valueCents), 0),
  };
}
