import { describe, expect, it } from "vitest";
import { makeOffer } from "@/engine";
import { segment, termsIn } from "./gloss";
import { everyday, spotlight } from "./spotlight";

const entries = [
  { id: "apr", match: ["APR", "annual percentage rate"] },
  { id: "otd", match: ["out-the-door price", "out the door"] },
  { id: "price", match: ["price"] },
  { id: "tasa", match: ["tasa de interés"] },
];

describe("segment", () => {
  it("marks whole words only, in any case", () => {
    const p = segment("The apr is high, but april and caprice are not.", entries);
    expect(p.filter((x) => x.id).map((x) => x.text)).toEqual(["apr"]);
  });
  it("prefers the longest phrase", () => {
    const p = segment("The out-the-door price includes tax.", entries);
    expect(p.find((x) => x.id)).toMatchObject({ id: "otd", text: "out-the-door price" });
    expect(p.filter((x) => x.id === "price")).toHaveLength(0);
  });
  it("marks each term once by default and every time when asked", () => {
    expect(segment("APR and APR again", entries).filter((x) => x.id)).toHaveLength(1);
    expect(segment("APR and APR again", entries, false).filter((x) => x.id)).toHaveLength(2);
  });
  it("keeps the text exactly when put back together", () => {
    const t = "Ask: is the APR final? What is the out-the-door price?";
    expect(segment(t, entries, false).map((x) => x.text).join("")).toBe(t);
  });
  it("handles accented words and empty text", () => {
    expect(segment("La tasa de interés es 7%.", entries).find((x) => x.id)).toMatchObject({ id: "tasa" });
    expect(segment("", entries)).toEqual([{ text: "" }]);
    expect(segment("nothing here", [])).toEqual([{ text: "nothing here" }]);
  });
  it("is not fooled by characters that mean something in a pattern", () => {
    expect(segment("a (b) c", [{ id: "x", match: ["(b)"] }])).toBeDefined();
  });
});

describe("termsIn", () => {
  it("lists each term once in the order met", () => {
    expect(termsIn("Price, then APR, then the price again, then annual percentage rate", entries)).toEqual(["price", "apr"]);
  });
});

const base = { fees: 400, addons: 0, down: 3000, apr: 6, months: 60, taxRate: 0.07 };
describe("spotlight", () => {
  it("is null with no price", () => expect(spotlight(makeOffer({ ...base, price: 0.0 } as never))).toBeNull());
  it("points at extras when they cost a lot", () => {
    const m = spotlight(makeOffer({ ...base, price: 30000, addons: 3000 }))!;
    expect(m.key).toBe("extras");
    expect(m.dollars).toBeGreaterThan(3000);
    expect(m.other).toBeGreaterThan(0);
  });
  it("points at an old loan rolled in before anything else", () => {
    const m = spotlight(makeOffer({ ...base, price: 30000, addons: 3000, tradeAllowance: 5000, tradePayoff: 12000 }))!;
    expect(m.key).toBe("trade");
  });
  it("points at a long loan, with what a shorter one would save", () => {
    const m = spotlight(makeOffer({ ...base, price: 30000, apr: 7.5, months: 84 }))!;
    expect(m.key).toBe("length");
    expect(m.dollars).toBeGreaterThan(0);
  });
  it("points at a high rate", () => {
    expect(spotlight(makeOffer({ ...base, price: 20000, apr: 11, months: 48 }))!.key).toBe("rate");
  });
  it("points at high fees", () => {
    expect(spotlight(makeOffer({ ...base, price: 20000, fees: 1200, apr: 4, months: 48 }))!.key).toBe("fees");
  });
  it("falls back to the price", () => {
    const m = spotlight(makeOffer({ ...base, price: 30000, apr: 4, months: 48 }))!;
    expect(m.key).toBe("price");
    expect(m.other).toBeGreaterThan(50);
  });
});

describe("everyday", () => {
  it("gives the cost a day and the interest in payments", () => {
    const e = everyday(makeOffer({ ...base, price: 30000 }))!;
    expect(e.perDay).toBeGreaterThan(5);
    expect(e.perDay).toBeLessThan(30);
    expect(e.interestPayments).toBeGreaterThan(0);
    expect(e.payments).toBe(60);
  });
  it("is null with nothing borrowed", () => {
    expect(everyday(makeOffer({ ...base, price: 3000, down: 50000 }))).toBeNull();
  });
});
