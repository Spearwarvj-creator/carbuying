import { computeDeal, type Offer } from "./offer";
import { toCents } from "./money";

/**
 * What paying cash would mean for a deal the buyer has priced as a loan: the cash needed at the dealer, and what
 * borrowing adds on top. Cash needed is the out-the-door price less any rebate and trade-in equity. With a loan, the
 * extra is all the interest.
 */
export interface CashCompare {
  /** Cash to hand over for the same car, with no loan. Never below zero. */
  cashCents: number;
  /** What the loan costs on top of that, which is all the interest. Zero when nothing is borrowed. */
  extraForLoanCents: number;
  /** The loan's total paid. */
  loanTotalCents: number;
}

export function cashCompare(offer: Offer): CashCompare {
  const d = computeDeal(offer);
  const cashCents = Math.max(toCents(d.otd - offer.rebate - d.equity), 0);
  return { cashCents, extraForLoanCents: d.interestCents, loanTotalCents: d.totalCents };
}
