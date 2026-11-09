import { makeOffer, type Offer } from "../../offer";

/** Small seeded generator (mulberry32), so every run sees the same deals. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function between(rand: () => number, lo: number, hi: number): number {
  return lo + rand() * (hi - lo);
}

const roundTo = (n: number, places: number) => Math.round(n * 10 ** places) / 10 ** places;

/** A random valid offer. Down payment stays below the out-the-door price. */
export function randomOffer(rand: () => number): Offer {
  const price = roundTo(between(rand, 8000, 90000), 0);
  const hasAddons = rand() < 0.5;
  const hasTrade = rand() < 0.4;
  const allowance = hasTrade ? roundTo(between(rand, 500, 20000), 0) : 0;
  const payoff = hasTrade ? roundTo(between(rand, 0, 20000), 0) : 0;
  return makeOffer({
    price,
    fees: roundTo(between(rand, 0, 2500), 0),
    addons: hasAddons ? roundTo(between(rand, 100, 5000), 0) : 0,
    down: roundTo(between(rand, 0, price * 0.4), 0),
    apr: rand() < 0.1 ? 0 : roundTo(between(rand, 0.5, 24), 2),
    months: 12 * Math.floor(between(rand, 1, 9)),
    taxRate: roundTo(between(rand, 0, 0.1), 4),
    tradeAllowance: allowance,
    tradePayoff: payoff,
    feesTaxed: rand() < 0.3,
    addonsTaxed: rand() < 0.8,
    taxDifferenceOnly: hasTrade && rand() < 0.4,
  });
}
