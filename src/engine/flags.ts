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
      title: `${offer.months} months is a long loan`,
      body: `Compared with 60 months, the payment is about ${whole(lower)} lower, but you pay about ${whole(extra)} more in total.`,
      ask: "Can you show me the payment and the total for 60 months as well?",
      source: "Experian, State of the Automotive Finance Market (2026): nearly one third of loans run longer than six years.",
      figures: [offer.months, lower, extra, 60],
    });
  }

  // Doc fees average a few hundred dollars; many states cap them and some do not. Above $500 is worth asking about.
  if (offer.fees > 500) {
    flags.push({
      id: "highFees",
      severity: offer.fees > 900 ? "high" : "check",
      title: "The fees are on the high side",
      body: `Fees are ${whole(offer.fees)}. Dealer document fees often run a few hundred dollars, and some states cap them.`,
      ask: "Can you list each fee and what it is for?",
      source: "Consumer guides and state rules differ; check your state's attorney general or motor vehicle site.",
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
      title: "There are extras in this deal",
      body: `The extras cost ${whole(offer.addons)}, and about ${whole(real / 100)} once tax and interest are counted. That is about ${eq.toFixed(1)} of your monthly payments.`,
      ask: "If I did not ask for an extra, can you take it off? Which ones can I cancel later?",
      source: "CFPB and Consumer Reports: you do not have to pay for an add-on you did not ask for.",
      figures: [offer.addons, real / 100, Number(eq.toFixed(1)), cents / 100],
    });
  }

  // Payment packing: the monthly figure the dealer gave does not match the deal on the page.
  if (quotedPay > 0 && Math.abs(d.pay - quotedPay) > 5) {
    const gap = d.pay - quotedPay;
    flags.push({
      id: "packing",
      severity: "high",
      title: "The payment does not match the numbers",
      body: `With these numbers the payment comes to ${whole(d.pay)} a month, and the dealer said ${whole(quotedPay)}. That is ${whole(Math.abs(gap))} ${gap > 0 ? "less" : "more"} than the numbers give.`,
      ask: "What is in the monthly payment? Can you show it line by line?",
      source: "FTC: payment packing hides add-ons inside a monthly figure.",
      figures: [d.pay, quotedPay, Math.abs(gap)],
    });
  }

  // Owing more than the trade is worth moves the difference into the new loan.
  if (d.equity < 0) {
    flags.push({
      id: "underwater",
      severity: "check",
      title: "You owe more than the trade is worth",
      body: `The gap is ${whole(-d.equity)}. It is added to the new loan, and you pay interest on it.`,
      ask: "How much of the new loan is the old loan I still owe?",
      source: "FTC, Financing or Leasing a Car: negative equity is rolled into the new loan.",
      figures: [-d.equity],
    });
  }

  // Rate: no single "fair" number without a credit score, so this asks a question instead of passing a verdict.
  if (offer.apr >= 9) {
    flags.push({
      id: "rate",
      severity: offer.apr >= 15 ? "high" : "check",
      title: `${offer.apr}% is a higher rate`,
      body: `Rates depend on your credit and the lender. A dealer can add to the rate a lender offers, and the extra interest goes to the dealer.`,
      ask: "What rate did the lender approve me for, and is any of this rate added by the dealership?",
      source: "CFPB and the Center for Responsible Lending: dealer rate markups.",
      figures: [offer.apr],
    });
  }

  if (offer.taxRate === 0) {
    flags.push({
      id: "noTax",
      severity: "check",
      title: "No sales tax is counted",
      body: "The tax rate is zero, so the out-the-door price here has no sales tax in it. Most states charge it on a car.",
      ask: "What is the sales tax in dollars on this deal?",
      source: "Enter the tax from the worksheet.",
      figures: [],
    });
  }

  if (d.total > 0 && d.interest / d.total > 0.2) {
    flags.push({
      id: "interestShare",
      severity: "info",
      title: "A large share is interest",
      body: `About ${Math.round((100 * d.interest) / d.total)} of every 100 dollars you pay goes to interest.`,
      ask: "What would the interest be on a shorter loan or a bigger down payment?",
      source: "Calculated from the numbers on this page.",
      figures: [Math.round((100 * d.interest) / d.total), 100],
    });
  }

  const order = { high: 0, check: 1, info: 2 } as const;
  return flags.sort((a, b) => order[a.severity] - order[b.severity]);
}
