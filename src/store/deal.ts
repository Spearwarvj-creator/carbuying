import { create } from "zustand";
import { makeOffer, type Metric, type Offer } from "@/engine";
import { EXAMPLE_OFFERS } from "@/data/example";
import { en } from "@/data/strings/en";

export type NumKey = "price" | "taxRate" | "fees" | "addons" | "down" | "tradeAllowance" | "tradePayoff" | "rebate" | "apr" | "months";
export type BoxKey = "price" | "fees" | "down" | "loan";
export type TabKey = "deal" | "compare" | "target" | "ask" | "checks";

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
  /** The deal was opened from a shared link and has not been changed yet. */
  fromShare: boolean;
  loadShared: (offers: Offer[], vehicle: VehicleLabel | null, labels?: string[]) => void;
  /** Names the buyer gave the two offers, usually the dealer. An empty string means "Offer 1" or "Offer 2". */
  names: [string, string];
  setName: (which: 0 | 1, name: string) => void;
  dismissShare: () => void;
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
  fromShare: false,
  names: ["", ""],
  setName: (which, name) =>
    set((s) => {
      const names: [string, string] = [s.names[0], s.names[1]];
      names[which] = name.slice(0, 40);
      return { names };
    }),
  loadShared: (offers, vehicle, labels = []) =>
    set({
      offers: [offers[0], offers[1] ?? offers[0]],
      vehicle,
      names: [labels[0] ?? "", labels[1] ?? ""],
      example: false,
      edited: false,
      editing: offers.length > 1 ? 1 : 0,
      fromShare: true,
    }),
  dismissShare: () => set({ fromShare: false }),
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
  useMine: () => set((s) => ({ offers: [blank(), blank()], names: ["", ""], example: false, edited: false, editing: 0, openBox: "price", drawKey: s.drawKey + 1 })),
  startQuote: () => set((s) => ({ offers: [blank(), blank()], names: ["", ""], example: false, edited: false, editing: 0, openBox: null, drawKey: s.drawKey + 1 })),
  addSecondOffer: () => set((s) => ({ offers: [s.offers[0], { ...s.offers[0] }], example: false, edited: false, editing: 1, openBox: null, tab: "deal", drawKey: s.drawKey + 1 })),
  seeExample: () => set((s) => ({ offers: EXAMPLE_OFFERS, names: ["", ""], example: true, edited: false, editing: 1, openBox: null, drawKey: s.drawKey + 1 })),
  setTab: (tab) => set({ tab, openBox: null }),
  setMetric: (metric) => set({ metric }),
}));

/** The name to show for an offer: what the buyer typed, or "Offer 1" and "Offer 2". */
export const offerName = (names: [string, string], which: 0 | 1): string => names[which].trim() || (which === 0 ? en.offer1 : en.offer2);

/** Both names, for a view that shows the two offers. */
export function useOfferNames(): [string, string] {
  const names = useDeal((s) => s.names);
  return [offerName(names, 0), offerName(names, 1)];
}
