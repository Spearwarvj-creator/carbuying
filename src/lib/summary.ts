import { summaryText as t } from "@/data/strings/flags";
import { computeDeal, type Offer } from "@/engine";

const whole = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

/** The deal as a few plain sentences plus every figure in them, made by the calculator. Used as the only source of numbers for the AI helpers. */
export function dealSummary(offer: Offer, quotedPay = 0): { text: string; figures: number[] } {
  const d = computeDeal(offer);
  const parts = [
    t.price(whole(offer.price)),
    offer.fees > 0 ? t.fees(whole(offer.fees)) : "",
    offer.addons > 0 ? t.extras(whole(offer.addons)) : "",
    t.taxRate((offer.taxRate * 100).toFixed(2).replace(/\.?0+$/, "")),
    t.otd(whole(d.otd)),
    offer.down > 0 ? t.down(whole(offer.down)) : "",
    t.financed(whole(d.fin)),
    t.rate(offer.apr, offer.months),
    t.pay(whole(d.pay)),
    t.total(whole(d.total), whole(d.interest)),
    quotedPay > 0 ? t.quoted(whole(quotedPay)) : "",
  ].filter(Boolean);
  const text = parts.join(" ");
  return { text, figures: [...text.matchAll(/\d[\d,]*(?:\.\d+)?/g)].map((m) => Number(m[0].replace(/,/g, ""))) };
}
