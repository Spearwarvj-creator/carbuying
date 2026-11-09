"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Every animation in the product honours the buyer's reduced-motion setting from one place. */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
