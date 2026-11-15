import { describe, expect, it } from "vitest";
import { computeDeal, makeOffer, priceFromOtd } from "..";

describe("priceFromOtd", () => {
  it("round-trips through the deal for many offers, to the cent", () => {
    let n = 0;
    for (const price of [8000, 19999.99, 31500, 54321.1]) {
      for (const taxRate of [0, 0.04, 0.0725, 0.1025]) {
        for (const addons of [0, 1899]) {
          for (const fees of [0, 899]) {
            for (const [addonsTaxed, feesTaxed] of [[true, false], [false, true], [true, true]] as const) {
              const o = makeOffer({ price, fees, addons, down: 0, apr: 7, months: 60, taxRate, addonsTaxed, feesTaxed });
              const otd = computeDeal(o).otdCents / 100;
              const back = priceFromOtd(o, otd);
              expect(Math.abs(back - price)).toBeLessThan(0.02);
              n++;
            }
          }
        }
      }
    }
    expect(n).toBeGreaterThan(100);
  });
  it("accounts for tax on the difference after a trade-in", () => {
    const o = makeOffer({ price: 30000, fees: 500, addons: 0, down: 0, apr: 7, months: 60, taxRate: 0.07, tradeAllowance: 10000, taxDifferenceOnly: true });
    const otd = computeDeal(o).otdCents / 100;
    expect(Math.abs(priceFromOtd(o, otd) - 30000)).toBeLessThan(0.02);
  });
  it("is zero when the total is smaller than the fees", () => {
    expect(priceFromOtd({ fees: 900, addons: 0, taxRate: 0.07, addonsTaxed: true, feesTaxed: false, tradeAllowance: 0, taxDifferenceOnly: false }, 500)).toBe(0);
  });
  it("is the total less fees and extras when there is no tax", () => {
    expect(priceFromOtd({ fees: 900, addons: 1000, taxRate: 0, addonsTaxed: true, feesTaxed: false, tradeAllowance: 0, taxDifferenceOnly: false }, 30000)).toBe(28100);
  });
});
