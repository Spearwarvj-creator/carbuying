import { describe, expect, it } from "vitest";
import { parseSpoken, wordsToDigitsEs } from "./spoken";

const v = (text: string, current?: { price?: number }) =>
  Object.fromEntries(Object.entries(parseSpoken(text, current, "es")).map(([k, f]) => [k, f.value]));

describe("wordsToDigitsEs", () => {
  it.each([
    ["treinta y un mil quinientos", "31500"],
    ["quinientos veintidos", "522"],
    ["quinientos veintidós", "522"],
    ["tres mil", "3000"],
    ["siete punto nueve", "7.9"],
    ["sesenta meses", "60 meses"],
    ["ciento cincuenta", "150"],
    ["veinticuatro mil novecientos noventa y nueve", "24999"],
    ["3 mil", "3000"],
    ["nada de numeros", "nada de numeros"],
  ])("%s", (said, digits) => expect(wordsToDigitsEs(said)).toBe(digits));
});

describe("parseSpoken in Spanish", () => {
  it("reads a full spoken quote", () => {
    expect(v("El precio es treinta y un mil quinientos, enganche tres mil, siete punto nueve por ciento a sesenta meses")).toEqual({
      price: 31500,
      down: 3000,
      apr: 7.9,
      months: 60,
    });
  });

  it("reads digits, a payment and years", () => {
    expect(v("pago mensual 522, 6 años, impuesto 7%")).toEqual({ monthlyPayment: 522, months: 72, taxRate: 7 });
  });

  it("reads the trade-in and what is still owed", () => {
    expect(v("mi auto a cambio vale 8000 y todavía debo 5000")).toEqual({ tradeAllowance: 8000, tradePayoff: 5000 });
  });

  it("reads fees and extras", () => {
    expect(v("cargos 900, extras 1899")).toEqual({ fees: 900, addons: 1899 });
  });

  it("does not take a total with everything in as the selling price", () => {
    expect(v("precio final 36000, precio 31500")).toEqual({ price: 31500 });
  });

  it("keeps a thousands dot from becoming a decimal", () => {
    expect(v("precio 31.500")).toEqual({ price: 31500 });
  });

  it("applies a take-off to the current price", () => {
    expect(v("quite 500 al precio", { price: 31500 })).toEqual({ price: 31000 });
  });

  it("finds nothing in a sentence with no numbers", () => {
    expect(v("hola buenas tardes")).toEqual({});
  });
});
