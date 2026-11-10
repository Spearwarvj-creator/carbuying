/**
 * How much room a monthly income leaves for a car. It uses one published rule of thumb, the "20/4/10" rule: 20 percent
 * down, a loan of no more than 4 years, and all monthly car costs (payment, insurance, fuel) at or under 10 percent of
 * gross monthly income. It is a starting point for a question to ask, not a lender's test, and the page says so.
 */
export const BUDGET_SHARE = 0.1;

export interface Budget {
  /** All monthly car costs the rule allows. */
  carCostsCap: number;
  /** What is left for the loan payment after insurance and fuel. Never below zero. */
  paymentRoom: number;
}

export function budgetFromIncome(grossMonthly: number, insurance = 0, fuel = 0): Budget {
  const cap = Math.max(grossMonthly, 0) * BUDGET_SHARE;
  return { carCostsCap: Math.round(cap), paymentRoom: Math.max(Math.round(cap - Math.max(insurance, 0) - Math.max(fuel, 0)), 0) };
}
