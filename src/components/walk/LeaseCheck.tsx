"use client";

import { Dialog } from "radix-ui";
import { useMemo, useState, type ReactNode } from "react";
import { Nums } from "@/components/Nums";
import { CloseIcon } from "@/components/ui/icons";
import { more } from "@/data/strings/more";
import { computeLease, formatCents, formatWhole, moneyFactorFromApr, type LeaseInput } from "@/engine";
import { useDeal } from "@/store/deal";
import { MoneyField } from "./MoneyField";

const t = more.lease;

const blank = (price: number, taxRate: number): LeaseInput => ({
  price,
  msrp: 0,
  residualPct: 0,
  moneyFactor: 0,
  months: 36,
  down: 0,
  rebate: 0,
  tradeAllowance: 0,
  tradePayoff: 0,
  fees: 0,
  taxRate,
  milesAllowed: 12000,
  milesExpected: 0,
  overageRate: 0,
});

/**
 * Checks a lease the way the lease sheet works it: depreciation plus the finance charge, taxed. The buyer enters the
 * sheet's numbers and sees the payment, the cash due at signing, the rate the money factor really is, and the cost of
 * going over the mileage. All of it comes from the calculator; nothing here is guessed.
 */
export function LeaseCheck({ trigger }: { trigger: ReactNode }) {
  const offer = useDeal((s) => s.offers[s.editing]);
  const [open, setOpen] = useState(false);
  const [v, setV] = useState<LeaseInput>(() => blank(0, 0));
  const [factorKey, setFactorKey] = useState(0);
  const [rate, setRate] = useState(0);

  const set = (patch: Partial<LeaseInput>) => setV((x) => ({ ...x, ...patch }));
  const r = useMemo(() => computeLease(v), [v]);
  const ready = v.price > 0 && v.msrp > 0 && v.residualPct > 0 && v.moneyFactor > 0;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        // Start from the price and tax already entered, so the buyer does not type them twice.
        if (o) setV(blank(offer.price, offer.taxRate));
        else {
          setRate(0);
          setFactorKey((k) => k + 1);
        }
        setOpen(o);
      }}
    >
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay" />
        <Dialog.Content className="qf" aria-describedby={undefined}>
          <div className="sheet-head">
            <Dialog.Title className="sheet-title">{t.title}</Dialog.Title>
            <Dialog.Close className="icon-btn" aria-label={t.close}>
              <CloseIcon size={20} />
            </Dialog.Close>
          </div>
          <p className="qf-fixed">{t.intro}</p>
          <div className="qf-body lease">
            <MoneyField label={t.price} prefix="$" value={v.price} onChange={(n) => set({ price: n })} hint={t.priceHint} />
            <MoneyField label={t.msrp} prefix="$" value={v.msrp} onChange={(n) => set({ msrp: n })} />
            <MoneyField label={t.residual} suffix="%" decimals={1} max={100} value={v.residualPct} onChange={(n) => set({ residualPct: n })} hint={t.residualHint} />
            <MoneyField
              key={`f${factorKey}`}
              label={t.factor}
              decimals={5}
              max={0.01}
              value={v.moneyFactor}
              onChange={(n) => {
                set({ moneyFactor: n });
                setRate(0);
              }}
              hint={t.factorHint}
            />
            <MoneyField
              label={t.rate}
              suffix="%"
              decimals={2}
              max={30}
              value={rate}
              onChange={(n) => {
                setRate(n);
                set({ moneyFactor: moneyFactorFromApr(n) });
                setFactorKey((k) => k + 1);
              }}
            />
            <MoneyField label={t.months} value={v.months} max={72} onChange={(n) => set({ months: Math.round(n) })} />
            <MoneyField label={t.down} prefix="$" value={v.down} onChange={(n) => set({ down: n })} />
            <MoneyField label={t.fees} prefix="$" value={v.fees} onChange={(n) => set({ fees: n })} hint={t.feesHint} />
            <MoneyField label={t.tax} suffix="%" decimals={2} max={20} value={v.taxRate * 100} onChange={(n) => set({ taxRate: n / 100 })} hint={t.taxHint} />
            <MoneyField label={t.allowed} value={v.milesAllowed} max={50000} onChange={(n) => set({ milesAllowed: n })} />
            <MoneyField label={t.expected} value={v.milesExpected} max={100000} onChange={(n) => set({ milesExpected: n })} />
            <MoneyField label={t.overage} prefix="$" decimals={2} max={5} value={v.overageRate} onChange={(n) => set({ overageRate: n })} hint={t.overageHint} />
          </div>

          <div className="lease-bar" aria-live="polite">
            {!ready ? (
              <p className="hint">{t.empty}</p>
            ) : r.invalid ? (
              <p className="qf-note">{t.invalid}</p>
            ) : (
              <dl className="facts">
                <div>
                  <dt>{t.monthly}</dt>
                  <dd className="num">{formatCents(r.monthlyCents)}</dd>
                </div>
                <div>
                  <dt>{t.signing}</dt>
                  <dd className="num">{formatCents(r.driveOffCents)}</dd>
                </div>
                <div>
                  <dt>{t.total}</dt>
                  <dd className="num">{formatCents(r.totalCents)}</dd>
                </div>
              </dl>
            )}
          </div>
          {ready && !r.invalid && (
            <div className="lease-out">
              <p className="line">
                <Nums text={t.perMonth(formatCents(r.perMonthCents))} />
              </p>
              <p className="line">
                <Nums text={t.impliedRate(String(r.impliedApr))} /> <span className="hint">{t.impliedHint}</span>
              </p>
              {r.overageCents > 0 && (
                <p className="note-flag">
                  <Nums text={t.miles(r.overMiles.toLocaleString("en-US"), formatWhole(r.overageCents / 100))} />
                </p>
              )}
              {v.down > 0 && <p className="hint">{t.downNote}</p>}
              <p className="hint">{t.stateNote}</p>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
