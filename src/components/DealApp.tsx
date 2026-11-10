"use client";

import { useEffect, useLayoutEffect } from "react";
import { decodeDeal } from "@/engine";
import { setMode, useMode } from "@/lib/mode";
import { initLang, useLang } from "@/lib/i18n";
import { startPersistence } from "@/lib/persist";
import { useDeal } from "@/store/deal";
import { DealScreen } from "./DealScreen";
import { WalkScreen } from "./walk/WalkScreen";

/** The calculator has two views of the same numbers: the Walk for a first visit, and the Desk for experts. */
export function DealApp() {
  const mode = useMode();
  // Every word is read again when the language changes, so the calculator is drawn afresh.
  const lang = useLang();
  useEffect(() => {
    void initLang();
  }, []);
  // The place is restored before the first paint of the hydrated page, so a refresh does not show the example first.
  useLayoutEffect(() => startPersistence(), []);
  // A shared link carries the deal after the # sign. It is read here, in the browser, and the address is cleaned afterwards.
  useEffect(() => {
    if (location.hash.length < 8) return;
    void decodeDeal(location.hash).then((shared) => {
      if (!shared) return;
      useDeal.getState().loadShared(shared.offers, shared.vehicle ? { ...shared.vehicle } : null, shared.labels);
      setMode("desk");
      history.replaceState(null, "", location.pathname);
    });
  }, []);
  return mode === "desk" ? <DealScreen key={lang} /> : <WalkScreen key={lang} />;
}
