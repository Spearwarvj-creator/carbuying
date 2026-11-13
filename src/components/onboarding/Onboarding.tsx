"use client";

import { useEffect } from "react";
import { useMode } from "@/lib/mode";
import { openWelcome, readSeen, startDeskTour, useGuide } from "@/lib/onboarding";
import { useDeal } from "@/store/deal";
import { HelpSheet } from "./HelpSheet";
import { Tour } from "./Tour";
import { Welcome } from "./Welcome";

/**
 * Mounts the guide once for the calculator and decides when it starts on its own. The welcome shows on a first visit,
 * but not when someone opened a shared link or came back to a step. The Desk tour shows the first time someone reaches
 * the Desk, after the welcome is done. Both can be started again from Help.
 */
export function Onboarding() {
  const mode = useMode();
  const { welcome, help, tour } = useGuide();
  const fromShare = useDeal((s) => s.fromShare);

  useEffect(() => {
    if (readSeen().welcome) return;
    if (location.hash.length >= 8 || new URLSearchParams(location.search).has("step")) return;
    openWelcome();
  }, []);

  useEffect(() => {
    if (mode !== "desk" || fromShare || welcome || help || tour) return;
    const seen = readSeen();
    if (!seen.welcome || seen.desk) return;
    const id = setTimeout(startDeskTour, 700);
    return () => clearTimeout(id);
  }, [mode, fromShare, welcome, help, tour]);

  return (
    <>
      <Welcome />
      <HelpSheet />
      <Tour />
    </>
  );
}
