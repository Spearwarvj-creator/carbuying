import { create } from "zustand";
import { makeOffer, type Metric, type Offer } from "@/engine";
import { EXAMPLE_OFFERS } from "@/data/example";

export type NumKey = "price" | "taxRate" | "fees" | "addons" | "down" | "tradeAllowance" | "tradePayoff" | "apr" | "months";
export type BoxKey = "price" | "fees" | "down" | "loan";
export type TabKey = "deal" | "compare" | "target" | "ask";

/** The car the buyer looked up. It is shown with the deal; nothing about the price comes from it. */
export interface VehicleLabel {
  year: number;
  make: string;
  model: string;
  trim?: string;
  /** EPA estimate of a year of fuel, in dollars, when the car was found there. */
  annualFuelCost?: number | null;
  mpg?: number | null;
}

const blank = (): Offer => makeOffer({ price: 0, fees: 0, addons: 0, down: 0, apr: 0, months: 60, taxRate: 0 });

interface DealState {
  offers: [Offer, Offer];
  example: boolean;
  vehicle: VehicleLabel | null;
  setVehicle: (v: VehicleLabel | null) => void;
  /** The example has been changed, so it is no longer the untouched sample. It is still not the buyer's own deal. */
  edited: boolean;
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
  /** Start the Walk with one blank quote in Offer 1. */
  startQuote: () => void;
  /** Copy Offer 1 into Offer 2 so a second offer can be edited and compared. */
  addSecondOffer: () => void;
  seeExample: () => void;
  setTab: (tab: TabKey) => void;
  setMetric: (metric: Metric) => void;
}

export const useDeal = create<DealState>((set) => ({
  offers: EXAMPLE_OFFERS,
  example: true,
  vehicle: null,
  setVehicle: (vehicle) => set({ vehicle }),
  edited: false,
  editing: 1,
  openBox: null,
  drawKey: 0,
  tab: "deal",
  metric: "total",
  setValue: (key, value) =>
    set((s) => {
      const next: [Offer, Offer] = [s.offers[0], s.offers[1]];
      next[s.editing] = { ...next[s.editing], [key]: value };
      return { offers: next, edited: true };
    }),
  setEditing: (which) => set({ editing: which }),
  open: (box) => set({ openBox: box }),
  close: () => set((s) => ({ openBox: null, drawKey: s.drawKey + 1 })),
  useMine: () => set((s) => ({ offers: [blank(), blank()], example: false, edited: false, editing: 0, openBox: "price", drawKey: s.drawKey + 1 })),
  startQuote: () => set((s) => ({ offers: [blank(), blank()], example: false, edited: false, editing: 0, openBox: null, drawKey: s.drawKey + 1 })),
  addSecondOffer: () => set((s) => ({ offers: [s.offers[0], { ...s.offers[0] }], example: false, edited: false, editing: 1, openBox: null, tab: "deal", drawKey: s.drawKey + 1 })),
  seeExample: () => set((s) => ({ offers: EXAMPLE_OFFERS, example: true, edited: false, editing: 1, openBox: null, drawKey: s.drawKey + 1 })),
  setTab: (tab) => set({ tab, openBox: null }),
  setMetric: (metric) => set({ metric }),
}));
