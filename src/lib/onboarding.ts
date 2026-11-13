"use client";

import { useSyncExternalStore } from "react";
import { useDeal } from "@/store/deal";

/**
 * What the first-visit guide has shown. The welcome screens and the tour of the Desk each appear once, on their own,
 * and can be opened again from the Help button. Only "has been seen" is kept, in this browser, under dd-seen.
 */
type Seen = { welcome?: boolean; desk?: boolean };
interface State {
  welcome: boolean;
  help: boolean;
  tour: boolean;
}

const KEY = "dd-seen";
let state: State = { welcome: false, help: false, tour: false };
const listeners = new Set<() => void>();
const set = (patch: Partial<State>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

export function readSeen(): Seen {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Seen;
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}
function markSeen(key: keyof Seen) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...readSeen(), [key]: true }));
  } catch {
    /* Without storage the guide simply shows again next time. */
  }
}

export const openWelcome = () => set({ welcome: true, help: false, tour: false });
export function closeWelcome() {
  markSeen("welcome");
  set({ welcome: false });
}
export const openHelp = () => set({ help: true });
export const closeHelp = () => set({ help: false });
export function startDeskTour() {
  // A number sheet left open would hold the focus and the taps, so it is closed before the tour points at the boxes.
  useDeal.getState().close();
  set({ tour: true, help: false, welcome: false });
}
export function endTour() {
  markSeen("desk");
  set({ tour: false });
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const useGuide = (): State => useSyncExternalStore(subscribe, () => state, () => state);
