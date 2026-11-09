import { flushSync } from "react-dom";

/**
 * Runs a state change inside a same-document View Transition, so the running total and the
 * picture move to their new values instead of cutting. View Transitions are Baseline across
 * all three engines since October 2025. Where the buyer asks for reduced motion, or the
 * browser has none, the change simply happens.
 */
export function withTransition(change: () => void) {
  const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  type VT = { ready?: Promise<unknown>; finished?: Promise<unknown>; updateCallbackDone?: Promise<unknown> };
  const doc = typeof document !== "undefined" ? (document as Document & { startViewTransition?: (cb: () => void) => VT }) : null;
  if (!doc || !doc.startViewTransition || reduce) {
    change();
    return;
  }
  const t = doc.startViewTransition(() => {
    flushSync(change);
  });
  // A skipped transition (a hidden tab, or a second change right after the first) rejects these.
  // The new state is already in place, so there is nothing to do about it.
  t.ready?.catch(() => {});
  t.finished?.catch(() => {});
  t.updateCallbackDone?.catch(() => {});
}
