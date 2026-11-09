import { en } from "@/data/strings/en";
import { formatWhole, type Lever, type LeverResult } from "@/engine";

/** One plain sentence for a lever result. Used by the calculator and by the site pages. */
export function leverLine(lever: Lever, r: LeverResult): string {
  const l = en.target.lines;
  switch (lever) {
    case "price":
      return l.price(formatWhole(r.amount), formatWhole(r.newValue));
    case "fees":
      return l.fees(formatWhole(r.amount), formatWhole(r.newValue));
    case "addons":
      return l.addons(formatWhole(r.amount));
    case "rate":
      return l.rate(r.amount.toFixed(2), `${r.newValue.toFixed(2)}%`);
    case "trade":
      return l.trade(formatWhole(r.amount), formatWhole(r.newValue));
  }
}
