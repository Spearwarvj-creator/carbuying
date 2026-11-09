import { describe, expect, it } from "vitest";
import { checkOffer, computeDeal, formatCents, formatSignedCents, makeOffer, payment, solveLever, splitCents, trail } from "../index";

const base = makeOffer({ price: 30000, fees: 600, addons: 0, down: 3000, apr: 6, months: 60, taxRate: 0.07 });

describe("edge cases", () => {
  it("0% APR pays principal divided by months", () => {
    expect(payment(12000, 0, 24)).toBe(500);
    const d = computeDeal({ ...base, apr: 0 });
    expect(d.interestCents).toBe(0);
  });

  it("a down payment bigger than the price leaves no loan", () => {
    const d = computeDeal({ ...base, down: 50000 });
    expect(d.fin).toBe(0);
    expect(d.pay).toBe(0);
  });

  it("negative equity adds to the loan", () => {
    const flat = computeDeal({ ...base, tradeAllowance: 5000, tradePayoff: 5000 });
    const under = computeDeal({ ...base, tradeAllowance: 5000, tradePayoff: 7000 });
    expect(under.fin - flat.fin).toBeCloseTo(2000, 6);
  });

  it("tax never goes below zero when the allowance is larger than the base", () => {
    const d = computeDeal({ ...base, taxDifferenceOnly: true, tradeAllowance: 40000 });
    expect(d.tax).toBe(0);
  });

  it("an already-matching offer needs a change of zero", () => {
    const r = solveLever(base, "price", "total", computeDeal(base).total + 1);
    expect(r!.amount).toBe(0);
  });

  it("a trail of identical offers is all zeros", () => {
    const t = trail(base, base);
    expect(t.totalCents).toBe(0);
    expect(t.steps.every((s) => s.cents === 0)).toBe(true);
  });

  it("input limits are enforced", () => {
    expect(checkOffer(base)).toEqual([]);
    expect(checkOffer({ ...base, price: 0 })).not.toEqual([]);
    expect(checkOffer({ ...base, fees: -1 })).not.toEqual([]);
    expect(checkOffer({ ...base, apr: 41 })).not.toEqual([]);
    expect(checkOffer({ ...base, months: 18 })).not.toEqual([]);
    expect(checkOffer({ ...base, months: 108 })).not.toEqual([]);
    expect(checkOffer({ ...base, months: 12 })).toEqual([]);
    expect(checkOffer({ ...base, months: 96 })).toEqual([]);
  });

  it("formats money", () => {
    expect(formatCents(4689824)).toBe("$46,898.24");
    expect(formatSignedCents(-11672)).toBe("-$116.72");
    expect(formatSignedCents(553880)).toBe("+$5,538.80");
    expect(splitCents(4689824)).toEqual({ dollars: "$46,898", cents: "24" });
  });
});
