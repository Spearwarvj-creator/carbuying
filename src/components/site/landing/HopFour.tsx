"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { FourSquare } from "@/components/walk/graphics";

const ORDER = ["price", "trade", "down", "pay"] as const;

/**
 * The dealer's worksheet with a marker that hops from box to box. It shows, without a sentence,
 * that the dealer's attention moves while the buyer watches one number. With reduced motion it stays still.
 */
export function HopFour({ values }: { values?: Partial<Record<"price" | "trade" | "down" | "pay", string>> }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % ORDER.length), 1500);
    return () => clearInterval(t);
  }, [reduce]);
  return <FourSquare lit={reduce ? null : ORDER[i]} values={values} />;
}
