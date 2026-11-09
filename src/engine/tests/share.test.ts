import { describe, expect, it } from "vitest";
import { decodeDeal, encodeDeal, makeOffer, type SharedDeal } from "../index";
import { randomOffer, seededRandom } from "./helpers/seeded-random";

describe("share link", () => {
  const rand = seededRandom(77);

  it("round-trips 50 generated deals", async () => {
    for (let i = 0; i < 50; i++) {
      const offers = Array.from({ length: 1 + (i % 4) }, () => randomOffer(rand));
      const state: SharedDeal = {
        v: 1,
        offers,
        labels: offers.map((_, j) => (j === 0 ? "My baseline" : `Offer ${j}`)),
        vehicle: i % 2 ? { year: 2024, make: "Honda", model: "Accord", trim: "EX" } : undefined,
      };
      const fragment = await encodeDeal(state);
      expect(fragment).toMatch(/^[A-Za-z0-9_-]+$/);
      const back = await decodeDeal("#" + fragment);
      expect(back).toEqual(state);
    }
  });

  it("stays short enough to share", async () => {
    const offers = Array.from({ length: 4 }, () => randomOffer(rand));
    const fragment = await encodeDeal({ v: 1, offers, labels: [] });
    expect(fragment.length).toBeLessThan(900);
  });

  it("rejects damaged or hostile fragments", async () => {
    expect(await decodeDeal("")).toBeNull();
    expect(await decodeDeal("not-a-deal")).toBeNull();
    expect(await decodeDeal("A".repeat(30_000))).toBeNull();
    const ok = await encodeDeal({ v: 1, offers: [makeOffer({ price: 30000, fees: 0, addons: 0, down: 0, apr: 5, months: 60, taxRate: 0.07 })], labels: [] });
    expect(await decodeDeal(ok.slice(0, -6))).toBeNull();
  });
});
