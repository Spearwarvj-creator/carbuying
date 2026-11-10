/**
 * Loan maths. APR is a percent (6.9 means 6.9%), months is the term.
 * A principal at or below zero is treated as no loan, so the payment is zero.
 */

export function payment(principal: number, aprPercent: number, months: number): number {
  if (principal <= 0) return 0;
  const r = aprPercent / 1200;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

export function totalPaidOnLoan(principal: number, aprPercent: number, months: number): number {
  return payment(principal, aprPercent, months) * months;
}

export function totalInterest(principal: number, aprPercent: number, months: number): number {
  if (principal <= 0) return 0;
  return totalPaidOnLoan(principal, aprPercent, months) - principal;
}

/** The loan size that a given monthly payment pays off. Inverse of payment(). */
export function principalFromPayment(pay: number, aprPercent: number, months: number): number {
  const r = aprPercent / 1200;
  if (r === 0) return pay * months;
  return (pay * (1 - Math.pow(1 + r, -months))) / r;
}

/**
 * The yearly rate a monthly payment implies on a loan of a given size and length, found by bisection. Returns null
 * when no rate between 0 and 60 percent fits (a payment too small to pay the loan off, or absurdly large).
 * It lets a buyer see what rate a quoted payment really carries.
 */
export function aprFromPayment(principal: number, pay: number, months: number): number | null {
  if (principal <= 0 || pay <= 0 || months <= 0) return null;
  if (pay * months < principal - 0.005) return null; // pays back less than was borrowed
  let lo = 0;
  let hi = 60;
  if (payment(principal, hi, months) < pay) return null;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (payment(principal, mid, months) < pay) lo = mid;
    else hi = mid;
  }
  return Math.round(((lo + hi) / 2) * 100) / 100;
}
