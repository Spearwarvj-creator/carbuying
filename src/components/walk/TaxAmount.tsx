"use client";

import { useState } from "react";
import { more } from "@/data/strings/more";
import { taxRateFromAmount, type Offer } from "@/engine";
import { MoneyField } from "./MoneyField";

const t = more.taxAmount;

/**
 * The tax as dollars from the worksheet, for a buyer who reads the line and does not know the rate. The rate that
 * gives exactly those dollars goes into the rate box, so the tax shown matches the paper.
 */
export function TaxAmount({ offer, onRate }: { offer: Offer; onRate: (fraction: number) => void }) {
  const [dollars, setDollars] = useState(0);
  const rate = dollars > 0 ? taxRateFromAmount(offer, dollars) : null;
  const note = dollars <= 0 ? "" : offer.price <= 0 ? t.need : rate === null ? t.tooBig : t.result((rate * 100).toFixed(3).replace(/\.?0+$/, ""));
  return (
    <MoneyField
      label={t.label}
      prefix="$"
      decimals={2}
      value={dollars}
      onChange={(n) => {
        setDollars(n);
        const r = n > 0 ? taxRateFromAmount(offer, n) : null;
        if (r !== null) onRate(r);
      }}
      hint={note || t.hint}
    />
  );
}
