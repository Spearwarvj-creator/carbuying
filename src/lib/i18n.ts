"use client";

import { useSyncExternalStore } from "react";
import { ai } from "@/data/strings/ai";
import { en } from "@/data/strings/en";
import { flagText, summaryText } from "@/data/strings/flags";
import { more } from "@/data/strings/more";
import { TERMS } from "@/data/strings/terms";
import { walk } from "@/data/strings/walk";

/**
 * The calculator's words come from a few string objects that every component reads when it draws. A language change
 * writes the new words into those same objects, in place, and then draws the calculator again, so no component has to
 * know about languages. English is always the fallback for a word the other pack does not have. The Spanish pack is
 * loaded only when it is chosen, so English readers never download it.
 *
 * Numbers, dollar amounts and every figure come from the calculator and are the same in both languages.
 */
export type Lang = "en" | "es";

const targets = { en, walk, ai, more, terms: TERMS, flags: flagText, summary: summaryText };

/** A string pack has the same shape as the English one, with free-text strings instead of fixed ones. */
type Widen<T> = T extends string
  ? string
  : T extends (...args: infer A) => string
    ? (...args: A) => string
    : T extends readonly (infer U)[]
      ? Widen<U>[]
      : T extends object
        ? { [K in keyof T]: Widen<T[K]> }
        : T;
export type Pack = { [K in keyof typeof targets]: Widen<(typeof targets)[K]> };

type Tree = { [key: string]: unknown };

function clone(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(clone);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, clone(v)]));
  return value;
}

/** Writes source into target without replacing any object or array, so references held elsewhere keep working. */
function assign(target: Tree, source: Tree) {
  for (const key of Object.keys(source)) {
    const from = source[key];
    const to = target[key];
    if (Array.isArray(from) && Array.isArray(to)) {
      to.length = 0;
      to.push(...from);
    } else if (from && typeof from === "object" && to && typeof to === "object") {
      assign(to as Tree, from as Tree);
    } else {
      target[key] = from;
    }
  }
}

const english = clone(targets) as Pack;
let current: Lang = "en";
const listeners = new Set<() => void>();
const KEY = "dd-lang";

async function load(lang: Lang): Promise<Pack> {
  if (lang === "en") return english;
  return (await import("@/data/strings/es")).es;
}

/** Switches the words. The English pack goes in first, so anything the Spanish pack lacks stays in English. */
export async function setLang(lang: Lang, remember = true) {
  const pack = await load(lang);
  for (const name of Object.keys(targets) as (keyof typeof targets)[]) {
    assign(targets[name] as unknown as Tree, english[name] as unknown as Tree);
    if (lang !== "en") assign(targets[name] as unknown as Tree, pack[name] as unknown as Tree);
  }
  current = lang;
  document.documentElement.lang = lang;
  if (remember) {
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      /* blocked storage: the language lasts for this visit */
    }
  }
  listeners.forEach((l) => l());
}

/** Reads the saved choice once, when the calculator opens. */
export async function initLang() {
  try {
    if (localStorage.getItem(KEY) === "es") await setLang("es", false);
  } catch {
    /* storage blocked: stay in English */
  }
}

export const getLang = (): Lang => current;

export function useLang(): Lang {
  return useSyncExternalStore(
    (notify) => {
      listeners.add(notify);
      return () => listeners.delete(notify);
    },
    () => current,
    () => "en" as Lang,
  );
}
