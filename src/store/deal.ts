import { create } from "zustand";
import { makeOffer, type Metric, type Offer } from "@/engine";
import { EXAMPLE_OFFERS } from "@/data/example";

export type NumKey = "price" | "taxRate" | "fees" | "addons" | "down" | "tradeAllowance" | "tradePayoff" | "apr" | "months";
export type BoxKey = "price" | "fees" | "down" | "loan";
export type TabKey = "deal" | "compare" | "target" | "ask";

const blank = (): Offer => makeOffer({ price: 0, fees: 0, addons: 0, down: 0, apr: 0, months: 60, taxRate: 0 });

interface DealState {
  offers: [Offer, Offer];
  example: boolean;
  /** Which offer the boxes edit: 0 is Offer 1, 1 is Offer 2. */
  editing: 0 | 1;
  openBox: BoxKey | null;
  /** Changes each time an entry is confirmed, so the trail bars draw again. */
  drawKey: number;
  tab: TabKey;
  metric: Metric;
  setValue: (key: NumKey, value: number) => void;
  setEditing: (which: 0 | 1) => void;
  open: (box: BoxKey) => void;
  close: () => void;
  useMine: () => void;
  seeExample: () => void;
  setTab: (tab: TabKey) => void;
  setMetric: (metric: Metric) => void;
}

export const useDeal = create<DealState>((set) => ({
  offers: EXAMPLE_OFFERS,
  example: true,
  editing: 1,
  openBox: null,
  drawKey: 0,
  tab: "deal",
  metric: "total",
  setValue: (key, value) =>
    set((s) => {
      const next: [Offer, Offer] = [s.offers[0], s.offers[1]];
      next[s.editing] = { ...next[s.editing], [key]: value };
      return { offers: next, example: false };
    }),
  setEditing: (which) => set({ editing: which }),
  open: (box) => set({ openBox: box }),
  close: () => set((s) => ({ openBox: null, drawKey: s.drawKey + 1 })),
  useMine: () => set((s) => ({ offers: [blank(), blank()], example: false, editing: 0, openBox: "price", drawKey: s.drawKey + 1 })),
  seeExample: () => set((s) => ({ offers: EXAMPLE_OFFERS, example: true, editing: 1, openBox: null, drawKey: s.drawKey + 1 })),
  setTab: (tab) => set({ tab, openBox: null }),
  setMetric: (metric) => set({ metric }),
}));
