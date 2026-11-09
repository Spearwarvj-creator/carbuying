import { computeDeal, type Deal, type Offer } from "./offer";

/** What the buyer compares two offers on. */
export type Metric = "total" | "pay" | "otd";
/** What the buyer can ask the dealer to change. */
export type Lever = "price" | "fees" | "addons" | "rate" | "trade";

export const LEVERS: Lever[] = ["price", "fees", "addons", "rate", "trade"];

export function metricValue(d: Deal, metric: Metric): number {
  return metric === "total" ? d.total : metric === "pay" ? d.pay : d.otd;
}

/** The largest trade-in allowance raise the solver will try. */
export const TRADE_RAISE_LIMIT = 50_000;

/** A change a lever makes. amount is how much the ask is, in dollars or points. */
export function applyLever(o: Offer, lever: Lever, amount: number): Offer {
  switch (lever) {
    case "price":
      return { ...o, price: o.price - amount };
    case "fees":
      return { ...o, fees: o.fees - amount };
    case "addons":
      return { ...o, addons: amount >= o.addons ? 0 : o.addons - amount };
    case "rate":
      return { ...o, apr: Math.max(o.apr - amount, 0) };
    case "trade":
      return { ...o, tradeAllowance: o.tradeAllowance + amount };
  }
}

export interface LeverResult {
  lever: Lever;
  /** Dollars to take off (price, fees, add-ons), percentage points off the rate, or dollars added to the allowance. */
  amount: number;
  /** The new value of the item after the ask. */
  newValue: number;
  /** The metric after the ask. */
  resulting: number;
  /** The ask as a percent of the item it changes. Null for a trade-in. */
  percentOfItem: number | null;
}

/**
 * Finds the smallest single change that brings an offer down to the target on
 * the chosen measure. Bisection, 60 iterations, bounded by the size of the item,
 * and the result is rounded up to the step: 1 dollar, or 0.01 point for rates.
 * Returns null when even the largest allowed change cannot reach the target.
 * Add-ons are all or nothing: the lever removes them.
 */
export function solveLever(o: Offer, lever: Lever, metric: Metric, target: number): LeverResult | null {
  const value = (amount: number) => metricValue(computeDeal(applyLever(o, lever, amount)), metric);

  if (lever === "addons") {
    if (o.addons <= 0) return null;
    const after = value(o.addons);
    if (after > target) return null;
    return { lever, amount: o.addons, newValue: 0, resulting: after, percentOfItem: 100 };
  }

  const hi =
    lever === "price" ? o.price : lever === "fees" ? o.fees : lever === "rate" ? o.apr : TRADE_RAISE_LIMIT;
  const step = lever === "rate" ? 0.01 : 1;
  if (hi <= 0) return null;
  if (value(hi) > target) return null;

  let lo = 0;
  let h = hi;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + h) / 2;
    if (value(mid) <= target) h = mid;
    else lo = mid;
  }
  let amount = Math.ceil(h / step - 1e-9) * step;
  amount = lever === "rate" ? Math.round(amount * 100) / 100 : amount;
  amount += 0; // turns -0 into 0
  const changed = applyLever(o, lever, amount);
  const item =
    lever === "price" ? o.price : lever === "fees" ? o.fees : lever === "rate" ? o.apr : null;
  const newValue =
    lever === "price"
      ? changed.price
      : lever === "fees"
        ? changed.fees
        : lever === "rate"
          ? Math.round(changed.apr * 100) / 100
          : changed.tradeAllowance;
  return {
    lever,
    amount,
    newValue,
    resulting: value(amount),
    percentOfItem: item === null || item === 0 ? null : (amount / item) * 100,
  };
}

export interface WhatItTakes {
  metric: Metric;
  /** The offer that is lower on the metric. */
  winner: "a" | "b";
  loser: "a" | "b";
  target: number;
  loserNow: number;
  /** True when both offers are equal on the metric. */
  tie: boolean;
  /** One entry per lever. null means that lever alone cannot match. */
  levers: Array<{ lever: Lever; result: LeverResult | null }>;
}

/** For the offer that loses on the chosen measure, what each lever would take to match the other. */
export function whatItTakes(a: Offer, b: Offer, metric: Metric): WhatItTakes {
  const da = computeDeal(a);
  const db = computeDeal(b);
  const va = metricValue(da, metric);
  const vb = metricValue(db, metric);
  const winner: "a" | "b" = va <= vb ? "a" : "b";
  const loser: "a" | "b" = winner === "a" ? "b" : "a";
  const loserOffer = loser === "a" ? a : b;
  const target = winner === "a" ? va : vb;
  const loserNow = loser === "a" ? va : vb;
  const levers = LEVERS.map((lever) => ({ lever, result: solveLever(loserOffer, lever, metric, target) }));
  return { metric, winner, loser, target, loserNow, tie: va === vb, levers };
}
