import fs from "fs";
import { describe, expect, it } from "vitest";
import { ai } from "@/data/strings/ai";
import { en } from "@/data/strings/en";
import { es } from "@/data/strings/es";
import { flagText, summaryText } from "@/data/strings/flags";
import { more } from "@/data/strings/more";
import { TERMS } from "@/data/strings/terms";
import { walk } from "@/data/strings/walk";
import { BASE, EN } from "./index";
import { ES } from "./es";
import { LESSONS_EN, LESSONS_ES } from "./lessons";
import { UI_EN, UI_ES } from "./ui";

/**
 * Writes every English and Spanish pair of the product's words to docs/es-review/items.json, for the review packet
 * (see scripts/es-review.mjs and docs/ES_REVIEW_PROCESS.md). It runs only when ES_EXPORT=1, so ordinary test runs
 * leave the file alone.
 */
interface Item {
  id: string;
  group: string;
  en: string;
  es: string;
}

// Placeholders first, so a reviewer sees the shape of each sentence; a function that needs real numbers falls through to the figures.
const TRIES: unknown[][] = [["\u27e61\u27e7", "\u27e62\u27e7", "\u27e63\u27e7", "\u27e64\u27e7"], ["$1,000", 2, 3], [5, "ejemplo", 7], ["$2,500", "$1,200", 6], [60, 84, true], [7.9, 72, "Ana"]];

function say(v: unknown): string | null {
  if (typeof v === "string") return v;
  if (typeof v !== "function") return null;
  for (const args of TRIES) {
    try {
      const r = (v as (...a: unknown[]) => unknown)(...args);
      if (typeof r === "string") return r;
    } catch {
      /* try the next set of figures */
    }
  }
  return null;
}

/** Pairs the leaves of two objects with the same shape. */
function pair(a: unknown, b: unknown, path: string, group: string, out: Item[]) {
  const sa = say(a);
  const sb = say(b);
  if (sa !== null && sb !== null) {
    out.push({ id: path, group, en: sa, es: sb });
    return;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    a.forEach((x, i) => pair(x, b[i], `${path}[${i}]`, group, out));
    return;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    for (const k of Object.keys(a as object)) pair((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], `${path}.${k}`, group, out);
  }
}

const exporting = process.env.ES_EXPORT === "1";

describe.skipIf(!exporting)("export the Spanish review items", () => {
  it("writes docs/es-review/items.json", () => {
    const items: Item[] = [];
    for (const b of BASE) {
      for (const f of ["term", "plain", "meaning", "why", "ask", "daily"] as const) items.push({ id: `dictionary.${b.id}.${f}`, group: "Learn dictionary", en: EN[b.id][f], es: ES[b.id][f] });
    }
    pair(LESSONS_EN, LESSONS_ES, "lessons", "Learn lessons", items);
    pair(UI_EN, UI_ES, "learnUi", "Learn page words", items);
    pair(en, es.en, "calculator.en", "Calculator", items);
    pair(walk, es.walk, "calculator.walk", "Calculator Walk", items);
    pair(ai, es.ai, "calculator.ai", "Calculator AI and checks", items);
    pair(more, es.more, "calculator.more", "Calculator extras", items);
    pair(TERMS, es.terms, "calculator.terms", "Calculator term cards", items);
    pair(flagText, es.flags, "calculator.flags", "Deal checks", items);
    pair(summaryText, es.summary, "calculator.summary", "Deal summary", items);
    const clean = items.filter((i) => i.en.trim() && i.es.trim() && !/^[\d\s.,$%]+$/.test(i.en));
    fs.mkdirSync("docs/es-review", { recursive: true });
    fs.writeFileSync("docs/es-review/items.json", JSON.stringify(clean, null, 1));
    expect(clean.length).toBeGreaterThan(800);
  });
});
