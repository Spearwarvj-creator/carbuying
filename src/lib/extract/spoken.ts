import { fit, withImpliedTax, type Detected, type FillKey } from "./fields";

/**
 * Finds the numbers in what a buyer says or types: "Price thirty one five hundred, down three thousand, seven
 * point nine percent for sixty months". It is plain pattern matching, with no AI and no network, so it works
 * in a showroom with one bar of signal, and it can be tested exactly. It says which number goes where; it never
 * calculates. The buyer checks every field before any of it is used.
 */

const ONES: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11,
  twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
};
const TENS: Record<string, number> = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const BIG = new Set(["hundred", "thousand", "grand"]);

const isNumberWord = (w: string) => w in ONES || w in TENS || BIG.has(w);

/**
 * Turns spoken number words into digits. "five twenty two" is 522 and "twenty four ninety nine" is 2,499,
 * the way people say prices out loud; "thirty one thousand five hundred" is 31,500; "seven point nine" is 7.9.
 */
export function wordsToDigits(input: string): string {
  // Punctuation that ends a clause becomes its own word, so "three thousand, seven" is two numbers.
  const words = input
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/([,;.])(\s|$)/g, " $1 ")
    .split(/\s+/)
    .filter(Boolean);
  const out: string[] = [];
  let i = 0;
  while (i < words.length) {
    const w = words[i];
    const last = out[out.length - 1] ?? "";
    // "3 grand" and "1.9 thousand": digits already said, then a big word.
    if (BIG.has(w) && /^\d[\d,]*(?:\.\d+)?$/.test(last)) {
      out[out.length - 1] = String(Number(last.replace(/,/g, "")) * (w === "hundred" ? 100 : 1000));
      i++;
      continue;
    }
    if (!isNumberWord(w) && !(w === "a" && BIG.has(words[i + 1] ?? ""))) {
      out.push(words[i]);
      i++;
      continue;
    }
    let total = 0;
    let current = 0;
    let prev = "";
    let any = false;
    while (i < words.length) {
      const x = words[i];
      if (x === "and" && any && isNumberWord(words[i + 1] ?? "") && BIG.has(prev)) {
        i++;
        continue;
      }
      if (x === "a" && BIG.has(words[i + 1] ?? "") && !any) {
        current = 1;
        any = true;
        prev = x;
        i++;
        continue;
      }
      if (!isNumberWord(x)) break;
      const v = ONES[x] ?? TENS[x];
      if (BIG.has(x)) {
        if (x === "hundred") current = (current || 1) * 100;
        else {
          total += (current || 1) * 1000;
          current = 0;
        }
      } else {
        const prevIsUnit = prev in ONES;
        if (v < 10 && prevIsUnit && words[i + 1] === "hundred" && current >= 10 && total === 0) {
          // "thirty one five hundred" is 31,500: the first part is thousands.
          total = current * 1000;
          current = 0;
        } else if (prevIsUnit && v >= 10) current *= 100; // "five twenty two" is 522
        current += v;
      }
      any = true;
      prev = x;
      i++;
    }
    let text = String(total + current);
    if (words[i] === "point" && words[i + 1] in ONES && ONES[words[i + 1]] < 10) {
      let frac = "";
      i++;
      while (i < words.length && words[i] in ONES && ONES[words[i]] < 10) frac += ONES[words[i++]];
      text += `.${frac}`;
    }
    out.push(text);
  }
  return out.join(" ");
}

const N = String.raw`\$?\s*(\d[\d,]*(?:\.\d+)?)\s*(k\b|grand\b)?`;
const num = (m: RegExpExecArray, i = 1): number => {
  const base = Number(m[i].replace(/,/g, ""));
  return m[i + 1] ? base * 1000 : base;
};

interface Rule {
  key: FillKey | "taxAmount";
  re: RegExp;
  /** The words must come in this form for the match to count. */
  ok?: (value: number, m: RegExpExecArray) => boolean;
  convert?: (value: number, m: RegExpExecArray) => number;
}

/**
 * Rules run in this order, and each match is blanked out so a number is used once. The order matters:
 * "owe 15000" is claimed by the payoff before "trade in 8000" looks for its own number.
 */
