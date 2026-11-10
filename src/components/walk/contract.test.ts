import { describe, expect, it } from "vitest";
import { makeOffer } from "@/engine";
import { compareContract } from "./ContractCheck";

const offer = makeOffer({ price: 31500, fees: 900, addons: 0, down: 3000, apr: 7.9, months: 60, taxRate: 0.07 });
const found = (o: Record<string, number>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, { value: v, from: "photo" }]));
const status = (rows: ReturnType<typeof compareContract>, key: string) => rows.find((r) => r.key === key)?.status;

describe("compareContract", () => {
  it("matches the lines that agree and says which were not read", () => {
    const r = compareContract(found({ price: 31500, apr: 7.9, months: 60, monthlyPayment: 639.32 }), offer);
    expect(status(r, "price")).toBe("match");
    expect(status(r, "monthlyPayment")).toBe("match");
    expect(status(r, "fees")).toBe("missing");
  });
  it("finds a packed contract: added extras and a higher payment", () => {
    const r = compareContract(found({ price: 31500, addons: 1899, monthlyPayment: 676, apr: 7.9, months: 60 }), offer);
    expect(status(r, "addons")).toBe("differ");
    expect(status(r, "monthlyPayment")).toBe("differ");
  });
  it("finds a changed rate or term", () => {
    const r = compareContract(found({ apr: 9.9, months: 72 }), offer);
    expect(status(r, "apr")).toBe("differ");
    expect(status(r, "months")).toBe("differ");
  });
});
