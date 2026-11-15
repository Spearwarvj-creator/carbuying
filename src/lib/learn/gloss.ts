/**
 * Finds the car-buying words in a piece of text, so they can be made tappable or listed with their plain meanings. A word
 * matches only whole words, in any case, and the longest phrase wins ("out-the-door price" before "price"). It works on
 * the entries it is given, so it knows nothing about a language.
 */
export interface GlossEntry {
  id: string;
  match: readonly string[];
}

export interface Piece {
  text: string;
  /** Set when this piece is a term. */
  id?: string;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function build(entries: readonly GlossEntry[]): { re: RegExp; owner: Map<string, string> } | null {
  const owner = new Map<string, string>();
  for (const e of entries) for (const m of e.match) if (m.trim()) owner.set(m.toLowerCase(), e.id);
  const phrases = [...owner.keys()].sort((a, b) => b.length - a.length);
  if (phrases.length === 0) return null;
  // Whole words only. \p{L} keeps accented letters (Spanish) from counting as a word edge.
  return { re: new RegExp(`(?<![\\p{L}\\p{N}])(${phrases.map(escape).join("|")})(?![\\p{L}\\p{N}])`, "giu"), owner };
}

/** Splits text into plain pieces and term pieces. Each term is marked once per text, the first time it appears. */
export function segment(text: string, entries: readonly GlossEntry[], once = true): Piece[] {
  const b = build(entries);
  if (!b || !text) return [{ text }];
  const out: Piece[] = [];
  const seen = new Set<string>();
  let last = 0;
  for (const m of text.matchAll(b.re)) {
    const id = b.owner.get(m[0].toLowerCase());
    if (!id || (once && seen.has(id))) continue;
    seen.add(id);
    const at = m.index ?? 0;
    if (at > last) out.push({ text: text.slice(last, at) });
    out.push({ text: m[0], id });
    last = at + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out.length ? out : [{ text }];
}

/** Every term in the text, once each, in the order first met. For "Decode this". */
export function termsIn(text: string, entries: readonly GlossEntry[]): string[] {
  return segment(text, entries, true).flatMap((p) => (p.id ? [p.id] : []));
}
