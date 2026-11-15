import { describe, expect, it } from "vitest";
import { computeDeal, formatCents, makeOffer } from "@/engine";
import { whatIfs } from "./whatif";

const o = makeOffer({ price: 31500, fees: 900, addons: 1899, down: 3000, apr: 7.9, months: 84, taxRate: 0.0725 });

describe("whatIfs", () => {
  it("works out other loan lengths with the calculator, leaving out the current one", () => {
    const w = whatIfs(o);
    expect(w.text).toContain(`At 60 months: payment ${formatCents(computeDeal({ ...o, months: 60 }).payCents)}`);
    expect(w.text).not.toContain("At 84 months");
    expect(w.text).toContain("At 48 months");
  });
  it("says how the total changes", () => {
    expect(whatIfs(o).text).toMatch(/At 60 months: payment \$[\d,.]+, total \$[\d,]+ \(\$[\d,]+ less than now\)/);
  });
  it("includes the extras and the extra down payment cases", () => {
    const w = whatIfs(o);
    expect(w.text).toContain("Without the extras:");
    expect(w.text).toContain("With $1,000 more down:");
  });
  it("leaves out the extras case when there are none", () => {
    expect(whatIfs(makeOffer({ ...o, addons: 0 })).text).not.toContain("Without the extras");
  });
  it("gives back every figure in the text, so none of them is a surprise to the guard", () => {
    const w = whatIfs(o);
    expect(w.figures.length).toBeGreaterThan(10);
    expect(w.figures).toContain(60);
  });
  it("is empty with no price or nothing borrowed", () => {
    expect(whatIfs(makeOffer({ ...o, price: 3000, down: 90000 })).text).toBe("");
  });
});
