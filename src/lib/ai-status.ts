"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether the server has the AI helpers switched on, and how many free AI uses (credits) this visitor has left today.
 * Asked once per page; until it answers, and if it cannot be reached, the helpers that need a key stay hidden, so a
 * buyer never meets a button that cannot work. Every AI call goes through aiFetch, which keeps the count up to date
 * from the server's answer and sends the visitor's boost code, if they were given one.
 */
export interface CreditState {
  limit: number;
  left: number;
  resetsAt: string;
}
interface Status {
  ai: boolean;
  credits: CreditState | null;
}

const BOOST_KEY = "dd-boost";
let state: Status = { ai: false, credits: null };
const listeners = new Set<() => void>();
let asked = false;

const set = (next: Status) => {
  state = next;
  listeners.forEach((l) => l());
};

function boostCode(): string {
  try {
    return localStorage.getItem(BOOST_KEY) ?? "";
  } catch {
    return "";
  }
}
const boostHeader = (): Record<string, string> => (boostCode() ? { "x-boost-code": boostCode() } : {});

async function load(): Promise<Status> {
  try {
    const r = await fetch("/api/status", { headers: boostHeader() });
    const d = r.ok ? ((await r.json()) as { ai?: boolean; credits?: (CreditState & { used?: number }) | null }) : { ai: false };
    const c = d.credits;
    return { ai: Boolean(d.ai), credits: c ? { limit: c.limit, left: c.left, resetsAt: c.resetsAt } : null };
  } catch {
    return { ai: false, credits: null };
  }
}

function ask() {
  if (asked) return;
  asked = true;
  void load().then(set);
}

function subscribe(l: () => void) {
  listeners.add(l);
  ask();
  return () => listeners.delete(l);
}

export const useAiOn = (): boolean => useSyncExternalStore(subscribe, () => state.ai, () => false);
export const useCredits = (): CreditState | null => useSyncExternalStore(subscribe, () => state.credits, () => null);

/** Posts to an AI route with the visitor's boost code, and updates the count from the answer. */
export async function aiFetch(path: string, body: unknown): Promise<Response> {
  const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json", ...boostHeader() }, body: JSON.stringify(body) });
  const left = res.headers.get("x-credits-left");
  if (left !== null && state.credits) {
    const limit = Number(res.headers.get("x-credits-limit"));
    const resetsAt = res.headers.get("x-credits-resets");
    set({ ...state, credits: { limit: limit > 0 ? limit : state.credits.limit, left: Number(left), resetsAt: resetsAt ?? state.credits.resetsAt } });
  }
  return res;
}

/** Tries a boost code. It is kept only if the server accepts it, which shows as a higher daily allowance. */
export async function applyBoost(code: string): Promise<{ ok: boolean; limit: number }> {
  const before = state.credits?.limit ?? 0;
  const trimmed = code.trim().slice(0, 40);
  try {
    localStorage.setItem(BOOST_KEY, trimmed);
  } catch {
    // Without storage the code cannot be kept, so it cannot work for the next request either.
    return { ok: false, limit: before };
  }
  const next = await load();
  const ok = Boolean(next.credits && next.credits.limit > before);
  if (!ok) {
    try {
      localStorage.removeItem(BOOST_KEY);
    } catch {
      /* nothing to remove */
    }
    return { ok: false, limit: before };
  }
  set(next);
  return { ok: true, limit: next.credits?.limit ?? before };
}
