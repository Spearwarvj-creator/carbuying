import { describe, expect, it } from "vitest";
import { lookupZip, placeLabel } from "@/lib/zip";

describe("ZIP table", () => {
  const spot: Array<[string, string]> = [
    ["30301", "Atlanta, GA"],
    ["90210", "Beverly Hills, CA"],
    ["10001", "New York, NY"],
    ["77001", "Houston, TX"],
    ["60601", "Chicago, IL"],
    ["99501", "Anchorage, AK"],
  ];

  it.each(spot)("%s is %s", async (zip, label) => {
    const place = await lookupZip(zip);
    expect(place).not.toBeNull();
    expect(placeLabel(place!)).toBe(label);
  });

  it("rejects anything that is not five digits", async () => {
    expect(await lookupZip("3030")).toBeNull();
    expect(await lookupZip("ABCDE")).toBeNull();
    expect(await lookupZip("T0A")).toBeNull();
  });

  it("returns null for a five-digit code that does not exist", async () => {
    expect(await lookupZip("00000")).toBeNull();
  });
});
