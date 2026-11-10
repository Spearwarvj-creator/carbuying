import { useMemo, useSyncExternalStore } from "react";
import { z } from "zod";
import { OfferSchema, type Offer } from "@/engine";

/**
 * A deal saved on this device only, in the browser's own storage, when the buyer asks for it. It is never
 * sent anywhere, and the buyer can delete it. The key is named on the Privacy page.
 */
const KEY = "dd-saved";
const CHANGED = "dd-saved-changed";
const Saved = z.object({ v: z.literal(1), offer: OfferSchema, quotedPay: z.number().min(0).max(100_000).default(0), at: z.number() });
export type SavedDeal = z.infer<typeof Saved>;

export function saveDeal(offer: Offer, quotedPay: number): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: 1, offer, quotedPay, at: Date.now() } satisfies SavedDeal));
    window.dispatchEvent(new Event(CHANGED));
    return true;
  } catch {
    return false;
  }
}

export function loadDeal(): SavedDeal | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = Saved.safeParse(JSON.parse(raw));
    return p.success ? p.data : null;
  } catch {
    return null;
  }
}

export function clearDeal() {
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(CHANGED));
  } catch {
    /* storage blocked: nothing was saved */
  }
}

function subscribe(notify: () => void) {
  window.addEventListener(CHANGED, notify);
  window.addEventListener("storage", notify);
  return () => {
    window.removeEventListener(CHANGED, notify);
    window.removeEventListener("storage", notify);
  };
}

const rawSaved = () => {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
};

/** The saved deal, or null. Follows saving and deleting from anywhere on the page. */
export function useSavedDeal(): SavedDeal | null {
  const raw = useSyncExternalStore(subscribe, rawSaved, () => "");
  return useMemo(() => {
    if (!raw) return null;
    try {
      const p = Saved.safeParse(JSON.parse(raw));
      return p.success ? p.data : null;
    } catch {
      return null;
    }
  }, [raw]);
}
