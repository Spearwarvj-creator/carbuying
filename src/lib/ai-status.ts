"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether the server has the AI helpers switched on. Asked once per page; until it answers, and if it cannot be
 * reached, the helpers that need a key stay hidden, so a buyer never meets a button that cannot work.
 */
let state: boolean | null = null;
const listeners = new Set<() => void>();
let asked = false;

function ask() {
  if (asked) return;
  asked = true;
  fetch("/api/status")
    .then((r) => (r.ok ? r.json() : { ai: false }))
    .catch(() => ({ ai: false }))
    .then((d: { ai?: boolean }) => {
      state = Boolean(d.ai);
      listeners.forEach((l) => l());
    });
}

function subscribe(l: () => void) {
  listeners.add(l);
  ask();
  return () => listeners.delete(l);
}

export const useAiOn = (): boolean => useSyncExternalStore(subscribe, () => state ?? false, () => false);
