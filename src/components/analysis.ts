"use client";

import { useMemo } from "react";
import { computeDeal, trail, whatItTakes, type Deal, type Trail, type WhatItTakes } from "@/engine";
import { en } from "@/data/strings/en";
import { useDeal } from "@/store/deal";

export interface Analysis {
  /** Both offers have a price, so the numbers mean something. */
  ready: boolean;
  d1: Deal;
  d2: Deal;
  trail: Trail | null;
  take: WhatItTakes | null;
}

/** Every number on screen comes from here, which calls the engine. */
export function useAnalysis(): Analysis {
  const offers = useDeal((s) => s.offers);
  const metric = useDeal((s) => s.metric);
  return useMemo(() => {
    const [o1, o2] = offers;
    const ready = o1.price > 0 && o2.price > 0;
    return {
      ready,
      d1: computeDeal(o1),
      d2: computeDeal(o2),
      trail: ready ? trail(o1, o2) : null,
      take: ready ? whatItTakes(o1, o2, metric) : null,
    };
  }, [offers, metric]);
}

/** What to say when the two offers are not both filled in: the Desk compares two, so a lone Offer 1 needs a different nudge than an empty screen. */
export function useEmptyHint(): string {
  const o1 = useDeal((s) => s.offers[0].price);
  const o2 = useDeal((s) => s.offers[1].price);
  return o1 > 0 && o2 <= 0 ? en.result.emptyOne : en.result.empty;
}
