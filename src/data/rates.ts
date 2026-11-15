/**
 * Typical car loan rates by credit band, as reference only. They are averages from one published source, not offers and
 * not a promise of what any lender will quote. Update them each quarter and change `asOf`.
 *
 * Source: Experian, "Average Car Loan Interest Rates by Credit Score", data as of Q2 2026, VantageScore 4.0.
 * Overall averages on the same page: new 6.35%, used 11.19%.
 */
export type CreditBand = "super" | "prime" | "near" | "sub" | "deep";

export const RATE_REFERENCE = {
  source: "Experian",
  asOf: "Q2 2026",
  model: "VantageScore 4.0",
  url: "https://www.experian.com/blogs/ask-experian/average-car-loan-interest-rates-by-credit-score/",
  overall: { new: 6.35, used: 11.19 },
  bands: [
    { key: "super", range: "781 and above", new: 4.41, used: 6.29 },
    { key: "prime", range: "661 to 780", new: 6.15, used: 8.81 },
    { key: "near", range: "601 to 660", new: 9.71, used: 13.93 },
    { key: "sub", range: "501 to 600", new: 13.52, used: 19.1 },
    { key: "deep", range: "300 to 500", new: 16.11, used: 21.62 },
  ],
} as const satisfies { bands: readonly { key: CreditBand; range: string; new: number; used: number }[] } & Record<string, unknown>;

export const BAND_KEYS: CreditBand[] = ["super", "prime", "near", "sub", "deep"];
