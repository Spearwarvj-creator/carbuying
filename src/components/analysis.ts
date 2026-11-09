"use client";

import { useMemo } from "react";
import { computeDeal, trail, whatItTakes, type Deal, type Trail, type WhatItTakes } from "@/engine";
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
