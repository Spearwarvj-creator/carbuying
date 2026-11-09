"use client";

import { useSyncExternalStore } from "react";

export type Mode = "walk" | "desk";
const KEY = "dd-mode";
const listeners = new Set<() => void>();
let memory: Mode | null = null;

/** The Walk is the default for a first visit. The choice is kept on the device. */
export function getMode(): Mode {
  if (memory) return memory;
  try {
    return localStorage.getItem(KEY) === "desk" ? "desk" : "walk";
  } catch {
    return "walk";
  }
}

export function setMode(mode: Mode) {
  memory = mode;
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    /* private window or blocked storage: the choice lasts for this visit only */
  }
  listeners.forEach((l) => l());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  window.addEventListener("storage", notify);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", notify);
  };
}

export function useMode(): Mode {
  return useSyncExternalStore(subscribe, getMode, () => "walk" as Mode);
}
