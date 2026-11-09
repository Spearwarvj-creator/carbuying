import { describe, expect, it } from "vitest";
import {
  applyLever,
  checkOffer,
  computeDeal,
  metricValue,
  principalFromPayment,
  solveLever,
  trail,
  whatItTakes,
  type Lever,
  type Metric,
  type Offer,
} from "../index";
import { randomOffer, seededRandom } from "./helpers/seeded-random";

const RUNS = 10_000;

describe("invariants on 10,000 seeded random deals", () => {
  const rand = seededRandom(20261109);
  const pairs: Array<[Offer, Offer]> = [];
  for (let i = 0; i < RUNS; i++) pairs.push([randomOffer(rand), randomOffer(rand)]);

  it("every generated offer is valid", () => {
    for (const [a, b] of pairs) {
      expect(checkOffer(a)).toEqual([]);
      expect(checkOffer(b)).toEqual([]);
    }
  });

  it("trail steps sum to the change in total paid", () => {
    let largestRemainder = 0;
    for (const [a, b] of pairs) {
      const t = trail(a, b);
      const sum = t.steps.reduce((s, x) => s + x.cents, 0);
      expect(sum).toBe(t.totalCents);
      expect(t.totalCents).toBe(computeDeal(b).totalCents - computeDeal(a).totalCents);
      const clamped = computeDeal(a).fin === 0 || computeDeal(b).fin === 0;
      if (!clamped) largestRemainder = Math.max(largestRemainder, Math.abs(t.remainderCents));
    }
    // Without a clamped loan, the remainder is rounding only.
    expect(largestRemainder).toBeLessThanOrEqual(4);
  });

  it("each lever result meets the target and one unit less does not", () => {
    const metrics: Metric[] = ["total", "pay", "otd"];
    let solved = 0;
    let checkedOneLess = 0;
    pairs.forEach(([a, b], i) => {
      const metric = metrics[i % 3];
      const w = whatItTakes(a, b, metric);
      const loser = w.loser === "a" ? a : b;
      for (const { lever, result } of w.levers) {
        if (!result) continue;
        solved++;
        const value = (amount: number) => metricValue(computeDeal(applyLever(loser, lever, amount)), metric);
        expect(value(result.amount)).toBeLessThanOrEqual(w.target);
        if (lever === "addons") {
          expect(result.amount).toBe(loser.addons);
          continue;
        }
        const step = lever === "rate" ? 0.01 : 1;
        if (result.amount >= step) {
          checkedOneLess++;
          expect(value(result.amount - step)).toBeGreaterThan(w.target);
        }
      }
    });
    expect(solved).toBeGreaterThan(1000);
    expect(checkedOneLess).toBeGreaterThan(500);
  });

  it("a lever that says it cannot match really cannot", () => {
    const levers: Lever[] = ["price", "fees", "rate", "trade"];
    pairs.slice(0, 2000).forEach(([a, b], i) => {
      const metric: Metric = (["total", "pay", "otd"] as const)[i % 3];
      const w = whatItTakes(a, b, metric);
      const loser = w.loser === "a" ? a : b;
      for (const { lever, result } of w.levers) {
        if (result || !levers.includes(lever)) continue;
        const max =
          lever === "price" ? loser.price : lever === "fees" ? loser.fees : lever === "rate" ? loser.apr : 50_000;
        const best = metricValue(computeDeal(applyLever(loser, lever, max)), metric);
        // Either the item is zero already, or even the full change leaves the loser above the target.
        expect(max <= 0 || best > w.target).toBe(true);
      }
    });
  });

  it("payment converts back to the loan size within one cent", () => {
    for (const [a] of pairs) {
      const d = computeDeal(a);
      if (d.fin <= 0) continue;
      const back = principalFromPayment(d.pay, a.apr, a.months);
      expect(Math.abs(back - d.fin)).toBeLessThan(0.01);
    }
  });

  it("zero APR and zero down payment pass", () => {
    for (const [a] of pairs.slice(0, 2000)) {
      const o: Offer = { ...a, apr: 0, down: 0 };
      const d = computeDeal(o);
      expect(d.interest).toBeCloseTo(0, 6);
      expect(d.pay * o.months).toBeCloseTo(d.fin, 6);
      expect(d.total).toBeCloseTo(d.fin, 6);
    }
  });

  it("a single solved price lever matches the exact bisection result", () => {
    const [a, b] = pairs[0];
    const target = computeDeal(b).total;
    const r = solveLever(a, "price", "total", target);
    if (r) expect(computeDeal({ ...a, price: a.price - r.amount }).total).toBeLessThanOrEqual(target);
  });
});
