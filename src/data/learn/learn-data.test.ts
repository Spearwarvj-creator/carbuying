import { describe, expect, it } from "vitest";
import { BASE, CAT_ORDER, EN, termsFor } from "./index";
import { ES } from "./es";
import { termsIn } from "@/lib/learn/gloss";
import { UI_EN, UI_ES } from "./ui";
import type { ArtKey, TermText } from "./types";

const ART: ArtKey[] = ["menu", "receipt", "package", "keys", "fineprint", "recall", "scale", "fingerprint", "phone", "umbrella", "coupon", "friend", "piggy", "pizza", "seesaw", "coffee", "report", "handshake", "calendar", "gym", "stairs", "melt", "swap", "ladder", "rent", "fuel"];
const FIELDS: (keyof TermText)[] = ["term", "plain", "meaning", "why", "ask", "daily", "match"];
const digits = (t: TermText) => [t.meaning, t.why, t.ask, t.daily].join(" ").match(/\d[\d,.]*/g)?.map((x) => x.replace(/[.,]$/, "")).sort().join("|") ?? "";

for (const [name, text] of [["English", EN], ["Spanish", ES]] as const) {
  describe(`${name} dictionary`, () => {
    it("has an entry for every term and nothing extra", () => {
      expect(Object.keys(text).sort()).toEqual(BASE.map((b) => b.id).sort());
    });
    it("fills every field", () => {
      for (const b of BASE) for (const f of FIELDS) {
        const v = text[b.id][f];
        expect(Array.isArray(v) ? v.length : String(v).trim().length, `${b.id}.${f}`).toBeGreaterThan(0);
      }
    });
    it("has no dashes used for pauses, and no stray spaces", () => {
      for (const b of BASE) {
        const t = text[b.id];
        for (const s of [t.term, t.plain, t.meaning, t.why, t.ask, t.daily]) {
          expect(s, `${b.id}: ${s}`).not.toMatch(/[–—]|\s{2,}|\s$|^\s/);
        }
      }
    });
    it("keeps each lead sentence short", () => {
      for (const b of BASE) expect(text[b.id].plain.length, b.id).toBeLessThanOrEqual(90);
    });
    it("gives every phrase to one term only", () => {
      const seen = new Map<string, string>();
      for (const b of BASE) for (const m of text[b.id].match) {
        const key = m.toLowerCase();
        expect(seen.get(key), `"${m}" is used by ${seen.get(key)} and ${b.id}`).toBeUndefined();
        seen.set(key, b.id);
      }
    });
    it("ends each question with a question mark", () => {
      for (const b of BASE) expect(text[b.id].ask, b.id).toMatch(/\?$|\.$/);
    });
  });
}

describe("dictionary shape", () => {
  it("has about sixty terms in six groups", () => {
    expect(BASE.length).toBeGreaterThanOrEqual(60);
    for (const c of CAT_ORDER) expect(BASE.some((b) => b.cat === c), c).toBe(true);
  });
  it("has unique ids", () => expect(new Set(BASE.map((b) => b.id)).size).toBe(BASE.length));
  it("points only at terms that exist, never at itself", () => {
    const ids = new Set(BASE.map((b) => b.id));
    for (const b of BASE) for (const r of b.related) {
      expect(ids.has(r), `${b.id} -> ${r}`).toBe(true);
      expect(r).not.toBe(b.id);
    }
  });
  it("uses only pictures that are drawn", () => {
    for (const b of BASE) expect(ART, b.id).toContain(b.art);
  });
  it("has the terms the rest of the app points at", () => {
    const ids = new Set(BASE.map((b) => b.id));
    for (const id of ["negative-equity", "add-ons", "loan-term", "apr", "doc-fee", "selling-price"]) expect(ids.has(id), id).toBe(true);
  });
  it("keeps every figure the same in both languages", () => {
    for (const b of BASE) expect(digits(ES[b.id]), b.id).toBe(digits(EN[b.id]));
  });
  it("is not English copied into Spanish", () => {
    for (const b of BASE) expect(ES[b.id].meaning, b.id).not.toBe(EN[b.id].meaning);
  });
  it("builds terms in dictionary order", () => {
    expect(termsFor(EN).map((t) => t.id)).toEqual(BASE.map((b) => b.id));
  });
});

describe("the decoder on the sample text", () => {
  const entries = (text: Record<string, TermText>) => BASE.map((b) => ({ id: b.id, match: text[b.id].match }));
  it("finds the four words a dealer's pitch is made of, in English", () => {
    expect(termsIn(UI_EN.decode.sampleText, entries(EN))).toEqual(["monthly-payment", "paint-protection", "doc-fee", "spot-delivery"]);
  });
  it("finds the same four words in Spanish", () => {
    expect(termsIn(UI_ES.decode.sampleText, entries(ES))).toEqual(["monthly-payment", "paint-protection", "doc-fee", "spot-delivery"]);
  });
});
