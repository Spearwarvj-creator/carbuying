import { makeOffer, type Offer } from "@/engine";

/**
 * The example deal. Both offers come from the engine's golden test vectors.
 * The calculator starts on it, and the site pages compute their figures from it,
 * so no number on any page is typed by hand.
 */
export const EXAMPLE_OFFERS: [Offer, Offer] = [
  makeOffer({ price: 31500, fees: 900, addons: 0, down: 3000, apr: 7.9, months: 60, taxRate: 0.07 }),
  makeOffer({ price: 31500, fees: 900, addons: 1899, down: 3000, apr: 7.9, months: 84, taxRate: 0.07 }),
];
