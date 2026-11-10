"use client";

import { motion, useReducedMotion } from "motion/react";
import { FlagIcon } from "@/components/ui/icons";

const TILES = 12;

/**
 * The close of the page: the same payment tiles as the hero, in one row, filling in to a finish flag.
 * It answers the hero's road, so the page ends where the loan ends, and it replaces a second copy of the car.
 * With reduced motion the row is drawn already full.
 */
export function FinaleRoad() {
  const reduce = useReducedMotion();
  return (
    <div className="fin-road" aria-hidden="true">
      <motion.div
        className="fin-row"
        initial={reduce ? false : "off"}
        whileInView="on"
        viewport={{ once: true, amount: 0.8 }}
        transition={{ staggerChildren: 0.07 }}
      >
        {Array.from({ length: TILES }, (_, i) => (
          <motion.i
            key={i}
            className="fin-tile"
            variants={{ off: { opacity: 0.2, scale: 0.85 }, on: { opacity: 1, scale: 1 } }}
            transition={{ type: "spring", stiffness: 360, damping: 24 }}
          />
        ))}
      </motion.div>
      <motion.span
        className="fin-flag"
        initial={reduce ? false : { opacity: 0, scale: 0.4, rotate: -20 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 18, delay: reduce ? 0 : TILES * 0.07 + 0.1 }}
      >
        <FlagIcon size={30} />
      </motion.span>
    </div>
  );
}
