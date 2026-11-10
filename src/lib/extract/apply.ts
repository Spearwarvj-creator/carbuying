import type { Offer } from "@/engine";
import { useDeal, type NumKey } from "@/store/deal";
import { useWalk } from "@/store/walk";
import type { Detected, FillKey } from "./fields";

const toOffer: Partial<Record<FillKey, NumKey>> = {
  price: "price",
  taxRate: "taxRate",
  fees: "fees",
  addons: "addons",
  down: "down",
  tradeAllowance: "tradeAllowance",
  tradePayoff: "tradePayoff",
  apr: "apr",
  months: "months",
};

/** Fields as the deal stores them: the tax rate is a fraction, not a percent. */
function asOffer(d: Detected): Partial<Offer> {
  const patch: Partial<Offer> = {};
  for (const [k, key] of Object.entries(toOffer) as [FillKey, NumKey][]) {
    const f = d[k];
    if (f) (patch as Record<string, number>)[key] = key === "taxRate" ? f.value / 100 : f.value;
  }
  return patch;
}

/**
 * Starts a fresh quote from the confirmed numbers and lands on the first step that still needs the buyer:
 * the rate if the price is in, the price if only a payment was given, otherwise the start.
 * Only called after the buyer has checked and confirmed every field.
 */
export function applyToWalk(d: Detected): number {
  useDeal.getState().startQuote();
  useDeal.setState((s) => ({ offers: [{ ...s.offers[0], ...asOffer(d) }, s.offers[1]], example: false }));
  const walk = useWalk.getState();
  walk.reset();
  const hasPrice = (d.price?.value ?? 0) > 0;
  walk.setStartedWith(hasPrice ? "price" : "payment");
  walk.setQuote(d.monthlyPayment?.value ?? 0, d.months?.value ?? 60, d.down?.value ?? 0);
  walk.setRateEntered(Boolean(d.apr));
  const stage = hasPrice ? (d.apr ? 6 : 4) : d.monthlyPayment ? 2 : 1;
  walk.go("stage", stage);
  return stage;
}

/** For the Desk: start a blank deal and enter each confirmed number the way the keypad would. */
export function applyToDesk(d: Detected, slot: 0 | 1 = 0): void {
  const deal = useDeal.getState();
  // The untouched example is cleared first; the buyer's own numbers are kept and only the fields found are changed.
  if (deal.example) deal.useMine();
  deal.setEditing(slot);
  for (const [k, key] of Object.entries(toOffer) as [FillKey, NumKey][]) {
    const f = d[k];
    if (f) deal.setValue(key, key === "taxRate" ? f.value / 100 : f.value);
  }
  deal.close();
}

/** Opens a deal the buyer saved on this device, on the last step, ready to review or change. */
export function applySavedDeal(saved: { offer: Offer; quotedPay: number }): void {
  useDeal.getState().startQuote();
  useDeal.setState((s) => ({ offers: [{ ...saved.offer }, s.offers[1]], example: false }));
  const walk = useWalk.getState();
  walk.reset();
  walk.setStartedWith("price");
  walk.setQuote(saved.quotedPay, saved.offer.months, saved.offer.down);
  walk.setRateEntered(true);
  walk.go("stage", 6);
}
