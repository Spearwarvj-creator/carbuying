"use client";

import { Dialog } from "radix-ui";
import { useState, type ReactNode } from "react";
import { Nums } from "@/components/Nums";
import { Btn } from "@/components/ui/Btn";
import { CloseIcon } from "@/components/ui/icons";
import { more } from "@/data/strings/more";
import { budgetFromIncome, formatWhole } from "@/engine";
import { MoneyField } from "./MoneyField";

const t = more.budget;

/**
 * For a buyer who has no quote and no payment in mind: from monthly income, how much room a common rule of thumb leaves
 * for a payment after insurance and fuel. It hands the figure to the payment box. It is a starting point, not advice.
 */
export function BudgetHelper({ trigger, onUse }: { trigger: ReactNode; onUse: (payment: number) => void }) {
  const [open, setOpen] = useState(false);
  const [income, setIncome] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [fuel, setFuel] = useState(0);
  const b = budgetFromIncome(income, insurance, fuel);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
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
          <div className="qf-body">
            <MoneyField label={t.income} prefix="$" value={income} onChange={setIncome} autoFocus />
            <MoneyField
              label={
                <>
                  {t.insurance} <span className="opt">({t.optional})</span>
                </>
              }
              prefix="$"
              value={insurance}
              onChange={setInsurance}
            />
            <MoneyField
              label={
                <>
                  {t.fuel} <span className="opt">({t.optional})</span>
                </>
              }
              prefix="$"
              value={fuel}
              onChange={setFuel}
            />
          </div>
          <div className="lease-out" aria-live="polite">
            {income > 0 ? (
              <>
                <p className="line">
                  <Nums text={t.result(formatWhole(b.carCostsCap), formatWhole(b.paymentRoom))} />
                </p>
                <Btn
                  variant="primary"
                  arrow
                  aria-disabled={b.paymentRoom <= 0}
                  onClick={() => {
                    if (b.paymentRoom <= 0) return;
                    onUse(b.paymentRoom);
                    setOpen(false);
                  }}
                >
                  {t.use(formatWhole(b.paymentRoom))}
                </Btn>
              </>
            ) : (
              <p className="hint">{t.none}</p>
            )}
            <p className="hint">{t.note}</p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
