import { describe, expect, it } from "vitest";
import { BASE } from "@/data/learn";
import { ART_KEYS } from "./Art";

describe("everyday pictures", () => {
  it("draws every picture a term asks for", () => {
    for (const b of BASE) expect(ART_KEYS, b.id).toContain(b.art);
  });
  it("draws no picture that nothing uses", () => {
    const used = new Set(BASE.map((b) => b.art));
    for (const k of ART_KEYS) expect(used.has(k), k).toBe(true);
  });
});
