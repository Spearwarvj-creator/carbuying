import { describe, expect, it } from "vitest";
import { parseSpoken, wordsToDigits } from "./spoken";

const v = (text: string) => Object.fromEntries(Object.entries(parseSpoken(text)).map(([k, f]) => [k, f.value]));

describe("wordsToDigits", () => {
  it.each([
    ["thirty one thousand five hundred", "31500"],
    ["seven point nine", "7.9"],
    ["five twenty two", "522"],
    ["twenty four ninety nine", "2499"],
    ["a hundred and fifty", "150"],
    ["two grand", "2000"],
    ["sixty months", "60 months"],
    ["forty five hundred", "4500"],
    ["twelve fifty", "1250"],
    ["no numbers here", "no numbers here"],
  ])("%s", (said, digits) => expect(wordsToDigits(said)).toBe(digits));
});

describe("parseSpoken", () => {
  it("reads a full spoken quote", () => {
    expect(v("The price is thirty one five hundred, down three thousand, seven point nine percent for sixty months")).toEqual({
      price: 31500,
      down: 3000,
      apr: 7.9,
      months: 60,
    });
  });
  it("reads digits and symbols", () => {
    expect(v("Selling price $31,500, doc fee $900, sales tax 7%, down payment $3,000, 7.9% APR, 84 months")).toEqual({
      price: 31500, fees: 900, taxRate: 7, down: 3000, apr: 7.9, months: 84,
    });
  });
  it("reads the payment people say out loud", () => {
    expect(v("they want five twenty two a month for seventy two months")).toEqual({ monthlyPayment: 522, months: 72 });
  });
  it("keeps down payment and monthly payment apart", () => {
    expect(v("down payment 2500 and monthly payment 475")).toEqual({ down: 2500, monthlyPayment: 475 });
  });
  it("keeps the trade-in and what is owed apart", () => {
    expect(v("trade in 8000, I still owe 15000")).toEqual({ tradeAllowance: 8000, tradePayoff: 15000 });
  });
  it("turns a tax amount in dollars into a rate", () => {
    const d = parseSpoken("price 30000 sales tax 2100");
    expect(d.taxRate?.value).toBe(7);
  });
  it("reads years as months", () => expect(v("a five year loan at 6.5 percent")).toMatchObject({ months: 60, apr: 6.5 }));
  it("reads k and grand", () => expect(v("extras 1.9k, down 3 grand")).toEqual({ addons: 1900, down: 3000 }));
  it("does not take an out-the-door total for the selling price", () => {
    expect(v("out the door is 36000, price 31500")).toEqual({ price: 31500 });
  });
  it("takes an amount off the price the buyer already has", () => {
    expect(Object.fromEntries(Object.entries(parseSpoken("take 500 off the price", { price: 31500 })).map(([k, f]) => [k, f.value]))).toEqual({ price: 31000 });
    expect(parseSpoken("knock two thousand off", { price: 20000 }).price?.value).toBe(18000);
  });
  it("ignores a take-off with no price to take it from", () => expect(v("take 500 off the price")).toEqual({}));
  it("drops a value outside the allowed range", () => expect(v("interest 99 percent")).toEqual({}));
  it("finds nothing in ordinary words", () => expect(v("hello, I am looking at a blue car")).toEqual({}));
  it("records what it heard, so the buyer can check it", () => {
    expect(parseSpoken("down 3000").down?.from).toBe("down 3000");
  });
});
