import { create } from "zustand";
import type { TermKey } from "@/data/strings/terms";

export type WalkView = "door" | "check" | "stage";
export const STAGES = 6;

interface WalkState {
  view: WalkView;
  /** 1 to 6, used when view is "stage". */
  stage: number;
  startedWith: "payment" | "price" | null;
  /** The monthly payment the dealer quoted, in dollars. Zero when none was given. */
  quotedPay: number;
  /** Months from the ten-second check, carried into the loan step. */
  checkMonths: number;
  checkDown: number;
  /** The buyer has entered a rate, so the total is meaningful. */
  rateEntered: boolean;
  guess: "higher" | "same" | "lower" | null;
  /** Terms the buyer opened, in order. */
  seen: TermKey[];
  go: (view: WalkView, stage?: number) => void;
  setStage: (stage: number) => void;
  setStartedWith: (v: "payment" | "price") => void;
  setQuote: (pay: number, months: number, down: number) => void;
  setRateEntered: (v: boolean) => void;
  setGuess: (g: WalkState["guess"]) => void;
  markSeen: (k: TermKey) => void;
  reset: () => void;
}

const initial = {
  view: "door" as WalkView,
  stage: 1,
  startedWith: null as WalkState["startedWith"],
  quotedPay: 0,
  checkMonths: 60,
  checkDown: 0,
  rateEntered: false,
  guess: null as WalkState["guess"],
  seen: [] as TermKey[],
};

export const useWalk = create<WalkState>((set) => ({
  ...initial,
  go: (view, stage) => set((s) => ({ view, stage: stage ?? s.stage })),
  setStage: (stage) => set({ stage: Math.min(Math.max(stage, 1), STAGES), view: "stage" }),
  setStartedWith: (startedWith) => set({ startedWith }),
  setQuote: (quotedPay, checkMonths, checkDown) => set({ quotedPay, checkMonths, checkDown }),
  setRateEntered: (rateEntered) => set({ rateEntered }),
  setGuess: (guess) => set({ guess }),
  markSeen: (k) => set((s) => (s.seen.includes(k) ? s : { seen: [...s.seen, k] })),
  reset: () => set({ ...initial }),
}));
