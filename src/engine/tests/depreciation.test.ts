import { describe, expect, it } from "vitest";
import { carValue, DEPRECIATION, termComparison, underwater, computeDeal, makeOffer, toCents, totalInterest } from "..";

describe("carValue", () => {
  it("starts at the price and only falls", () => {
    expect(carValue(30000, "typical", 0)).toBe(30000);
    let prev = 30000;
    for (let m = 1; m <= 96; m++) {
      const v = carValue(30000, "typical", m);
      expect(v).toBeLessThan(prev);
      prev = v;
    }
  });
  it("loses the first-year share in twelve months", () => {
    expect(carValue(30000, "typical", 12)).toBeCloseTo(30000 * (1 - DEPRECIATION.typical.first), 6);
  });
  it("keeps the three speeds inside the published five-year range of 35% to 60% lost", () => {
    for (const k of ["slow", "typical", "fast"] as const) {
      const lost = 1 - carValue(1, k, 60);
      expect(lost).toBeGreaterThan(0.35);
      expect(lost).toBeLessThan(0.6);
    }
  });
  it("orders the speeds", () => {
    expect(carValue(1, "slow", 48)).toBeGreaterThan(carValue(1, "typical", 48));
    expect(carValue(1, "typical", 48)).toBeGreaterThan(carValue(1, "fast", 48));
  });
});

describe("underwater", () => {
  it("is underwater at first when almost nothing is put down, and clears later", () => {
    const o = makeOffer({ price: 30000, fees: 900, addons: 1500, down: 0, apr: 8, months: 72, taxRate: 0.07 });
    const d = computeDeal(o);
    const u = underwater(o.price, d.fin, o.apr, o.months, "typical");
    expect(u.monthsUnder).toBeGreaterThan(12);
    expect(u.clearsAt).not.toBeNull();
    expect(u.worstGapCents).toBeGreaterThan(0);
    expect(u.points[0].balanceCents).toBe(d.finCents);
  });
  it("is never underwater with a large down payment on a slow-losing car", () => {
    const u = underwater(30000, 15000, 5, 60, "slow");
    expect(u.monthsUnder).toBe(0);
    expect(u.clearsAt).toBeNull();
    expect(u.worstGapCents).toBe(0);
  });
  it("stays underwater longer on a longer loan", () => {
    const a = underwater(30000, 32000, 7, 48, "typical");
    const b = underwater(30000, 32000, 7, 84, "typical");
    expect(b.monthsUnder).toBeGreaterThan(a.monthsUnder);
  });
});

describe("termComparison", () => {
  it("lowers the payment and raises the interest as the term grows", () => {
    const rows = termComparison(25000, 7.9, 3000, 72);
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i].payCents).toBeLessThan(rows[i - 1].payCents);
      expect(rows[i].interestCents).toBeGreaterThan(rows[i - 1].interestCents);
    }
  });
  it("includes the current term once and agrees with the loan maths", () => {
    const rows = termComparison(25000, 7.9, 0, 60);
    expect(rows.filter((r) => r.months === 60)).toHaveLength(1);
    expect(rows.find((r) => r.months === 60)!.interestCents).toBe(toCents(totalInterest(25000, 7.9, 60)));
  });
  it("adds a current term that is not one of the usual ones", () => {
    expect(termComparison(25000, 7.9, 0, 96).map((r) => r.months)).toEqual([36, 48, 60, 72, 84, 96]);
  });
  it("is empty when nothing is borrowed", () => {
    expect(termComparison(0, 7.9, 0, 60)).toEqual([]);
  });
});
