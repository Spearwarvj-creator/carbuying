import { describe, expect, it } from "vitest";
import { checkVin } from "../index";
import fixtures from "./fixtures/vin-nhtsa.json";

describe("local VIN check digit", () => {
  it("accepts the sample VIN", () => {
    const r = checkVin("1HGCM82633A004352");
    expect(r.wellFormed).toBe(true);
    expect(r.checkDigitOk).toBe(true);
    expect(r.expected).toBe("3");
  });

  it("flags the sample VIN with its last character changed", () => {
    // Every other character feeds the 9th, so changing the last one breaks the check digit.
    const r = checkVin("1HGCM82633A004353");
    expect(r.wellFormed).toBe(true);
    expect(r.checkDigitOk).toBe(false);
    expect(r.problem).toBe("check-digit");
  });

  it("flags a wrong 9th character", () => {
    const r = checkVin("1HGCM82643A004352");
    expect(r.checkDigitOk).toBe(false);
  });

  it("flags length and characters", () => {
    expect(checkVin("NOTAVIN").problem).toBe("length");
    expect(checkVin("1HGCM82633A00435O").problem).toBe("characters");
  });

  it("ignores spaces, dashes and case", () => {
    expect(checkVin("1hgcm 8263-3a004352").checkDigitOk).toBe(true);
  });
});

interface Fixture {
  vin: string;
  nhtsaErrorCode: string;
  nhtsaCheckDigitOk: boolean;
}

describe("agreement with NHTSA on 30 VINs", () => {
  const list = fixtures as Fixture[];

  it("has 30 fixtures, including an X check digit and both outcomes", () => {
    expect(list.length).toBe(30);
    expect(list.some((f) => f.vin[8] === "X")).toBe(true);
    expect(list.some((f) => f.nhtsaCheckDigitOk)).toBe(true);
    expect(list.some((f) => !f.nhtsaCheckDigitOk)).toBe(true);
  });

  it("matches NHTSA's check-digit answer on every VIN", () => {
    const disagreements = list.filter((f) => checkVin(f.vin).checkDigitOk !== f.nhtsaCheckDigitOk);
    expect(disagreements).toEqual([]);
  });
});
