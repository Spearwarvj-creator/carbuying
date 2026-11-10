"use client";

import { Nums } from "@/components/Nums";
import { more } from "@/data/strings/more";
import { cashCompare, formatCents, type Offer } from "@/engine";

const t = more.cash;

/** What the same car would need in cash, and what the loan adds on top. Straight from the calculator. */
export function CashCompare({ offer }: { offer: Offer }) {
  if (offer.price <= 0) return null;
  const c = cashCompare(offer);
  return (
    <section className="met" aria-labelledby="cash-h">
      <h2 id="cash-h">{t.title}</h2>
      {c.extraForLoanCents > 0 ? (
        <>
          <p>
            <Nums text={t.line(formatCents(c.cashCents), formatCents(c.extraForLoanCents))} />
          </p>
          <p className="hint">{t.ask}</p>
        </>
      ) : (
        <p>{t.noLoan}</p>
      )}
      <p className="hint">{t.note}</p>
    </section>
  );
}
