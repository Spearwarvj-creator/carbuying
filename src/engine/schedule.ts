import { payment, totalInterest } from "./amortize";
import { toCents } from "./money";

/**
 * How a loan is paid off over time, for the charts. It uses the same payment as payment() and totalInterest(), so the
 * last balance is zero and the interest added up over the loan matches the deal's interest to the cent.
 */
export interface SchedulePoint {
  /** Months paid so far. 0 is the day of purchase. */
  month: number;
  /** What is still owed after that many payments. */
  balanceCents: number;
  /** Interest paid so far. */
  interestPaidCents: number;
}

/** The balance after k payments, from the closed form, never below zero. */
function balanceAfter(principal: number, aprPercent: number, months: number, k: number): number {
  const pay = payment(principal, aprPercent, months);
  const r = aprPercent / 1200;
  if (k >= months) return 0;
  const b = r === 0 ? principal - pay * k : principal * Math.pow(1 + r, k) - (pay * (Math.pow(1 + r, k) - 1)) / r;
  return Math.max(b, 0);
}

/** One point for every payment, from month 0 to the last. An empty list when nothing is borrowed. */
export function loanSchedule(principal: number, aprPercent: number, months: number): SchedulePoint[] {
  const n = Math.round(months);
  if (principal <= 0 || n <= 0) return [];
  const pay = payment(principal, aprPercent, n);
  const out: SchedulePoint[] = [];
  for (let k = 0; k <= n; k++) {
    const balance = balanceAfter(principal, aprPercent, n, k);
    out.push({ month: k, balanceCents: toCents(balance), interestPaidCents: toCents(pay * k - (principal - balance)) });
  }
  return out;
}

/** What one payment (counted from 1) pays in interest and in loan, in cents. The two add up to the payment. */
export function paymentSplit(principal: number, aprPercent: number, months: number, month: number): { interestCents: number; principalCents: number } {
  const n = Math.round(months);
  if (principal <= 0 || n <= 0 || month < 1 || month > n) return { interestCents: 0, principalCents: 0 };
  const pay = payment(principal, aprPercent, n);
  const interest = (aprPercent / 1200) * balanceAfter(principal, aprPercent, n, month - 1);
  const payCents = toCents(pay);
  const interestCents = Math.min(toCents(interest), payCents);
  return { interestCents, principalCents: payCents - interestCents };
}

/** The first month at which at least half of the loan is paid off, so the buyer sees how long the money is tied up. */
export function halfPaidMonth(principal: number, aprPercent: number, months: number): number {
  const s = loanSchedule(principal, aprPercent, months);
  const half = toCents(principal) / 2;
  const hit = s.find((p) => p.balanceCents <= half);
  return hit ? hit.month : 0;
}

export interface TermRow {
  months: number;
  payCents: number;
  interestCents: number;
  totalCents: number;
}

/**
 * The same loan at different lengths and the same rate: the payment falls as the term grows, and the interest rises.
 * A real lender may quote a different rate for a different term, so this shows the length alone.
 */
export function termComparison(financed: number, aprPercent: number, down: number, currentMonths: number, terms: readonly number[] = [36, 48, 60, 72, 84]): TermRow[] {
  if (financed <= 0) return [];
  const all = Array.from(new Set([...terms, currentMonths])).filter((m) => m > 0).sort((a, b) => a - b);
  return all.map((m) => {
    const pay = payment(financed, aprPercent, m);
    return { months: m, payCents: toCents(pay), interestCents: toCents(totalInterest(financed, aprPercent, m)), totalCents: toCents(down + pay * m) };
  });
}
