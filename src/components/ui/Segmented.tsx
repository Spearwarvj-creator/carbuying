"use client";

import { motion } from "motion/react";
import { ToggleGroup } from "radix-ui";
import { useId, type ReactNode } from "react";

export interface SegOption<T extends string | number> {
  value: T;
  label: ReactNode;
  /** Plain-text name for screen readers when the label is an icon or figure. */
  name?: string;
  icon?: ReactNode;
  sub?: string;
}

/**
 * One choice from a short list. Built on Radix ToggleGroup, so it is a real radio group with
 * arrow-key movement, roving focus and the right roles. The chosen item carries a thumb that
 * slides between options (a shared-layout animation), which shows where the choice moved.
 * Variants: pill (a soft capsule for a few states of one thing), chips (months), cards (a bigger choice with an icon and a line),
 * tabs (underlined words, for moving between parts of a page).
 */
export function Segmented<T extends string | number>({
  value,
  onChange,
  options,
  label,
  variant = "chips",
  className,
}: {
  value: T | null;
  onChange: (v: T) => void;
  options: SegOption<T>[];
  label: string;
  variant?: "pill" | "chips" | "cards" | "tabs";
  className?: string;
}) {
  const uid = useId();
  return (
    <ToggleGroup.Root
      type="single"
      className={`tg${className ? ` ${className}` : ""}`}
      data-variant={variant}
      value={value === null ? "" : String(value)}
      aria-label={label}
      onValueChange={(v) => {
        if (v === "") return; // a chosen item stays chosen
        const hit = options.find((o) => String(o.value) === v);
        if (hit) onChange(hit.value);
      }}
    >
      {options.map((o) => {
        const on = value !== null && String(o.value) === String(value);
        return (
          <ToggleGroup.Item key={String(o.value)} value={String(o.value)} className="tg-item" aria-label={o.name}>
            {on && (
              <motion.span
                layoutId={`${uid}-thumb`}
                className="tg-thumb"
                transition={{ type: "spring", stiffness: 520, damping: 38 }}
              />
            )}
            {o.icon && <span className="tg-ico">{o.icon}</span>}
            <span className="tg-text">
              <span className="tg-label num-keep">{o.label}</span>
              {o.sub && <span className="tg-sub">{o.sub}</span>}
            </span>
          </ToggleGroup.Item>
        );
      })}
    </ToggleGroup.Root>
  );
}
