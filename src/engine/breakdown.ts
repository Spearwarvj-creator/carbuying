import { principalFromPayment } from "./amortize";
import { computeDeal, type Offer } from "./offer";
import { toCents } from "./money";

/**
 * What a monthly payment adds up to over the loan, plus anything paid up front.
 * Used for the ten-second check, before the buyer has given a price or a rate.
 */
export function paymentsAddUp(monthlyPayment: number, months: number, down = 0): number {
  return monthlyPayment * months + down;
}

/** How many months a loan lasts, as a count of payments the buyer can picture. */
export const paymentCount = (months: number): number => Math.max(0, Math.round(months));

export interface CostBreakdown {
  /** The car's price, less any trade-in credit. */
  carCents: number;
  /** Sales tax (except on extras) and fees. */
  taxFeesCents: number;
  /** Add-ons and the sales tax charged on them. */
  extrasCents: number;
  /** Old-loan balance rolled into this loan (negative equity). Zero otherwise. */
  rolledInCents: number;
  /** All the interest over the loan. */
  interestCents: number;
  totalCents: number;
}

/**
 * Splits the total paid into parts that add up to it exactly, in cents.
 * total = down + payments = price + tax + fees + add-ons - trade equity + interest.
 * The rounding remainder goes into the car so the parts always sum to the total.
 */
export function costBreakdown(offer: Offer): CostBreakdown {
  const d = computeDeal(offer);
  const extrasTaxRaw = offer.addonsTaxed ? Math.min(offer.taxRate * offer.addons, d.tax) : 0;
  const extrasCents = toCents(offer.addons + extrasTaxRaw);
  const taxFeesCents = toCents(d.tax - extrasTaxRaw + offer.fees);
  const rolledInCents = toCents(Math.max(-d.equity, 0));
  const interestCents = toCents(d.interest);
  const totalCents = d.totalCents;
  const carCents = totalCents - extrasCents - taxFeesCents - rolledInCents - interestCents;
  return { carCents, taxFeesCents, extrasCents, rolledInCents, interestCents, totalCents };
}

/**
 * What the add-ons really cost: the whole change in total paid if they were removed.
 * It includes their tax and the interest charged on them, so it is more than the sticker price.
 */
export function extrasRealCostCents(offer: Offer): number {
  const withExtras = computeDeal(offer).totalCents;
  const without = computeDeal({ ...offer, addons: 0 }).totalCents;
  return withExtras - without;
}

/** An extra cost expressed as a number of monthly payments, to one decimal place. */
export function paymentEquivalents(extraCents: number, payCents: number): number {
  if (payCents <= 0) return 0;
  return Math.round((extraCents / payCents) * 10) / 10;
}

export interface MonthSplit {
  month: number;
  interest: number;
  principal: number;
}

/** Interest and principal in each month of the loan. Interest is front-loaded. */
export function amortizationSchedule(offer: Offer): MonthSplit[] {
  const d = computeDeal(offer);
  const r = offer.apr / 1200;
  let balance = d.fin;
  const rows: MonthSplit[] = [];
  for (let m = 1; m <= offer.months; m++) {
    const interest = balance * r;
    const principal = d.pay - interest;
    balance -= principal;
    rows.push({ month: m, interest, principal });
  }
  return rows;
}

/**
 * The selling price a monthly payment would buy, given the rate, months, down payment,
 * tax rate and fees. Assumes no add-ons or trade-in. Never below zero.
 */
export function priceFromPayment(args: {
  pay: number;
  apr: number;
  months: number;
  down?: number;
  taxRate?: number;
  fees?: number;
}): number {
  const { pay, apr, months, down = 0, taxRate = 0, fees = 0 } = args;
  const borrowed = principalFromPayment(pay, apr, months);
  const outTheDoor = borrowed + down;
  return Math.max((outTheDoor - fees) / (1 + taxRate), 0);
}
