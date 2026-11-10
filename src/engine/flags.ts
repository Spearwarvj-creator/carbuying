import { flagText as x } from "@/data/strings/flags";
import { costBreakdown, extrasRealCostCents, paymentEquivalents } from "./breakdown";
import { computeDeal, type Offer } from "./offer";

/**
 * Plain checks on a deal. Each one is a rule, not a guess: it fires on a stated condition and carries
 * the numbers from the calculator and a question to ask. An AI may reword the text for a reading level
 * or a language, but it never decides what fires. The thresholds and where they come from are written
 * next to each rule so they can be questioned and changed.
 */
export type FlagId = "longTerm" | "highFees" | "extras" | "packing" | "underwater" | "rate" | "noTax" | "interestShare";

export interface DealFlag {
  id: FlagId;
  severity: "info" | "check" | "high";
  /** Short heading in plain words. */
  title: string;
  /** What the check found, with the calculator's numbers. */
  body: string;
  /** One thing to ask. */
  ask: string;
  /** Where the rule of thumb comes from. */
  source: string;
  /** Every number the text uses, so an AI rewording can be held to them. */
  figures: number[];
}

const whole = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

export interface FlagInput {
  offer: Offer;
  /** The payment the dealer quoted, if the buyer entered one. */
  quotedPay?: number;
}

export function dealFlags({ offer, quotedPay = 0 }: FlagInput): DealFlag[] {
  const d = computeDeal(offer);
  if (offer.price <= 0) return [];
  const flags: DealFlag[] = [];

  // A longer loan lowers the payment and raises the interest. Experian reports nearly a third of loans now run past six years.
  if (offer.months > 72) {
    const shorter = computeDeal({ ...offer, months: 60 });
    const extra = d.total - shorter.total;
    const lower = shorter.pay - d.pay;
    flags.push({
      id: "longTerm",
      severity: offer.months >= 84 ? "high" : "check",
      title: x.longTerm.title(offer.months),
      body: x.longTerm.body(whole(lower), whole(extra)),
      ask: x.longTerm.ask,
      source: x.longTerm.source,
      figures: [offer.months, lower, extra, 60],
    });
  }

  // Doc fees average a few hundred dollars; many states cap them and some do not. Above $500 is worth asking about.
  if (offer.fees > 500) {
    flags.push({
      id: "highFees",
      severity: offer.fees > 900 ? "high" : "check",
      title: x.highFees.title,
      body: x.highFees.body(whole(offer.fees)),
      ask: x.highFees.ask,
      source: x.highFees.source,
      figures: [offer.fees],
    });
  }

  // Add-ons: CFPB and Consumer Reports advice is that you need not pay for one you did not ask for.
  if (offer.addons > 0) {
    const real = extrasRealCostCents(offer);
    const eq = paymentEquivalents(real, d.payCents);
    const cents = costBreakdown(offer).extrasCents;
    flags.push({
      id: "extras",
      severity: "check",
      title: x.extras.title,
      body: x.extras.body(whole(offer.addons), whole(real / 100), eq.toFixed(1)),
      ask: x.extras.ask,
      source: x.extras.source,
      figures: [offer.addons, real / 100, Number(eq.toFixed(1)), cents / 100],
    });
  }

  // Payment packing: the monthly figure the dealer gave does not match the deal on the page.
  if (quotedPay > 0 && Math.abs(d.pay - quotedPay) > 5) {
    const gap = d.pay - quotedPay;
    flags.push({
      id: "packing",
      severity: "high",
      title: x.packing.title,
      body: x.packing.body(whole(d.pay), whole(quotedPay), whole(Math.abs(gap)), gap > 0),
      ask: x.packing.ask,
      source: x.packing.source,
      figures: [d.pay, quotedPay, Math.abs(gap)],
    });
  }

  // Owing more than the trade is worth moves the difference into the new loan.
  if (d.equity < 0) {
    flags.push({
      id: "underwater",
      severity: "check",
      title: x.underwater.title,
      body: x.underwater.body(whole(-d.equity)),
      ask: x.underwater.ask,
      source: x.underwater.source,
      figures: [-d.equity],
    });
  }

  // Rate: no single "fair" number without a credit score, so this asks a question instead of passing a verdict.
  if (offer.apr >= 9) {
    flags.push({
      id: "rate",
      severity: offer.apr >= 15 ? "high" : "check",
      title: x.rate.title(offer.apr),
      body: x.rate.body,
      ask: x.rate.ask,
      source: x.rate.source,
      figures: [offer.apr],
    });
  }

  if (offer.taxRate === 0) {
    flags.push({
      id: "noTax",
      severity: "check",
      title: x.noTax.title,
      body: x.noTax.body,
      ask: x.noTax.ask,
      source: x.noTax.source,
      figures: [],
    });
  }

  if (d.total > 0 && d.interest / d.total > 0.2) {
    flags.push({
      id: "interestShare",
      severity: "info",
      title: x.interestShare.title,
      body: x.interestShare.body(Math.round((100 * d.interest) / d.total)),
      ask: x.interestShare.ask,
      source: x.interestShare.source,
      figures: [Math.round((100 * d.interest) / d.total), 100],
    });
  }

  const order = { high: 0, check: 1, info: 2 } as const;
  return flags.sort((a, b) => order[a.severity] - order[b.severity]);
}
