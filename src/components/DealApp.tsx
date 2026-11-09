"use client";

import { useMode } from "@/lib/mode";
import { DealScreen } from "./DealScreen";
import { WalkScreen } from "./walk/WalkScreen";

/** The calculator has two views of the same numbers: the Walk for a first visit, and the Desk for experts. */
export function DealApp() {
  const mode = useMode();
  return mode === "desk" ? <DealScreen /> : <WalkScreen />;
}
