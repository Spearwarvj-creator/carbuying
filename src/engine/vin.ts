/**
 * Local VIN check-digit test (ISO 3779 transliteration and weights).
 * The 9th character must equal the weighted sum of the other 16, modulo 11,
 * where a remainder of 10 is written as X.
 */

const TRANSLITERATION: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
};

const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

export type VinProblem = "length" | "characters" | "check-digit";

export interface VinCheck {
  vin: string;
  /** Length 17 and only allowed characters. I, O and Q are never used in a VIN. */
  wellFormed: boolean;
  /** The 9th character is the right check digit. False when not well formed. */
  checkDigitOk: boolean;
  /** The check digit the other characters call for. Null when not well formed. */
  expected: string | null;
  problem: VinProblem | null;
}

export function normalizeVin(input: string): string {
  return input.replace(/[\s-]/g, "").toUpperCase();
}

export function checkVin(input: string): VinCheck {
  const vin = normalizeVin(input);
  if (vin.length !== 17) {
    return { vin, wellFormed: false, checkDigitOk: false, expected: null, problem: "length" };
  }
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
    return { vin, wellFormed: false, checkDigitOk: false, expected: null, problem: "characters" };
  }
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const ch = vin[i];
    const value = /[0-9]/.test(ch) ? Number(ch) : TRANSLITERATION[ch];
    sum += value * WEIGHTS[i];
  }
  const rem = sum % 11;
  const expected = rem === 10 ? "X" : String(rem);
  const checkDigitOk = vin[8] === expected;
  return { vin, wellFormed: true, checkDigitOk, expected, problem: checkDigitOk ? null : "check-digit" };
}
