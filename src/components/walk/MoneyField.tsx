"use client";

import { useId, useState, type ReactNode } from "react";

interface Props {
  label: ReactNode;
  value: number;
  onChange: (n: number) => void;
  /** Shown before the number, for example "$". */
  prefix?: string;
  /** Shown after the number, for example "%". */
  suffix?: string;
  /** Most decimal places allowed. */
  decimals?: number;
  hint?: string;
  /** A Term link, shown under the box. A button cannot live inside a label. */
  learn?: ReactNode;
  /** Largest value accepted. */
  max?: number;
  placeholder?: string;
  autoFocus?: boolean;
}

const fmt = (n: number, decimals: number) =>
  n ? n.toLocaleString("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: 0 }) : "";

/**
 * One number box. It uses the phone's own number keypad, accepts "31500", "$31,500" or "31,500",
 * and grows to fit what is typed (field-sizing is Baseline in every engine since Safari 26.2).
 * The parent re-keys it when the value is reset from outside.
 */
export function MoneyField({ label, value, onChange, prefix, suffix, decimals = 0, hint, learn, max = 10_000_000, placeholder = "0", autoFocus }: Props) {
  const id = useId();
  const [text, setText] = useState(fmt(value, decimals));

  function handle(raw: string) {
    const cleaned = raw.replace(/[^0-9.]/g, "");
    const [whole, ...rest] = cleaned.split(".");
    const frac = rest.join("").slice(0, decimals);
    const shown = decimals > 0 && cleaned.includes(".") ? `${whole}.${frac}` : whole;
    setText(shown);
    const n = parseFloat(shown);
    onChange(Number.isFinite(n) ? Math.min(n, max) : 0);
  }

  return (
    <div className="mf">
      <div className="mf-head">
        <label htmlFor={id}>{label}</label>
        {learn && <span className="learn">{learn}</span>}
      </div>
      <div className="box">
        {prefix && <span className="aff" aria-hidden="true">{prefix}</span>}
        <input
          id={id}
          className="num"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          autoFocus={autoFocus}
          placeholder={placeholder}
          value={text}
          aria-describedby={hint ? `${id}-h` : undefined}
          onChange={(e) => handle(e.target.value)}
          onBlur={() => setText(fmt(value, decimals))}
          onKeyDown={(e) => {
            // The phone keyboard's Go or Next key moves on, as a buyer would expect after typing a number.
            if (e.key === "Enter") {
              e.preventDefault();
              document.querySelector<HTMLButtonElement>(".nav .bt-primary")?.click();
            }
          }}
        />
        {suffix && <span className="aff" aria-hidden="true">{suffix}</span>}
      </div>
      {hint && (
        <p className="hint" id={`${id}-h`}>
          {hint}
        </p>
      )}
    </div>
  );
}
