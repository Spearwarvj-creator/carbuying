/**
 * The numbers guard. Any text an AI writes may only contain figures the calculator produced for this deal
 * (or that are in the fixed text it was asked to reword). If a figure appears that is not on that list,
 * the AI text is thrown away and the template text is shown instead. A model can choose words; it cannot
 * introduce a number.
 */
const FIGURE = /\$?\d[\d,]*(?:\.\d+)?\s*%?/g;

export function figuresIn(text: string): { raw: string; value: number; money: boolean; percent: boolean }[] {
  const out: { raw: string; value: number; money: boolean; percent: boolean }[] = [];
  for (const m of text.matchAll(FIGURE)) {
    const raw = m[0].trim();
    const value = Number(raw.replace(/[$,%\s]/g, ""));
    if (Number.isFinite(value)) out.push({ raw, value, money: raw.startsWith("$"), percent: raw.endsWith("%") });
  }
  return out;
}

const close = (a: number, b: number) => Math.abs(a - b) <= Math.max(0.51, Math.abs(b) * 0.0005);

/**
 * True when every money figure, percent, and number of 13 or more in the text is on the allowed list.
 * Small plain counts ("2 questions", "step 3") are not figures of the deal and pass.
 */
export function numbersAreAllowed(text: string, allowed: readonly number[]): boolean {
  return figuresIn(text).every((f) => {
    if (!f.money && !f.percent && f.value < 13 && Number.isInteger(f.value)) return true;
    return allowed.some((a) => close(f.value, a) || (f.percent && close(f.value, a * 100)));
  });
}

/** Every figure in a fixed text, for use as the allowed list when a model only rewords that text. */
export const allowedFrom = (...texts: string[]): number[] => texts.flatMap((t) => figuresIn(t).map((f) => f.value));
