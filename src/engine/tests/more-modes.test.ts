import { describe, expect, it } from "vitest";
import {
  aprFromMoneyFactor,
  budgetFromIncome,
  cashCompare,
  computeDeal,
  computeLease,
  costBreakdown,
  makeOffer,
  moneyFactorFromApr,
  taxRateFromAmount,
  trail,
  type LeaseInput,
} from "../index";

const base = makeOffer({ price: 30000, fees: 800, addons: 0, down: 2000, apr: 6, months: 60, taxRate: 0.07 });

describe("rebate", () => {
  it("lowers the amount borrowed by the rebate and not the tax", () => {
    const a = computeDeal(base);
    const b = computeDeal({ ...base, rebate: 1500 });
    expect(b.tax).toBe(a.tax);
    expect(b.otd).toBe(a.otd);
    expect(b.fin).toBeCloseTo(a.fin - 1500, 6);
    expect(b.totalCents).toBeLessThan(a.totalCents);
  });

  it("keeps the cost breakdown adding up to the total", () => {
    const o = { ...base, rebate: 1500, addons: 900, tradeAllowance: 5000, tradePayoff: 3000 };
    const b = costBreakdown(o);
    expect(b.carCents + b.taxFeesCents + b.extrasCents + b.rolledInCents + b.interestCents).toBe(b.totalCents);
  });

  it("shows a changed rebate as its own step in the trail", () => {
    const t = trail(base, { ...base, rebate: 1000 });
    const step = t.steps.find((s) => s.key === "rebate")!;
    expect(step.cents).toBeLessThan(0);
    expect(t.steps.reduce((s, x) => s + x.cents, 0)).toBe(t.totalCents);
  });
});

describe("tax from the dollars on the worksheet", () => {
  it("gives back the tax that was typed, to the cent", () => {
    const rate = taxRateFromAmount(base, 2150.5)!;
    const d = computeDeal({ ...base, taxRate: rate });
    expect(d.taxCents).toBe(215050);
  });

  it("counts taxed fees, and the difference after a trade", () => {
    const o = { ...base, feesTaxed: true, taxDifferenceOnly: true, tradeAllowance: 6000 };
    const rate = taxRateFromAmount(o, 1000)!;
    expect(rate).toBeCloseTo(1000 / (30000 + 800 - 6000), 10);
  });

  it("returns null for nothing taxed or an impossible amount", () => {
    expect(taxRateFromAmount({ ...base, price: 0 }, 500)).toBeNull();
    expect(taxRateFromAmount(base, 30000)).toBeNull();
    expect(taxRateFromAmount(base, -1)).toBeNull();
  });
});

const lease: LeaseInput = {
  price: 32000,
  msrp: 34000,
  residualPct: 60,
  moneyFactor: 0.0025,
  months: 36,
  down: 2000,
  rebate: 0,
  tradeAllowance: 0,
  tradePayoff: 0,
  fees: 900,
  taxRate: 0.07,
  milesAllowed: 12000,
  milesExpected: 15000,
  overageRate: 0.25,
};

describe("lease", () => {
  it("works the payment from cap cost, residual and money factor", () => {
    const r = computeLease(lease);
    // net cap 30,000; residual 20,400; depreciation 266.67; rent (30,000 + 20,400) x 0.0025 = 126; sum 392.67; tax 7%
    expect(r.netCapCost).toBe(30000);
    expect(r.residual).toBe(20400);
    expect(r.depreciation).toBeCloseTo(266.6667, 3);
    expect(r.rentCharge).toBeCloseTo(126, 6);
    expect(r.monthly).toBeCloseTo(392.6667 * 1.07, 3);
    expect(r.impliedApr).toBe(6);
  });

  it("adds up the cash due at signing and the whole cost", () => {
    const r = computeLease(lease);
    expect(r.driveOff).toBeCloseTo(2000 + 900 + r.monthly, 6);
    // 3,000 over each year for 3 years at 25 cents
    expect(r.overMiles).toBe(9000);
    expect(r.overageCents).toBe(225000);
    expect(r.totalCents).toBe(200000 + 90000 + r.monthlyCents * 36 + 225000);
  });

  it("charges nothing extra when the miles fit", () => {
    const r = computeLease({ ...lease, milesExpected: 10000 });
    expect(r.overageCents).toBe(0);
  });

  it("rejects a residual at or above the amount leased", () => {
    const r = computeLease({ ...lease, residualPct: 95 });
    expect(r.invalid).toBe(true);
    expect(r.monthlyCents).toBe(0);
  });

  it("converts between money factor and rate", () => {
    expect(aprFromMoneyFactor(moneyFactorFromApr(7.2))).toBeCloseTo(7.2, 10);
  });
});

describe("paying cash", () => {
  it("needs the out-the-door price less rebate and trade equity, and the loan adds the interest", () => {
    const o = { ...base, rebate: 1000, tradeAllowance: 4000, tradePayoff: 1000 };
    const d = computeDeal(o);
    const c = cashCompare(o);
    expect(c.cashCents).toBe(Math.round((d.otd - 1000 - 3000) * 100));
    expect(c.extraForLoanCents).toBe(d.interestCents);
    // With a down payment, cash plus interest is what the loan costs in all.
    expect(c.cashCents + c.extraForLoanCents).toBe(c.loanTotalCents);
  });
});

describe("budget from income", () => {
  it("allows ten percent of gross, less insurance and fuel", () => {
    expect(budgetFromIncome(6000, 150, 120)).toEqual({ carCostsCap: 600, paymentRoom: 330 });
  });
  it("never goes below zero", () => {
    expect(budgetFromIncome(1000, 200, 100).paymentRoom).toBe(0);
  });
});
