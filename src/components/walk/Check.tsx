"use client";

import { useState } from "react";
import { Nums } from "@/components/Nums";
import { walk } from "@/data/strings/walk";
import { formatWhole, paymentsAddUp } from "@/engine";
import { MoneyField } from "./MoneyField";
import { PaymentStrip } from "./graphics";

export const MONTH_CHOICES = [36, 48, 60, 72, 84] as const;

export function MonthChips({ value, onChange, label }: { value: number; onChange: (m: number) => void; label: string }) {
  return (
    <div className="chipset" role="group" aria-label={label}>
      {MONTH_CHOICES.map((m) => (
        <button key={m} type="button" className="chipbtn num" aria-pressed={value === m} onClick={() => onChange(m)}>
          {m}
        </button>
      ))}
    </div>
  );
}

export interface CheckValues {
  pay: number;
  months: number;
  down: number;
}

/**
 * The ten-second check. Two numbers the dealer has already said, and one fact back: what a
 * monthly payment adds up to over the whole loan. Nothing else is asked for.
 */
export function TenSecondCheck({
  initial,
  onChange,
  onContinue,
  showDown = true,
  ctaLabel,
}: {
  initial?: Partial<CheckValues>;
  onChange?: (v: CheckValues) => void;
  onContinue?: (v: CheckValues) => void;
  showDown?: boolean;
  ctaLabel?: string;
}) {
  const t = walk.check;
  const [pay, setPay] = useState(initial?.pay ?? 0);
  const [months, setMonths] = useState(initial?.months ?? 72);
  const [down, setDown] = useState(initial?.down ?? 0);

  function update(next: Partial<CheckValues>) {
    const v = { pay, months, down, ...next };
    setPay(v.pay);
    setMonths(v.months);
    setDown(v.down);
    onChange?.(v);
  }

  const total = paymentsAddUp(pay, months, down);
  const ready = pay > 0;

  return (
    <div className="check">
      <div className="check-in">
        <MoneyField label={t.paymentLabel} prefix="$" value={pay} onChange={(n) => update({ pay: n })} max={20000} autoFocus={false} />
        <div className="mf">
          <span className="lab" id="check-months">
            {t.monthsLabel}
          </span>
          <MonthChips value={months} onChange={(m) => update({ months: m })} label={t.monthsLabel} />
        </div>
        {showDown && (
          <MoneyField
            label={
              <>
                {t.downLabel} <span className="opt">({t.optional})</span>
              </>
            }
            prefix="$"
            value={down}
            onChange={(n) => update({ down: n })}
          />
        )}
      </div>

      <div className="check-out" aria-live="polite">
        {ready ? (
          <>
            <p className="check-line">
              <Nums
                text={
                  down > 0
                    ? t.resultDown(formatWhole(total), months, formatWhole(down))
                    : t.result(formatWhole(total), months)
                }
              />
            </p>
            <PaymentStrip months={months} caption={t.captionStrip(months)} />
            <p className="hint">{t.prompt}</p>
          </>
        ) : (
          <p className="hint">{t.empty}</p>
        )}
        {onContinue && (
          <button type="button" className="go" disabled={!ready} onClick={() => onContinue({ pay, months, down })}>
            {ctaLabel ?? t.cta}
          </button>
        )}
      </div>
    </div>
  );
}
