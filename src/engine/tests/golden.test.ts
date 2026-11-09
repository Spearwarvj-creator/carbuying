import { describe, expect, it } from "vitest";
import { computeDeal, makeOffer, solveLever, trail, whatItTakes, type Offer } from "../index";

// Golden vectors from the verified reference code (KICKOFF section 7).
// 7% tax on price and add-ons, fees untaxed, unless stated.
const T = 0.07;
const down = 3000;

const baseline = makeOffer({ price: 30000, fees: 600, addons: 0, down, apr: 6, months: 60, taxRate: T });
const offer1 = makeOffer({ price: 31500, fees: 900, addons: 0, down, apr: 7.9, months: 60, taxRate: T });
const offer2 = makeOffer({ price: 31500, fees: 900, addons: 1899, down, apr: 7.9, months: 84, taxRate: T });
const dealerA = makeOffer({ price: 31000, fees: 1200, addons: 0, down, apr: 7.9, months: 72, taxRate: T });
const dealerB = makeOffer({ price: 31800, fees: 600, addons: 899, down, apr: 6.9, months: 60, taxRate: T });

const steps = (a: Offer, b: Offer) => {
  const t = trail(a, b);
  const get = (k: string) => t.steps.find((s) => s.key === k)!.cents;
  return { t, get };
};

describe("offers", () => {
  it("baseline", () => {
    const d = computeDeal(baseline);
    expect(d.otdCents).toBe(3270000);
    expect(d.payCents).toBe(57418);
    expect(d.totalCents).toBe(3745105);
  });

  it("offer 1", () => {
    const d = computeDeal(offer1);
    expect(d.otdCents).toBe(3460500);
    expect(d.payCents).toBe(63932);
    expect(d.totalCents).toBe(4135944);
  });

  it("offer 2", () => {
    const d = computeDeal(offer2);
    expect(d.taxCents).toBe(233793);
    expect(d.otdCents).toBe(3663693);
    expect(d.finCents).toBe(3363693);
    expect(d.payCents).toBe(52260);
    expect(d.totalCents).toBe(4689824);
    expect(d.interestCents).toBe(1026131);
  });

  it("dealer A", () => {
    const d = computeDeal(dealerA);
    expect(d.otdCents).toBe(3437000);
    expect(d.payCents).toBe(54849);
    expect(d.totalCents).toBe(4249109);
    expect(d.interestCents).toBe(812109);
  });

  it("dealer B", () => {
    const d = computeDeal(dealerB);
    expect(d.otdCents).toBe(3558793);
    expect(d.payCents).toBe(64374);
    expect(d.totalCents).toBe(4162462);
    expect(d.interestCents).toBe(603669);
  });
});

describe("trails", () => {
  it("baseline to offer 1", () => {
    const { t, get } = steps(baseline, offer1);
    expect(get("price")).toBe(160500);
    expect(get("fees")).toBe(30000);
    expect(get("addons")).toBe(0);
    expect(get("trade")).toBe(0);
    expect(get("loan")).toBe(30474);
    expect(get("rate")).toBe(169865);
    expect(get("term")).toBe(0);
    expect(t.totalCents).toBe(390839);
    expect(t.monthlyCents).toBe(6514);
  });

  it("offer 1 to offer 2", () => {
    const { t, get } = steps(offer1, offer2);
    expect(get("price")).toBe(0);
    expect(get("fees")).toBe(0);
    expect(get("addons")).toBe(203193);
    expect(get("loan")).toBe(43425);
    expect(get("rate")).toBe(0);
    expect(get("term")).toBe(307262);
    expect(t.totalCents).toBe(553880);
    expect(t.monthlyCents).toBe(-11672);
  });

  it("baseline to offer 2", () => {
    const { t, get } = steps(baseline, offer2);
    expect(get("price")).toBe(160500);
    expect(get("fees")).toBe(30000);
    expect(get("addons")).toBe(203193);
    expect(get("loan")).toBe(62978);
    expect(get("rate")).toBe(180785);
    expect(get("term")).toBe(307263);
    expect(t.totalCents).toBe(944719);
    expect(t.monthlyCents).toBe(-5158);
  });

  it("dealer A to dealer B", () => {
    const { t, get } = steps(dealerA, dealerB);
    expect(get("price")).toBe(85600);
    expect(get("fees")).toBe(-60000);
    expect(get("addons")).toBe(96193);
    expect(get("loan")).toBe(31530);
    expect(get("rate")).toBe(-113427);
    expect(get("term")).toBe(-126543);
    expect(t.totalCents).toBe(-86647);
    expect(t.monthlyCents).toBe(9525);
  });
});

