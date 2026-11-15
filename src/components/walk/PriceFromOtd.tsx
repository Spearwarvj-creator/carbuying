"use client";

import { useState } from "react";
import { Nums } from "@/components/Nums";
import { Btn } from "@/components/ui/Btn";
import { Disclosure } from "@/components/ui/Disclosure";
import { more } from "@/data/strings/more";
import { formatCents, priceFromOtd, type Offer } from "@/engine";
import { MoneyField } from "./MoneyField";

const t = more.otd;

/**
 * For a buyer who was only told the out-the-door total: the selling price that total works out to, with the tax rate and
 * fees already entered. It is the calculator's own tax rule run backward (priceFromOtd), so putting the price back in
 * gives the same total to the cent.
 */
export function PriceFromOtd({ offer, onUse }: { offer: Offer; onUse: (price: number) => void }) {
  const [otd, setOtd] = useState(0);
  const price = otd > 0 ? priceFromOtd(offer, otd) : 0;
  return (
    <Disclosure title={t.more} className="otdhelp">
      <MoneyField label={t.label} prefix="$" value={otd} onChange={setOtd} hint={t.hint} />
      {otd > 0 && offer.taxRate <= 0 && <p className="hint">{t.need}</p>}
      {otd > 0 && price <= 0 && <p className="hint">{t.none}</p>}
      {price > 0 && (
        <>
          <p>
            <Nums text={t.result(formatCents(Math.round(price * 100)))} />
          </p>
          <Btn variant="primary" onClick={() => onUse(price)}>
            {t.use}
          </Btn>
        </>
      )}
    </Disclosure>
  );
}
