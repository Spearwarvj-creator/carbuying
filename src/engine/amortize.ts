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
