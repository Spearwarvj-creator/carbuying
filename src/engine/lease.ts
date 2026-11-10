import { toCents } from "./money";

/**
 * A car lease, worked the way the lease sheet works it. All money is in dollars; the results also come in cents.
 *
 *   net cap cost  = price - cash down - rebate - trade-in equity
 *   residual      = MSRP x residual percent
 *   depreciation  = (net cap cost - residual) / months
 *   rent charge   = (net cap cost + residual) x money factor
 *   monthly       = (depreciation + rent charge) x (1 + tax rate)
 *
 * Sales tax is charged on the monthly payment, which is how most states do it. A few states tax the whole price up
 * front, and the buyer's lease sheet says which; the page tells them to check.
 * The money factor is the lease's version of a rate: multiply it by 2,400 to get the yearly percentage rate.
 */
export interface LeaseInput {
  /** The price agreed for the car, before any lease credits. */
  price: number;
  /** The sticker price the residual is a percent of. */
  msrp: number;
  /** Percent of MSRP the car is worth at the end, as the lease says. */
  residualPct: number;
  /** The lease's money factor, for example 0.00250. */
  moneyFactor: number;
  months: number;
  /** Cash put in at signing that lowers the amount leased. */
  down: number;
  rebate: number;
  tradeAllowance: number;
  tradePayoff: number;
  /** Acquisition, doc and registration fees paid at signing. */
  fees: number;
  /** Tax rate as a fraction (0.07 is 7%), charged on the monthly payment. */
  taxRate: number;
  /** Miles a year the lease allows. 0 when unknown. */
  milesAllowed: number;
  /** Miles a year the buyer expects to drive. 0 when unknown. */
  milesExpected: number;
  /** What the lease charges for each mile over, in dollars (for example 0.25). 0 when unknown. */
  overageRate: number;
}

export interface LeaseResult {
  netCapCost: number;
  residual: number;
  depreciation: number;
  rentCharge: number;
  /** Monthly payment with tax. */
  monthly: number;
  monthlyCents: number;
  /** Cash due when signing: down, fees and the first payment. */
  driveOff: number;
  driveOffCents: number;
  /** Down, fees and every payment, plus any mileage charge at the end. */
  totalCents: number;
  /** What the lease costs for each month of driving, all in. */
  perMonthCents: number;
  /** The yearly rate the money factor stands for, in percent. */
  impliedApr: number;
  overMiles: number;
  overageCents: number;
  /** The residual is higher than the net cap cost, so the sheet's numbers do not make a lease. */
  invalid: boolean;
}

export const moneyFactorFromApr = (apr: number): number => apr / 2400;
export const aprFromMoneyFactor = (mf: number): number => mf * 2400;

export function computeLease(i: LeaseInput): LeaseResult {
  const equity = i.tradeAllowance - i.tradePayoff;
  const netCapCost = i.price - i.down - i.rebate - equity;
  const residual = (i.msrp * i.residualPct) / 100;
  const months = Math.max(i.months, 1);
  const invalid = i.price <= 0 || i.msrp <= 0 || residual >= netCapCost || netCapCost <= 0;
  const depreciation = invalid ? 0 : (netCapCost - residual) / months;
  const rentCharge = invalid ? 0 : (netCapCost + residual) * i.moneyFactor;
  const monthly = (depreciation + rentCharge) * (1 + i.taxRate);
  const monthlyCents = toCents(monthly);
  const driveOff = i.down + i.fees + monthly;
  const overMiles = i.milesAllowed > 0 && i.milesExpected > i.milesAllowed ? (i.milesExpected - i.milesAllowed) * (months / 12) : 0;
  const overageCents = toCents(overMiles * i.overageRate);
  const totalCents = toCents(i.down) + toCents(i.fees) + monthlyCents * months + overageCents;
  return {
    netCapCost,
    residual,
    depreciation,
    rentCharge,
    monthly,
    monthlyCents,
    driveOff,
    driveOffCents: toCents(driveOff),
    totalCents,
    perMonthCents: Math.round(totalCents / months),
    impliedApr: Math.round(aprFromMoneyFactor(i.moneyFactor) * 100) / 100,
    overMiles: Math.round(overMiles),
    overageCents,
    invalid,
  };
}
