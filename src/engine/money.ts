/**
 * Money helpers. Deal maths runs in dollars as floating point numbers, exactly
 * like the verified reference code, and every value shown to a buyer is
 * rounded to whole cents with toCents(). Trail steps and displayed totals are
 * integer cents.
 */

export function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}

export function fromCents(cents: number): number {
  return cents / 100;
}

const withCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const wholeDollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** "$1,234.56". Negative values read "-$1,234.56". */
export function formatCents(cents: number): string {
  return withCents.format(cents / 100);
}

/** "$1,235". Rounds to the nearest whole dollar. */
export function formatWhole(dollars: number): string {
  return wholeDollars.format(dollars);
}

/** "+$1,234.56" or "-$1,234.56", and "$0.00" for zero. Used for changes. */
export function formatSignedCents(cents: number): string {
  if (cents === 0) return formatCents(0);
  return (cents > 0 ? "+" : "-") + withCents.format(Math.abs(cents) / 100);
}

/** Splits a cents value into the whole-dollar text and the two cent digits. */
export function splitCents(cents: number): { dollars: string; cents: string } {
  const abs = Math.abs(cents);
  const d = Math.floor(abs / 100);
  const c = abs % 100;
  return {
    dollars: (cents < 0 ? "-" : "") + "$" + d.toLocaleString("en-US"),
    cents: String(c).padStart(2, "0"),
  };
}
