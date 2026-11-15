import { describe, expect, it } from "vitest";
import { MINE_EN, MINE_ES } from "@/data/learn/mine";
import { BASE } from "@/data/learn";
import { computeDeal, makeOffer } from "@/engine";
import { mineLine, mineVals } from "./mine";

const o = makeOffer({ price: 31500, fees: 900, addons: 1899, down: 3000, apr: 7.9, months: 84, taxRate: 0.0725, tradeAllowance: 6000, tradePayoff: 9500 });
const figures = (s: string | null) => s?.match(/[$][\d,]+(?:[.]\d+)?|\d+(?:[.]\d+)?%/g) ?? [];

describe("In your deal lines", () => {
  it("covers the same terms in both languages, all of which exist", () => {
    expect(Object.keys(MINE_ES).sort()).toEqual(Object.keys(MINE_EN).sort());
    const ids = new Set(BASE.map((b) => b.id));
    for (const k of Object.keys(MINE_EN)) expect(ids.has(k), k).toBe(true);
  });
  it("uses the calculator's figures", () => {
    const d = computeDeal(o);
    const v = mineVals(o);
    expect(v.price).toBe("$31,500");
    expect(v.otd).toBe(`$${Math.round(d.otd).toLocaleString("en-US")}`);
    expect(v.financed).toBe(`$${Math.round(d.fin).toLocaleString("en-US")}`);
    expect(mineLine("apr", o, "en")).toContain("7.9%");
    expect(mineLine("negative-equity", o, "en")).toContain("$3,500");
  });
  it("says what a 60 month loan would change, and is silent about it when already 60", () => {
    expect(mineLine("loan-term", o, "en")).toMatch(/At 60 months the payment would be about \$[\d,.]+, and you would pay about \$[\d,]+ less in total/);
    expect(mineLine("loan-term", makeOffer({ ...o, months: 60 }), "en")).toBe("Your loan is 60 months.");
  });
  it("is null with no deal, and for terms with nothing to say", () => {
    expect(mineLine("apr", null, "en")).toBeNull();
    expect(mineLine("rebate", o, "en")).toBeNull();
    expect(mineLine("msrp", o, "en")).toBeNull();
  });
  it("writes every line in Spanish too, with the same figures", () => {
    for (const id of Object.keys(MINE_EN)) {
      const en = mineLine(id, o, "en");
      const es = mineLine(id, o, "es");
      expect(es === null, id).toBe(en === null);
      expect(figures(es), id).toEqual(figures(en));
    }
  });
});
