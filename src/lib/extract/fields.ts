/**
 * The numbers the Quick fill can find, in the units the app uses. Every field has a ceiling that matches
 * the number boxes, so a misheard or misread value can never go past what the buyer could type.
 * Nothing here does any loan maths: this only says which number is which.
 */
export type FillKey =
  | "price"
  | "taxRate"
  | "fees"
  | "addons"
  | "down"
  | "tradeAllowance"
  | "tradePayoff"
  | "apr"
  | "months"
  | "monthlyPayment"
  | "amountFinanced"
  | "totalOfPayments";

export interface FillField {
  key: FillKey;
  label: string;
  unit: "$" | "%" | "months";
  max: number;
  decimals: number;
}

export const FILL_FIELDS: readonly FillField[] = [
  { key: "price", label: "Selling price", unit: "$", max: 10_000_000, decimals: 0 },
  { key: "taxRate", label: "Sales tax", unit: "%", max: 20, decimals: 2 },
  { key: "fees", label: "Fees", unit: "$", max: 10_000_000, decimals: 0 },
  { key: "addons", label: "Add-ons and extras", unit: "$", max: 10_000_000, decimals: 0 },
  { key: "down", label: "Down payment", unit: "$", max: 10_000_000, decimals: 0 },
  { key: "tradeAllowance", label: "Trade-in value", unit: "$", max: 10_000_000, decimals: 0 },
  { key: "tradePayoff", label: "Still owed on the trade-in", unit: "$", max: 10_000_000, decimals: 0 },
  { key: "apr", label: "Rate (APR)", unit: "%", max: 40, decimals: 2 },
  { key: "months", label: "Loan length", unit: "months", max: 96, decimals: 0 },
  { key: "monthlyPayment", label: "Monthly payment", unit: "$", max: 100_000, decimals: 2 },
  { key: "amountFinanced", label: "Amount financed", unit: "$", max: 10_000_000, decimals: 2 },
  { key: "totalOfPayments", label: "Total of payments", unit: "$", max: 20_000_000, decimals: 2 },
] as const;

export const FIELD_BY_KEY = Object.fromEntries(FILL_FIELDS.map((f) => [f.key, f])) as Record<FillKey, FillField>;

/** What was found for one field, and the words or print it came from, so the buyer can check it. */
export interface Found {
  value: number;
  from: string;
}

export type Detected = Partial<Record<FillKey, Found>>;

/** Keeps a value inside the field's own range, or drops it. A number outside the range is never guessed at. */
export function fit(key: FillKey, raw: unknown): number | null {
  const f = FIELD_BY_KEY[key];
  const n = typeof raw === "string" ? Number(raw.replace(/[$,\s%]/g, "")) : typeof raw === "number" ? raw : NaN;
  if (!Number.isFinite(n) || n < 0 || n > f.max) return null;
  const p = 10 ** f.decimals;
  return Math.round(n * p) / p;
}

/**
 * A tax amount in dollars becomes a rate, so the buyer confirms a percentage they can compare with their
 * state's. Tax is charged on the price plus add-ons in this app, the same rule the calculator uses.
 */
export function withImpliedTax(d: Detected, taxAmount: number | null, from = ""): Detected {
  if (taxAmount === null || d.taxRate) return d;
  const base = (d.price?.value ?? 0) + (d.addons?.value ?? 0);
  if (base <= 0) return d;
  const rate = fit("taxRate", (taxAmount / base) * 100);
  return rate === null ? d : { ...d, taxRate: { value: rate, from: from || `$${taxAmount} of tax` } };
}
