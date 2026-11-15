import { RATE_REFERENCE, type CreditBand } from "@/data/rates";

export type CarKind = "new" | "used";

export const bandAverage = (band: CreditBand, kind: CarKind): number => RATE_REFERENCE.bands.find((b) => b.key === band)![kind];

export type Standing = "below" | "near" | "above";

/**
 * Where a buyer's rate sits against the average for their credit band. "Near" is within one percentage point either
 * way, because a lender's quote depends on more than the band. The difference is in points, to two places.
 */
export function rateStanding(apr: number, band: CreditBand, kind: CarKind): { standing: Standing; points: number; average: number } {
  const average = bandAverage(band, kind);
  const points = Math.round((apr - average) * 100) / 100;
  return { standing: Math.abs(points) <= 1 ? "near" : points > 0 ? "above" : "below", points, average };
}
