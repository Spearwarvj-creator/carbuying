import { describe, expect, it } from "vitest";
import {
  amortizationSchedule,
  computeDeal,
  costBreakdown,
  extrasRealCostCents,
  makeOffer,
  paymentEquivalents,
  paymentsAddUp,
  priceFromPayment,
} from "../index";
import { randomOffer, seededRandom } from "./helpers/seeded-random";

const offer1 = makeOffer({ price: 31500, fees: 900, addons: 0, down: 3000, apr: 7.9, months: 60, taxRate: 0.07 });
const offer2 = makeOffer({ price: 31500, fees: 900, addons: 1899, down: 3000, apr: 7.9, months: 84, taxRate: 0.07 });

describe("payments add up", () => {
  it("matches the engine's total when the payment is exact", () => {
    const d = computeDeal(offer2);
    expect(Math.round(paymentsAddUp(d.pay, 84, 3000) * 100)).toBe(d.totalCents);
  });
  it("a round payment times months, plus a down payment", () => {
    expect(paymentsAddUp(522, 84)).toBe(43848);
    expect(paymentsAddUp(522, 84, 3000)).toBe(46848);
  });
});

describe("cost breakdown, golden example", () => {
  it("Offer 2 splits into car, tax and fees, extras and interest, to the cent", () => {
    const b = costBreakdown(offer2);
    expect(b.carCents).toBe(3_150_000);
    expect(b.taxFeesCents).toBe(310_500);
    expect(b.extrasCents).toBe(203_193);
    expect(b.rolledInCents).toBe(0);
    expect(b.interestCents).toBe(1_026_131);
    expect(b.totalCents).toBe(4_689_824);
  });
  it("Offer 1 has no extras", () => {
    const b = costBreakdown(offer1);
    expect(b.extrasCents).toBe(0);
    expect(b.totalCents).toBe(4_135_944);
  });
});

describe("cost breakdown, 10,000 seeded random deals", () => {
  const rand = seededRandom(20261110);
  const deals = Array.from({ length: 10_000 }, () => randomOffer(rand)).filter((o) => computeDeal(o).finRaw > 0);

  it("the parts always add up to the total", () => {
    expect(deals.length).toBeGreaterThan(8000);
    for (const o of deals) {
      const b = costBreakdown(o);
      expect(b.carCents + b.taxFeesCents + b.extrasCents + b.rolledInCents + b.interestCents).toBe(b.totalCents);
    }
  });
  it("no part other than the car is ever negative", () => {
    for (const o of deals) {
      const b = costBreakdown(o);
      expect(b.taxFeesCents).toBeGreaterThanOrEqual(0);
      expect(b.extrasCents).toBeGreaterThanOrEqual(0);
      expect(b.rolledInCents).toBeGreaterThanOrEqual(0);
      expect(b.interestCents).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("what the extras really cost", () => {
  it("is more than the sticker price and tax, because of interest", () => {
    const real = extrasRealCostCents(offer2);
    expect(real).toBeGreaterThan(203_193);
    expect(real).toBeGreaterThanOrEqual(265_000);
    expect(real).toBeLessThanOrEqual(265_500);
  });
  it("is zero when there are no extras", () => {
    expect(extrasRealCostCents(offer1)).toBe(0);
  });
});

describe("payment equivalents", () => {
  it("5,538.80 over a 522.60 payment is about 10.6 payments", () => {
    expect(paymentEquivalents(553_880, 52_260)).toBe(10.6);
  });
  it("handles a zero payment", () => {
    expect(paymentEquivalents(1000, 0)).toBe(0);
  });
});

describe("amortization schedule", () => {
  it("interest adds up to the loan's interest and principal to the amount financed", () => {
    const d = computeDeal(offer2);
    const rows = amortizationSchedule(offer2);
    expect(rows).toHaveLength(84);
    const interest = rows.reduce((s, r) => s + r.interest, 0);
    const principal = rows.reduce((s, r) => s + r.principal, 0);
    expect(Math.abs(interest - d.interest)).toBeLessThan(0.01);
    expect(Math.abs(principal - d.fin)).toBeLessThan(0.01);
  });
  it("interest is front-loaded", () => {
    const rows = amortizationSchedule(offer2);
    expect(rows[0].interest).toBeGreaterThan(rows[83].interest);
  });
});

describe("price from payment", () => {
  it("round trips: the price it finds gives back the payment", () => {
    const rand = seededRandom(7);
    for (let i = 0; i < 500; i++) {
      const pay = 150 + Math.floor(rand() * 900);
      const apr = Math.floor(rand() * 2000) / 100;
      const months = 12 * (1 + Math.floor(rand() * 8));
      const down = Math.floor(rand() * 5000);
      const taxRate = Math.floor(rand() * 900) / 10000;
      const fees = Math.floor(rand() * 1500);
      const price = priceFromPayment({ pay, apr, months, down, taxRate, fees });
      if (price <= 0) continue;
      const d = computeDeal(makeOffer({ price, fees, addons: 0, down, apr, months, taxRate }));
      expect(Math.abs(d.pay - pay)).toBeLessThan(0.01);
    }
  });
  it("never goes below zero", () => {
    expect(priceFromPayment({ pay: 10, apr: 5, months: 12, down: 0, taxRate: 0.1, fees: 5000 })).toBe(0);
  });
});
