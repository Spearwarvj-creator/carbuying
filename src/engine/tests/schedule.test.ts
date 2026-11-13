import { describe, expect, it } from "vitest";
import { computeDeal, halfPaidMonth, loanSchedule, makeOffer, paymentSplit, totalInterest, toCents, payment } from "..";

describe("loanSchedule", () => {
  it("starts at the amount borrowed and ends at zero", () => {
    const s = loanSchedule(25000, 7.9, 72);
    expect(s).toHaveLength(73);
    expect(s[0]).toMatchObject({ month: 0, balanceCents: 2_500_000, interestPaidCents: 0 });
    expect(s[72].balanceCents).toBe(0);
  });
  it("adds interest up to the deal's interest, to the cent", () => {
    for (const [p, apr, m] of [[25000, 7.9, 72], [41234.56, 12.4, 84], [18000, 0, 48], [9999, 3.1, 24]] as const) {
      const s = loanSchedule(p, apr, m);
      expect(Math.abs(s[m].interestPaidCents - toCents(totalInterest(p, apr, m)))).toBeLessThanOrEqual(1);
    }
  });
  it("only falls, and falls slowest at the start of an interest-bearing loan", () => {
    const s = loanSchedule(30000, 9, 60);
    for (let i = 1; i < s.length; i++) expect(s[i].balanceCents).toBeLessThanOrEqual(s[i - 1].balanceCents);
    expect(s[0].balanceCents - s[1].balanceCents).toBeLessThan(s[59].balanceCents - s[60].balanceCents);
  });
  it("falls in a straight line with no interest", () => {
    const s = loanSchedule(12000, 0, 24);
    expect(s[12].balanceCents).toBe(600_000);
  });
  it("is empty when nothing is borrowed", () => {
    expect(loanSchedule(0, 5, 60)).toEqual([]);
    expect(loanSchedule(5000, 5, 0)).toEqual([]);
  });
  it("agrees with the deal on a real offer", () => {
    const deal = computeDeal(makeOffer({ price: 31500, fees: 900, addons: 1899, down: 3000, apr: 7.9, months: 84, taxRate: 0.0725 }));
    const s = loanSchedule(deal.fin, 7.9, 84);
    expect(Math.abs(s[84].interestPaidCents - deal.interestCents)).toBeLessThanOrEqual(1);
  });
});

describe("paymentSplit", () => {
  it("pays the most interest first and the least last, and always adds up to the payment", () => {
    const first = paymentSplit(25000, 7.9, 72, 1);
    const last = paymentSplit(25000, 7.9, 72, 72);
    expect(first.interestCents).toBe(toCents((25000 * 7.9) / 1200));
    expect(last.interestCents).toBeLessThan(first.interestCents / 10);
    expect(first.interestCents + first.principalCents).toBe(toCents(payment(25000, 7.9, 72)));
    expect(last.interestCents + last.principalCents).toBe(toCents(payment(25000, 7.9, 72)));
  });
  it("is zero outside the loan", () => {
    expect(paymentSplit(25000, 7.9, 72, 0)).toEqual({ interestCents: 0, principalCents: 0 });
    expect(paymentSplit(25000, 7.9, 72, 73)).toEqual({ interestCents: 0, principalCents: 0 });
  });
});

describe("halfPaidMonth", () => {
  it("comes later than the middle of a long loan at a high rate", () => {
    expect(halfPaidMonth(30000, 12, 84)).toBeGreaterThan(42);
  });
  it("is the middle with no interest", () => {
    expect(halfPaidMonth(12000, 0, 24)).toBe(12);
  });
});
