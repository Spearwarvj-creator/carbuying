import { z } from "zod";
import { payment, totalInterest } from "./amortize";
import { toCents } from "./money";

/**
 * One dealer offer, in dollars. taxRate is a fraction (0.07 means 7%).
 * The buyer enters the tax rate from their own worksheet.
 *
 * Tax = taxRate x (price + taxed add-ons + taxed fees), minus the trade-in
 * allowance when the buyer's state taxes only the difference (never below zero).
 *
 * rebate is manufacturer or dealer cash that lowers what is owed after tax. Tax is worked out on the price before
 * the rebate, which is the usual rule. A state that taxes after the rebate needs the price entered after it.
 */
export const OfferSchema = z.object({
  price: z.number().gt(0).max(10_000_000),
  fees: z.number().min(0).max(1_000_000),
  addons: z.number().min(0).max(1_000_000),
  down: z.number().min(0).max(10_000_000),
  apr: z.number().min(0).max(40),
  months: z
    .number()
    .int()
    .min(12)
    .max(96)
    .refine((m) => m % 12 === 0, "Term must be a multiple of 12 months"),
  taxRate: z.number().min(0).max(0.2),
  tradeAllowance: z.number().min(0).max(10_000_000).default(0),
  tradePayoff: z.number().min(0).max(10_000_000).default(0),
  rebate: z.number().min(0).max(1_000_000).default(0),
  feesTaxed: z.boolean().default(false),
  addonsTaxed: z.boolean().default(true),
  taxDifferenceOnly: z.boolean().default(false),
});

export type Offer = z.infer<typeof OfferSchema>;

/** Fields the caller must give. The rest take the defaults above. */
export type OfferInput = Pick<Offer, "price" | "fees" | "addons" | "down" | "apr" | "months" | "taxRate"> &
  Partial<Omit<Offer, "price" | "fees" | "addons" | "down" | "apr" | "months" | "taxRate">>;

export function makeOffer(input: OfferInput): Offer {
  return {
    tradeAllowance: 0,
    tradePayoff: 0,
    rebate: 0,
    feesTaxed: false,
    addonsTaxed: true,
    taxDifferenceOnly: false,
    ...input,
  };
}

export interface Deal {
  offer: Offer;
  tax: number;
  /** Out-the-door price: price + tax + fees + add-ons. */
  otd: number;
  /** Trade-in allowance minus payoff. Negative equity is negative. */
  equity: number;
  /** Amount financed. Never below zero. */
  fin: number;
  /** Out-the-door price minus down payment and trade equity, before the zero floor. */
  finRaw: number;
  pay: number;
  /** Down payment plus every monthly payment. */
  total: number;
  interest: number;
  otdCents: number;
  payCents: number;
  totalCents: number;
  interestCents: number;
  finCents: number;
  taxCents: number;
}

export function computeDeal(offer: Offer): Deal {
  const taxedBase =
    offer.price +
    (offer.addonsTaxed ? offer.addons : 0) +
    (offer.feesTaxed ? offer.fees : 0) -
    (offer.taxDifferenceOnly ? offer.tradeAllowance : 0);
  const tax = offer.taxRate * Math.max(taxedBase, 0);
  const otd = offer.price + tax + offer.fees + offer.addons;
  const equity = offer.tradeAllowance - offer.tradePayoff;
  const finRaw = otd - offer.down - offer.rebate - equity;
  const fin = Math.max(finRaw, 0);
  const pay = payment(fin, offer.apr, offer.months);
  const total = offer.down + pay * offer.months;
  const interest = totalInterest(fin, offer.apr, offer.months);
  return {
    offer,
    tax,
    otd,
    equity,
    fin,
    finRaw,
    pay,
    total,
    interest,
    otdCents: toCents(otd),
    payCents: toCents(pay),
    totalCents: toCents(total),
    interestCents: toCents(interest),
    finCents: toCents(fin),
    taxCents: toCents(tax),
  };
}

/**
 * The tax rate that gives a tax amount the buyer read off a worksheet, for the price, fees and add-ons already
 * entered. It is the exact fraction, so the tax the calculator shows matches the dollars on the paper. Null when
 * there is nothing taxed yet or the amount is not a plausible tax (over 20 percent of the taxed amount).
 */
export function taxRateFromAmount(offer: Offer, taxDollars: number): number | null {
  const base =
    offer.price +
    (offer.addonsTaxed ? offer.addons : 0) +
    (offer.feesTaxed ? offer.fees : 0) -
    (offer.taxDifferenceOnly ? offer.tradeAllowance : 0);
  if (base <= 0 || taxDollars < 0) return null;
  const rate = taxDollars / base;
  return rate <= 0.2 ? rate : null;
}

/** Returns a list of plain-language problems, empty when the offer is valid. */
export function checkOffer(offer: Offer): string[] {
  const parsed = OfferSchema.safeParse(offer);
  if (parsed.success) return [];
  return parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
}

/**
 * The selling price that gives a stated out-the-door total, for a buyer who was only told that total. It undoes
 * computeDeal's tax rule: otd = price + tax + fees + add-ons, with tax on the price plus any taxed add-ons and fees (less
 * the trade-in allowance where only the difference is taxed). Never below zero.
 */
export function priceFromOtd(
  o: Pick<Offer, "fees" | "addons" | "taxRate" | "addonsTaxed" | "feesTaxed" | "tradeAllowance" | "taxDifferenceOnly">,
  otd: number,
): number {
  const extra = (o.addonsTaxed ? o.addons : 0) + (o.feesTaxed ? o.fees : 0) - (o.taxDifferenceOnly ? o.tradeAllowance : 0);
  let price = (otd - o.fees - o.addons - o.taxRate * extra) / (1 + o.taxRate);
  // Tax is never negative: if the taxed amount would be below zero, no tax is charged at all.
  if (price + extra < 0) price = otd - o.fees - o.addons;
  return Math.max(Math.round(price * 100) / 100, 0);
}
