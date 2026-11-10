import { describe, expect, it } from "vitest";
import { decodeVin, getRatings, listMakes, listModels, listRecalls } from "@/server/nhtsa";
import { getMpg } from "@/server/epa";

// Live calls to NHTSA and the EPA. Run with: npm run test:contract
// These check the shapes our routes promise to the interface. Counts are
// compared loosely because the services add records over time.

describe("NHTSA vPIC", () => {
  it("decodes the sample VIN cleanly", async () => {
    const r = await decodeVin("1HGCM82633A004352");
    expect(r.status).toBe("clean");
    expect(r.vehicle).toMatchObject({ year: 2003, make: "HONDA", model: "Accord", trim: "EX-V6", bodyClass: "Coupe" });
  });

  it("reports the altered VIN as a check digit problem", async () => {
    const r = await decodeVin("1HGCM82633A004353");
    expect(r.status).toBe("check-digit");
    expect(r.errorCodes).toContain("1");
  });

  it("treats a garbage string as unreadable without calling the service", async () => {
    const r = await decodeVin("NOTAVIN");
    expect(r.status).toBe("unreadable");
    expect(r.vehicle).toBeNull();
  });

  it("lists makes and models", async () => {
    const makes = await listMakes();
    expect(makes.length).toBeGreaterThan(150);
    expect(makes).toContain("HONDA");
    const models = await listModels("honda", 2024);
    expect(models).toContain("Accord");
    expect(models).toContain("Civic");
  });
});

describe("NHTSA recalls and ratings", () => {
  it("finds model-year recalls for a 2020 Honda Accord", async () => {
    const r = await listRecalls("honda", "accord", 2020);
    expect(r.scope).toBe("model-year");
    expect(r.count).toBeGreaterThan(0);
    expect(r.recalls[0]).toMatchObject({ campaign: expect.stringMatching(/^\d\dV\d+/), component: expect.any(String) });
  });

  it("reads the safety ratings for a 2020 Honda Accord", async () => {
    const r = await getRatings("honda", "accord", 2020);
    expect(r.rated).toBe(true);
    expect(r.overall).toBe("5");
    expect(r.frontCrash).toBe("5");
    expect(r.sideCrash).toBe("5");
    expect(r.rollover).toBe("5");
  });
});

describe("EPA fuel economy", () => {
  it("returns EPA figures for a 2020 Honda Accord", async () => {
    const r = await getMpg("Honda", "Accord", 2020);
    expect(r.found).toBe(true);
    expect(r.source).toBe("EPA estimate");
    expect(r.options.length).toBeGreaterThan(0);
    expect(r.combined).toBeGreaterThan(20);
    expect(r.annualFuelCost).toBeGreaterThan(500);
  });

  it("finds a model the EPA names differently (the safety agency's Civic is the EPA's Civic 4Dr)", async () => {
    const r = await getMpg("Honda", "Civic", 2020);
    expect(r.found).toBe(true);
    expect(r.options.length).toBeGreaterThan(0);
    expect(r.combined).toBeGreaterThan(20);
  });

  it("answers found: false, not an error, for a model it does not know", async () => {
    const r = await getMpg("Honda", "Not A Real Model", 2020);
    expect(r.found).toBe(false);
    expect(r.options).toEqual([]);
  });
});
