"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { EN, termsFor, type LearnTerm, type TermText } from "@/data/learn";
import type { Offer } from "@/engine";
import { useLang, type Lang } from "@/lib/i18n";
import { readSessionOffer } from "@/lib/persist";
import { useDeal } from "@/store/deal";
import type { GlossEntry } from "./gloss";

let esCache: Record<string, TermText> | null = null;
let esLoading: Promise<void> | null = null;
const listeners = new Set<() => void>();

/** The Spanish dictionary is fetched the first time Spanish is wanted, then kept. */
function loadEs() {
  if (esCache || esLoading) return;
  esLoading = import("@/data/learn/es").then((m) => {
    esCache = m.ES;
    listeners.forEach((l) => l());
  });
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export interface Dictionary {
  lang: Lang;
  terms: LearnTerm[];
  byId: Map<string, LearnTerm>;
  /** The phrases to look for in text, for making words tappable. */
  entries: GlossEntry[];
}

const built = new Map<Lang, Dictionary>();
function build(lang: Lang, text: Record<string, TermText>): Dictionary {
  const terms = termsFor(text);
  return { lang, terms, byId: new Map(terms.map((t) => [t.id, t])), entries: terms.map((t) => ({ id: t.id, match: t.match })) };
}

/** The dictionary in the reader's language. Until Spanish has arrived it shows English, never an empty list. */
export function useDictionary(): Dictionary {
  const lang = useLang();
  const es = useSyncExternalStore(subscribe, () => esCache, () => null);
  useEffect(() => {
    if (lang === "es") loadEs();
  }, [lang]);
  return useMemo(() => {
    const key: Lang = lang === "es" && es ? "es" : "en";
    if (!built.has(key)) built.set(key, build(key, key === "es" && es ? es : EN));
    return built.get(key)!;
  }, [lang, es]);
}

const useMountedFlag = () => useSyncExternalStore(() => () => {}, () => true, () => false);

/**
 * The deal the reader is working on, for the "In your deal" lines. On the calculator it is the offer being edited. On
 * pages outside it, it is read from this tab's saved place, which holds only numbers and never leaves the device.
 */
export function useMyOffer(): Offer | null {
  const storeOffer = useDeal((s) => s.offers[s.editing]);
  const example = useDeal((s) => s.example);
  const ready = useMountedFlag();
  const fromSession = useMemo(() => (ready ? readSessionOffer() : null), [ready]);
  if (storeOffer.price > 0 && !example) return storeOffer;
  return fromSession;
}

/** Whether the page has been drawn in the browser, so storage can be read without a mismatch. */
export const useReady = useMountedFlag;
