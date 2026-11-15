import { describe, expect, it } from "vitest";
import { es } from "@/data/strings/es";
import { BASE } from "./index";
import { ES } from "./es";
import { LESSONS_ES } from "./lessons";
import { MINE_ES } from "./mine";
import { UI_ES } from "./ui";

/**
 * Quality gates for the Spanish text that a person can check without a Spanish speaker: the register is the same
 * throughout ("usted", never "tú"), no English is left in sentences, questions open with their mark, and there are no
 * dashes used for pauses. They do not replace a native reviewer; they catch the slips a reviewer should not have to.
 */
type Leaf = { path: string; text: string };

/** Every string in an object, and what each function in it says when it is given sample figures. */
function leaves(value: unknown, path = ""): Leaf[] {
  if (typeof value === "string") return [{ path, text: value }];
  if (typeof value === "function") {
    const out: Leaf[] = [];
    const tries: unknown[][] = [["$1,000", 2, 3], [5, "ejemplo", 7], ["$2,500", "$1,200", 6], [60, 84, true], [7.9, 72, "Ana"]];
    for (const args of tries) {
      try {
        const r = (value as (...a: unknown[]) => unknown)(...args);
        if (typeof r === "string") {
          out.push({ path: `${path}()`, text: r });
          break;
        }
      } catch {
        /* this set of figures does not fit the function; try the next */
      }
    }
    return out;
  }
  if (Array.isArray(value)) return value.flatMap((v, i) => leaves(v, `${path}[${i}]`));
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
  return [];
}

const prose: Leaf[] = [
  ...BASE.flatMap((b) => {
    const t = ES[b.id];
    return [t.term, t.plain, t.meaning, t.why, t.ask, t.daily].map((text, i) => ({ path: `dictionary.${b.id}.${["term", "plain", "meaning", "why", "ask", "daily"][i]}`, text }));
  }),
  ...leaves(LESSONS_ES, "lessons"),
  ...leaves(UI_ES, "learnUi"),
  ...Object.entries(MINE_ES).flatMap(([id, f]) =>
    ["a", "b"].flatMap(() => {
      const v = { price: "$31,500", otd: "$36,720", rest: "$5,220", fees: "$900", tax: "$2,421", rate: "7.25%", apr: 7.9, months: 84, interest: "$10,287", share: 22, financed: "$33,720", pay: "$523.90", perDay: "$17", down: "$3,000", addons: "$1,899", addonsReal: "$2,658", allowance: "$6,000", payoff: "$9,500", gap: "$3,500", rebate: "$500", alt: { months: 60, pay: "$610", diff: "$3,400", more: false }, raw: { fees: 900, addons: 1899, down: 3000, allowance: 6000, payoff: 9500, rebate: 500, equity: -3500 } };
      const r = f(v);
      return r ? [{ path: `mine.${id}`, text: r }] : [];
    }),
  ),
  ...leaves(es.more, "more"),
  ...leaves(es.ai, "ai"),
];

// "In English" is the button that rewords the dealer message in English, so it is English on purpose.
const ALLOWED = [/out-the-door/gi, /trade-in/gi, /wear and tear/gi, /loan-to-value/gi, /debt-to-income/gi, /bait and switch/gi, /truth in lending/gi, /payment packing/gi, /yo-yo/gi, /\bas-is\b/gi, /\bas is\b/gi, /\bdeal desk\b/gi, /\bin english\b/gi];
const stripAllowed = (s: string) => ALLOWED.reduce((t, re) => t.replace(re, " "), s);

describe("Spanish text, register and leftovers", () => {
  it("has a body of text to check", () => {
    expect(prose.length).toBeGreaterThan(500);
  });
  it("keeps to the polite form (usted), never the familiar one (tú)", () => {
    const familiar = /(?<![\p{L}])(tú|tu|tus|tienes|puedes|quieres|eres|estás|necesitas|debes|haz|ten|contigo|vos|te|ti)(?![\p{L}])/iu;
    const bad = prose.filter((l) => familiar.test(l.text)).map((l) => `${l.path}: ${l.text}`);
    expect(bad).toEqual([]);
  });
  it("leaves no English sentence in the Spanish", () => {
    const english = /(?<![\p{L}])(the|and|your|you|with|for|this|that|from|will|are|is|not|an|of|to|in|on)(?![\p{L}])/iu;
    const bad = prose.filter((l) => english.test(stripAllowed(l.text))).map((l) => `${l.path}: ${l.text}`);
    expect(bad).toEqual([]);
  });
  it("opens every question with an inverted question mark", () => {
    const bad = prose
      .filter((l) => l.text.includes("?"))
      .filter((l) => {
        const sentences = l.text.split(/(?<=[.!?])\s+/);
        return sentences.some((s) => s.includes("?") && !s.includes("¿"));
      })
      .map((l) => `${l.path}: ${l.text}`);
    expect(bad).toEqual([]);
  });
  it("uses no dash for a pause", () => {
    const bad = prose.filter((l) => /[–—]/.test(l.text)).map((l) => `${l.path}: ${l.text}`);
    expect(bad).toEqual([]);
  });
  it("uses a decimal point for decimals, as United States Spanish does", () => {
    const bad = prose.filter((l) => /\d,\d{1,2}\s?%/.test(l.text)).map((l) => `${l.path}: ${l.text}`);
    expect(bad).toEqual([]);
  });
  it("has no old trade-in phrase anywhere in the calculator's Spanish", () => {
    const all = [...leaves(es.en, "en"), ...leaves(es.walk, "walk"), ...leaves(es.terms, "terms"), ...leaves(es.flags, "flags"), ...leaves(es.summary, "summary")];
    const bad = all.filter((l) => /(auto|vehículo)s? a cambio/i.test(l.text)).map((l) => `${l.path}: ${l.text}`);
    expect(bad).toEqual([]);
  });
  it("keeps the preferred terms the glossary sets", () => {
    const text = prose.map((l) => l.text).join("\n");
    // The CFPB and FTC call a co-signer "cofirmante" and APR the "tasa efectiva anual".
    expect(text).toContain("cofirmante");
    expect(text).toContain("tasa efectiva anual");
    // The trade-in is "auto de intercambio" (the older "auto a cambio" read as a calque and is gone).
    expect(text).toContain("auto de intercambio");
    expect(text).not.toMatch(/(auto|vehículo)s? a cambio/i);
    // "codeudor" may appear only as the alternative in a heading, not in explanations.
    const body = BASE.map((b) => `${ES[b.id].meaning} ${ES[b.id].why} ${ES[b.id].ask} ${ES[b.id].daily}`).join("\n");
    expect(body).not.toMatch(/codeudor/i);
  });
});
