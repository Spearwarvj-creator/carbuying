"use client";

import { motion, useReducedMotion } from "motion/react";

export interface TrailRow {
  key: string;
  label: string;
  cents: number;
  text: string;
}

/**
 * The money trail as bars on one scale: each bar is how much one cause moved the total, and they
 * add up to the line below. The bars grow from the left when they scroll into view.
 */
export function TrailBars({ rows, total, totalLabel }: { rows: TrailRow[]; total: string; totalLabel: string }) {
  const reduce = useReducedMotion();
  const max = Math.max(...rows.map((r) => Math.abs(r.cents)), 1);
  return (
    <ul className="i-trail">
      {rows.map((r, i) => (
        <li key={r.key} data-dir={r.cents > 0 ? "up" : "down"}>
          <span className="i-trail-k">{r.label}</span>
          {/* The full-width track is what scrolls into view; a bar scaled to zero has no area for the observer to see. */}
          <motion.span
            className="i-trail-track"
            aria-hidden="true"
            initial={reduce ? "show" : "hidden"}
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.i
              variants={{
                hidden: { scaleX: 0 },
                show: { scaleX: 1, transition: { type: "spring", stiffness: 120, damping: 22, delay: i * 0.12 } },
              }}
              style={{ width: `${Math.max((Math.abs(r.cents) / max) * 100, 4)}%`, transformOrigin: "left" }}
            />
          </motion.span>
          <span className="i-trail-v num">{r.text}</span>
        </li>
      ))}
      <li className="i-trail-sum">
        <span className="i-trail-k">{totalLabel}</span>
        <span />
        <span className="i-trail-v num">{total}</span>
      </li>
    </ul>
  );
}
