"use client";

import { useSyncExternalStore } from "react";

/**
 * How many numbers to show. The simple view, which is the default, rounds to whole dollars and keeps the extra pictures
 * and the long list of changes behind "Show the details". The full view shows everything. The choice is kept in this
 * browser (dd-detail) and nowhere else.
 */
export type Detail = "simple" | "full";
const KEY = "dd-detail";
const listeners = new Set<() => void>();
let cached: Detail | null = null;

function read(): Detail {
  try {
    return localStorage.getItem(KEY) === "full" ? "full" : "simple";
  } catch {
    return "simple";
  }
}

export function setDetail(d: Detail) {
  cached = d;
  try {
    localStorage.setItem(KEY, d);
  } catch {
    /* the choice still holds for this visit */
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useDetail = (): Detail => useSyncExternalStore(subscribe, () => (cached ??= read()), () => "simple");

/** Whole dollars in the simple view, dollars and cents in the full view. Cents in, text out. */
export function moneyFor(detail: Detail, cents: number, signed = false): string {
  const whole = detail === "simple";
  const n = whole ? Math.round(Math.abs(cents) / 100) : Math.abs(cents) / 100;
  const body = n.toLocaleString("en-US", { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 });
  const sign = cents < 0 ? "-" : signed && cents > 0 ? "+" : "";
  return `${sign}$${body}`;
}
