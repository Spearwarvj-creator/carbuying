"use client";

import { Slider as RSlider } from "radix-ui";

/**
 * A range slider on Radix Slider: keyboard steps, page keys, touch drag and the right ARIA.
 * It sits beside the number box, so the buyer can drag to feel a change or type an exact value.
 */
export function Slider({
  value,
  onChange,
  min,
  max,
  step,
  label,
  format,
}: {
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
  format?: (n: number) => string;
}) {
  return (
    <RSlider.Root
      className="slider"
      value={[Math.min(Math.max(value, min), max)]}
      min={min}
      max={max}
      step={step}
      onValueChange={([n]) => onChange(n)}
    >
      <RSlider.Track className="slider-track">
        <RSlider.Range className="slider-range" />
      </RSlider.Track>
      <RSlider.Thumb className="slider-thumb" aria-label={label} aria-valuetext={format ? format(value) : undefined} />
    </RSlider.Root>
  );
}
