import { payment } from "./amortize";
import { computeDeal, type Offer } from "./offer";
import { toCents } from "./money";

export type TrailKey = "price" | "fees" | "addons" | "trade" | "rebate" | "loan" | "rate" | "term";

export interface TrailStep {
  key: TrailKey;
  cents: number;
}

export interface Trail {
  /** Steps in a fixed order. They add up exactly to totalCents. */
  steps: TrailStep[];
  /** Change in total paid, from the two rounded totals. */
  totalCents: number;
  /** Change in monthly payment, from the two rounded payments. */
  monthlyCents: number;
  /** Rounding remainder that was folded into the last non-zero step. */
  remainderCents: number;
}

/**
 * Where the money moved between offer a and offer b.
 *
 * Principal steps are applied one at a time in a fixed order: price (with its
 * tax), fees, add-ons (with their tax), trade-in. Then the interest change is
 * split in three: the bigger loan at the old rate and term, the rate change,
 * the term change. Any rounding remainder goes to the last non-zero step so
 * the steps equal the change in the rounded totals.
 */
export function trail(a: Offer, b: Offer): Trail {
  const da = computeDeal(a);
  const db = computeDeal(b);

  // Offers with the old down payment, changed one item at a time.
  const s1: Offer = { ...a, price: b.price, taxRate: b.taxRate, taxDifferenceOnly: b.taxDifferenceOnly, feesTaxed: b.feesTaxed, addonsTaxed: b.addonsTaxed };
  const s2: Offer = { ...s1, fees: b.fees };
  const s3: Offer = { ...s2, addons: b.addons };
  const s4: Offer = { ...s3, tradeAllowance: b.tradeAllowance, tradePayoff: b.tradePayoff };
  const s5: Offer = { ...s4, rebate: b.rebate };

  const f0 = da.finRaw;
  const f1 = computeDeal(s1).finRaw;
  const f2 = computeDeal(s2).finRaw;
  const f3 = computeDeal(s3).finRaw;
  const f4 = computeDeal(s4).finRaw;
  const f5 = computeDeal(s5).finRaw;

  const i0 = da.interest;
  const ia = interestAt(db.fin, a.apr, a.months);
  const ib = interestAt(db.fin, b.apr, a.months);

  const raw: Array<[TrailKey, number]> = [
    ["price", f1 - f0],
    ["fees", f2 - f1],
    ["addons", f3 - f2],
    ["trade", f4 - f3],
    ["rebate", f5 - f4],
    ["loan", ia - i0],
    ["rate", ib - ia],
    ["term", db.interest - ib],
  ];

  const steps: TrailStep[] = raw.map(([key, v]) => ({ key, cents: toCents(v) }));
  const totalCents = db.totalCents - da.totalCents;
  const sum = steps.reduce((s, x) => s + x.cents, 0);
  const remainderCents = totalCents - sum;
  if (remainderCents !== 0) {
    let placed = false;
    for (let i = steps.length - 1; i >= 0; i--) {
      if (steps[i].cents !== 0) {
        steps[i].cents += remainderCents;
        placed = true;
        break;
      }
    }
    if (!placed) steps[steps.length - 1].cents += remainderCents;
  }
  return { steps, totalCents, monthlyCents: db.payCents - da.payCents, remainderCents };
}

function interestAt(fin: number, apr: number, months: number): number {
  if (fin <= 0) return 0;
  return payment(fin, apr, months) * months - fin;
}
