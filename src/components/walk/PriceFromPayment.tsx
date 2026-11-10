"use client";

import { Btn } from "@/components/ui/Btn";
import { ai } from "@/data/strings/ai";
import { formatWhole, priceFromPayment } from "@/engine";

const a = ai.afford;
const RATES = [5, 7, 9, 12] as const;

/**
 * For a buyer who was only given a monthly payment: what price that payment buys at a few common rates, so the
 * Walk does not stop at "enter the price". Straight from the calculator (priceFromPayment), no AI. It counts the
 * tax rate and fees already entered and assumes no extras or trade-in, and it says so.
 */
export function PriceFromPayment({ pay, months, down, taxRate, fees, onPick }: { pay: number; months: number; down: number; taxRate: number; fees: number; onPick: (price: number) => void }) {
  if (pay <= 0) return null;
  return (
    <section className="afford" aria-labelledby="afford-h">
      <h2 id="afford-h">{a.title}</h2>
      <p>{a.body(formatWhole(pay), months)} {a.tap}</p>
      <ul>
        {RATES.map((rate) => {
          const price = Math.round(priceFromPayment({ pay, apr: rate, months, down, taxRate, fees }) / 100) * 100;
          return (
            <li key={rate}>
              <Btn variant="ghost" onClick={() => onPick(price)} aria-label={a.pick(formatWhole(price), rate)}>
                {a.row(rate, formatWhole(price))}
              </Btn>
            </li>
          );
        })}
      </ul>
      <p className="hint">{a.note}</p>
    </section>
  );
}
