import { computeDeal, type Offer } from "@/engine";

const whole = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

/** The deal as a few plain sentences plus every figure in them, made by the calculator. Used as the only source of numbers for the AI helpers. */
export function dealSummary(offer: Offer, quotedPay = 0): { text: string; figures: number[] } {
  const d = computeDeal(offer);
  const parts = [
    `Selling price ${whole(offer.price)}.`,
    offer.fees > 0 ? `Fees ${whole(offer.fees)}.` : "",
    offer.addons > 0 ? `Extras ${whole(offer.addons)}.` : "",
    `Sales tax rate ${(offer.taxRate * 100).toFixed(2).replace(/\.?0+$/, "")}%.`,
    `Out-the-door price ${whole(d.otd)}.`,
    offer.down > 0 ? `Down payment ${whole(offer.down)}.` : "",
    `Amount financed ${whole(d.fin)}.`,
    `Rate ${offer.apr}% for ${offer.months} months.`,
    `Monthly payment ${whole(d.pay)}.`,
    `Total paid ${whole(d.total)}, of which interest ${whole(d.interest)}.`,
    quotedPay > 0 ? `The dealer quoted ${whole(quotedPay)} a month.` : "",
  ].filter(Boolean);
  const text = parts.join(" ");
  return { text, figures: [...text.matchAll(/\d[\d,]*(?:\.\d+)?/g)].map((m) => Number(m[0].replace(/,/g, ""))) };
}