const RULES: Rule[] = [
  { key: "months", re: new RegExp(String.raw`(\d{1,3})\s*(?:months?|mos?\b|month loan)`, "i") },
  { key: "months", re: new RegExp(String.raw`(\d{1,2})\s*(?:years?|yr)`, "i"), convert: (v) => v * 12 },
  { key: "taxAmount", re: new RegExp(String.raw`(?:sales\s+)?tax(?:es)?\s*(?:is|of|was|comes to|at)?\D{0,10}?${N}`, "i"), ok: (v) => v > 20 },
  { key: "taxRate", re: new RegExp(String.raw`(?:sales\s+)?tax(?:es)?\s*(?:is|of|was|at|rate)?\D{0,10}?(\d+(?:\.\d+)?)\s*(?:%|percent)?`, "i"), ok: (v) => v <= 20 },
  { key: "apr", re: new RegExp(String.raw`(?:apr|rate|interest)\s*(?:is|of|at|was)?\D{0,10}?(\d+(?:\.\d+)?)`, "i"), ok: (v) => v <= 40 },
  { key: "apr", re: new RegExp(String.raw`(\d+(?:\.\d+)?)\s*(?:%|percent|per cent)`, "i"), ok: (v) => v <= 40 },
  { key: "monthlyPayment", re: new RegExp(`${N}\\s*(?:a|per|each|/)\\s*month`, "i") },
  { key: "monthlyPayment", re: new RegExp(String.raw`(?<!down )(?:monthly\s+)?payments?\s*(?:is|of|will be|are)?\D{0,10}?${N}`, "i") },
  { key: "down", re: new RegExp(String.raw`(?:down\s*payment|down|cash down|up\s*front|upfront)\s*(?:is|of|was)?\D{0,12}?${N}`, "i") },
  { key: "down", re: new RegExp(`${N}\\s*(?:down|up\\s*front|upfront)`, "i") },
  { key: "tradePayoff", re: new RegExp(String.raw`(?:still\s+)?(?:owe|owed|payoff|pay\s*off)\s*(?:is|of|about)?\D{0,12}?${N}`, "i") },
  { key: "tradePayoff", re: new RegExp(`${N}\\s*(?:still\\s+)?(?:owed|payoff)`, "i") },
  { key: "tradeAllowance", re: new RegExp(String.raw`(?:trade(?:\s*in)?|trading(?:\s*in)?)\s*(?:value|allowance|is worth|worth|is|at|for)?\D{0,12}?${N}`, "i") },
  { key: "fees", re: new RegExp(String.raw`(?:doc(?:umentation)?\s*fees?|dealer\s*fees?|fees?)\s*(?:is|of|are|total)?\D{0,12}?${N}`, "i") },
  { key: "addons", re: new RegExp(String.raw`(?:add\s*ons?|extras?|warranty|protection|service contract|coating|accessories)\s*(?:is|are|of|total|cost)?\D{0,12}?${N}`, "i") },
  { key: "price", re: new RegExp(String.raw`(?:selling\s*price|sale\s*price|price|asking|sticker|msrp|car (?:is|costs)|costs)\s*(?:is|of|was|at)?\D{0,12}?${N}`, "i") },
];

/** "Take 500 off the price": a change to the price the buyer already has, so it needs the current price to mean anything. */
const TAKE_OFF = new RegExp(String.raw`(?:take|knock|drop|lower|reduce|cut)\s+(?:the price\s+)?${N}\s*(?:off|down)(?:\s+(?:of\s+)?(?:the\s+)?price)?`, "i");

export function parseSpoken(input: string, current?: { price?: number }): Detected {
  let text = wordsToDigits(input)
    .replace(/\bdollars?\b|\bbucks\b/gi, " ")
    .replace(/\bout the door\b[^,.;]*/gi, " ") // an out-the-door total is not the selling price
    .replace(/[-]/g, " ");
  let found: Detected = {};
  const off = TAKE_OFF.exec(text);
  if (off && current?.price && current.price > 0) {
    const amount = num(off);
    const price = fit("price", current.price - amount);
    if (price !== null && amount > 0 && amount < current.price) found = { price: { value: price, from: off[0].trim().replace(/\s+/g, " ") } };
    text = text.slice(0, off.index) + " ".repeat(off[0].length) + text.slice(off.index + off[0].length);
  }
  let taxAmount: number | null = null;
  let taxFrom = "";
  for (const rule of RULES) {
    if (rule.key !== "taxAmount" && found[rule.key]) continue;
    if (rule.key === "taxAmount" && taxAmount !== null) continue;
    const m = rule.re.exec(text);
    if (!m) continue;
    let v = num(m);
    if (rule.ok && !rule.ok(v, m)) continue;
    if (rule.convert) v = rule.convert(v, m);
    const from = m[0].trim().replace(/\s+/g, " ");
    text = text.slice(0, m.index) + " ".repeat(m[0].length) + text.slice(m.index + m[0].length);
    if (rule.key === "taxAmount") {
      taxAmount = v;
      taxFrom = from;
      continue;
    }
    const kept = fit(rule.key, v);
    if (kept !== null) found = { ...found, [rule.key]: { value: kept, from } };
  }
  return withImpliedTax(found, taxAmount, taxFrom);
}
