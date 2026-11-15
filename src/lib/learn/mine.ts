import { MINE_EN, MINE_ES, type MineVals } from "@/data/learn/mine";
import { computeDeal, costBreakdown, extrasRealCostCents, formatCents, formatWhole, type Offer } from "@/engine";

/** The buyer's own figures for the "In your deal" lines, all from the calculator and already formatted. */
export function mineVals(o: Offer): MineVals {
  const d = computeDeal(o);
  const b = costBreakdown(o);
  const alt = o.months !== 60 && d.payCents > 0 ? computeDeal({ ...o, months: 60 }) : null;
  const diffCents = alt ? alt.totalCents - d.totalCents : 0;
  return {
    price: formatWhole(o.price),
    otd: formatWhole(d.otd),
    rest: formatWhole(Math.max(d.otd - o.price, 0)),
    fees: formatWhole(o.fees),
    tax: formatWhole(d.tax),
    rate: `${(o.taxRate * 100).toFixed(2).replace(/\.?0+$/, "")}%`,
    apr: o.apr,
    months: o.months,
    interest: formatWhole(d.interest),
    share: d.totalCents > 0 ? Math.round((b.interestCents / d.totalCents) * 100) : 0,
    financed: formatWhole(d.fin),
    pay: formatCents(d.payCents),
    perDay: formatWhole((d.pay * 12) / 365),
    down: formatWhole(o.down),
    addons: formatWhole(o.addons),
    addonsReal: formatWhole(extrasRealCostCents(o) / 100),
    allowance: formatWhole(o.tradeAllowance),
    payoff: formatWhole(o.tradePayoff),
    gap: formatWhole(Math.abs(d.equity)),
    rebate: formatWhole(o.rebate),
    alt: alt ? { months: 60, pay: formatCents(alt.payCents), diff: formatWhole(Math.abs(diffCents) / 100), more: diffCents > 0 } : null,
    raw: { fees: o.fees, addons: o.addons, down: o.down, allowance: o.tradeAllowance, payoff: o.tradePayoff, rebate: o.rebate, equity: d.equity },
  };
}

/** One sentence about this term in the buyer's own deal, or null when the term has nothing to say about it. */
export function mineLine(id: string, offer: Offer | null, lang: "en" | "es"): string | null {
  if (!offer || offer.price <= 0) return null;
  const f = (lang === "es" ? MINE_ES : MINE_EN)[id];
  return f ? f(mineVals(offer)) : null;
}

export const MINE_IDS = Object.keys(MINE_EN);
