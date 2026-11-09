"use client";

import { animate, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * A figure that counts to its new value instead of jumping, so the buyer sees which way money
 * moved. The text node is written by the animation, not by React, so a re-render never fights it.
 * Screen readers get the final value only, from a hidden copy, not every frame of the count.
 * With reduced motion on, it simply shows the new value.
 */
export function AnimatedNumber({
  value,
  format,
  duration = 0.55,
  className,
}: {
  value: number;
  format: (n: number) => string;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [initial] = useState(() => format(value));
  const node = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);

  useEffect(() => {
    const el = node.current;
    if (!el) return;
    if (reduce || shown.current === value) {
      shown.current = value;
      el.textContent = format(value);
      return;
    }
    // From wherever the count is now, so a quick second change retargets smoothly.
    const run = animate(shown.current, value, {
      duration,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => {
        shown.current = v;
        el.textContent = format(v);
      },
      onComplete: () => {
        shown.current = value;
        el.textContent = format(value);
      },
    });
    return () => run.stop();
  }, [value, format, duration, reduce]);

  return (
    <>
      <span ref={node} className={className} aria-hidden="true" suppressHydrationWarning>
        {initial}
      </span>
      <span className="sr-only">{format(value)}</span>
    </>
  );
}
