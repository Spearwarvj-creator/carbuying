import { describe, expect, it } from "vitest";
import { dealFlags } from "./flags";
import { makeOffer } from "./offer";

const base = { price: 30000, fees: 400, addons: 0, down: 3000, apr: 6, months: 60, taxRate: 0.07 };
const ids = (o: Parameters<typeof makeOffer>[0], quotedPay?: number) => dealFlags({ offer: makeOffer(o), quotedPay }).map((f) => f.id);

describe("dealFlags", () => {
  it("is quiet for an ordinary deal", () => expect(ids(base)).toEqual([]));
  it("flags a long loan and shows what the extra months cost", () => {
    const f = dealFlags({ offer: makeOffer({ ...base, months: 84 }) }).find((x) => x.id === "longTerm");
    expect(f?.severity).toBe("high");
    expect(f?.body).toMatch(/more in total/);
  });
  it("does not flag 72 months", () => expect(ids({ ...base, months: 72 })).not.toContain("longTerm"));
  it("flags high fees and extras with their real cost", () => {
    const f = dealFlags({ offer: makeOffer({ ...base, fees: 995, addons: 1899 }) });
    expect(f.map((x) => x.id)).toEqual(expect.arrayContaining(["highFees", "extras"]));
    expect(f.find((x) => x.id === "extras")?.body).toMatch(/monthly payments/);
  });
  it("flags a quoted payment that does not match", () => {
    expect(ids(base, 300)).toContain("packing");
    expect(ids(base, 0)).not.toContain("packing");
  });
  it("flags owing more than the trade is worth", () => expect(ids({ ...base, tradeAllowance: 5000, tradePayoff: 9000 })).toContain("underwater"));
  it("asks about a high rate, and about a missing tax", () => {
    expect(ids({ ...base, apr: 12 })).toContain("rate");
    expect(ids({ ...base, taxRate: 0 })).toContain("noTax");
  });
  it("puts the most serious first", () => {
    const f = dealFlags({ offer: makeOffer({ ...base, months: 84, apr: 16, taxRate: 0 }) });
    expect(f[0].severity).toBe("high");
  });
  it("gives no flags for an empty deal", () => expect(dealFlags({ offer: makeOffer({ ...base, price: 0 }) })).toEqual([]));
  it("every flag's figures cover the numbers in its own text", async () => {
    const { numbersAreAllowed } = await import("@/lib/guard");
    for (const f of dealFlags({ offer: makeOffer({ ...base, months: 84, fees: 995, addons: 1899, apr: 12, tradeAllowance: 4000, tradePayoff: 8000 }), quotedPay: 400 })) {
      expect(numbersAreAllowed(`${f.body} ${f.ask}`, f.figures), f.id).toBe(true);
    }
  });
});