describe("what it would take between dealer A and dealer B", () => {
  const val = (o: Offer, metric: "total" | "pay" | "otd") => {
    const d = computeDeal(o);
    return (metric === "total" ? d.total : metric === "pay" ? d.pay : d.otd).toFixed(2);
  };

  it("matching on total paid, A needs", () => {
    const w = whatItTakes(dealerA, dealerB, "total");
    expect(w.loser).toBe("a");
    const by = (l: string) => w.levers.find((x) => x.lever === l)!.result;
    expect(by("price")!.amount).toBe(644);
    expect(by("price")!.resulting.toFixed(2)).toBe("41623.62");
    expect(by("fees")!.amount).toBe(689);
    expect(by("fees")!.resulting.toFixed(2)).toBe("41623.72");
    expect(by("rate")!.amount).toBe(0.8);
    expect(by("rate")!.newValue).toBe(7.1);
    expect(by("rate")!.resulting.toFixed(2)).toBe("41616.12");
    expect(by("addons")).toBeNull();
  });

  it("matching on monthly payment, B needs", () => {
    const w = whatItTakes(dealerA, dealerB, "pay");
    expect(w.loser).toBe("b");
    const by = (l: string) => w.levers.find((x) => x.lever === l)!.result;
    expect(by("price")!.amount).toBe(4507);
    expect(by("price")!.resulting.toFixed(2)).toBe("548.48");
    expect(by("rate")!.amount).toBe(6.52);
    expect(by("rate")!.newValue).toBe(0.38);
    expect(by("rate")!.resulting.toFixed(2)).toBe("548.39");
    expect(by("fees")).toBeNull();
    expect(by("addons")).toBeNull();
    // Removing the add-on alone gives 624.74, which is not enough.
    expect(val({ ...dealerB, addons: 0 }, "pay")).toBe("624.74");
  });

  it("matching on out-the-door price, B needs", () => {
    const w = whatItTakes(dealerA, dealerB, "otd");
    const by = (l: string) => w.levers.find((x) => x.lever === l)!.result;
    expect(by("price")!.amount).toBe(1139);
    expect(by("price")!.resulting.toFixed(2)).toBe("34369.20");
    expect(by("fees")).toBeNull();
    expect(by("rate")).toBeNull();
    expect(by("addons")).toBeNull();
    expect(val({ ...dealerB, addons: 0 }, "otd")).toBe("34626.00");
  });
});

describe("trade-in", () => {
  // Down payment 2,000, 6.9%, 60 months.
  const common = { down: 2000, apr: 6.9, months: 60, taxRate: T, addons: 0 };
  const dealerC = makeOffer({ ...common, price: 31000, fees: 900, tradeAllowance: 5000, tradePayoff: 7000 });
  const dealerD = makeOffer({ ...common, price: 31500, fees: 600, tradeAllowance: 7500, tradePayoff: 7000 });
  const cDiff = { ...dealerC, taxDifferenceOnly: true };
  const dDiff = { ...dealerD, taxDifferenceOnly: true };

  it("tax on the full price", () => {
    const c = computeDeal(dealerC);
    const d = computeDeal(dealerD);
    expect(c.otdCents).toBe(3407000);
    expect(c.payCents).toBe(67302);
    expect(c.totalCents).toBe(4238123);
    expect(d.otdCents).toBe(3430500);
    expect(d.payCents).toBe(62828);
    expect(d.totalCents).toBe(3969666);
  });

  it("C needs a higher allowance to match on total paid", () => {
    const r = solveLever(dealerC, "trade", "total", computeDeal(dealerD).total);
    expect(r!.amount).toBe(2265);
  });

  it("state taxes only the difference", () => {
    const c = computeDeal(cDiff);
    const d = computeDeal(dDiff);
    expect(c.otdCents).toBe(3372000);
    expect(c.payCents).toBe(66611);
    expect(c.totalCents).toBe(4196640);
    expect(d.otdCents).toBe(3378000);
    expect(d.payCents).toBe(61791);
    expect(d.totalCents).toBe(3907441);
  });

  it("C needs a higher allowance to match on total paid in that mode", () => {
    const r = solveLever(cDiff, "trade", "total", computeDeal(dDiff).total);
    expect(r!.amount).toBe(2281);
  });

  it("the trail includes a trade-in step that sums with the others", () => {
    const t = trail(dealerC, dealerD);
    const sum = t.steps.reduce((s, x) => s + x.cents, 0);
    expect(sum).toBe(t.totalCents);
    expect(t.steps.find((s) => s.key === "trade")!.cents).not.toBe(0);
  });
});
