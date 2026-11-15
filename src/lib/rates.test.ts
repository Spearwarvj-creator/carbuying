import { describe, expect, it } from "vitest";
import { RATE_REFERENCE } from "@/data/rates";
import { bandAverage, rateStanding } from "./rates";

describe("rate reference", () => {
  it("has five bands, each higher than the one before, new below used", () => {
    expect(RATE_REFERENCE.bands).toHaveLength(5);
    for (let i = 1; i < 5; i++) {
      expect(RATE_REFERENCE.bands[i].new).toBeGreaterThan(RATE_REFERENCE.bands[i - 1].new);
      expect(RATE_REFERENCE.bands[i].used).toBeGreaterThan(RATE_REFERENCE.bands[i - 1].used);
    }
    for (const b of RATE_REFERENCE.bands) expect(b.used).toBeGreaterThan(b.new);
  });
  it("names the source, quarter and scoring model", () => {
    expect(RATE_REFERENCE.asOf).toMatch(/^Q[1-4] 20\d\d$/);
    expect(RATE_REFERENCE.url).toMatch(/^https:\/\/www\.experian\.com\//);
  });
});

describe("rateStanding", () => {
  it("is near within a point, above or below outside it", () => {
    expect(bandAverage("prime", "new")).toBe(6.15);
    expect(rateStanding(6.9, "prime", "new")).toMatchObject({ standing: "near", points: 0.75 });
    expect(rateStanding(7.9, "prime", "new")).toMatchObject({ standing: "above", points: 1.75 });
    expect(rateStanding(4.5, "prime", "new")).toMatchObject({ standing: "below", points: -1.65 });
  });
});
