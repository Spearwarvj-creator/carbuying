"use client";

import { Btn } from "@/components/ui/Btn";
import { ai } from "@/data/strings/ai";
import { aprFromPayment, formatWhole } from "@/engine";

const r = ai.implied;

/**
 * When the buyer has a quoted payment and the price, the payment itself carries a rate. Showing it lets them see
 * a rate hidden in a monthly figure, and compare it with any rate the dealer said. Pure calculator, no AI.
 */
export function ImpliedRate({ financed, pay, months, onUse }: { financed: number; pay: number; months: number; onUse: (apr: number) => void }) {
  const apr = aprFromPayment(financed, pay, months);
  if (apr === null) return null;
  return (
    <section className="afford" aria-labelledby="implied-h">
      <h2 id="implied-h">{r.title}</h2>
      <p>{r.body(formatWhole(pay), months, formatWhole(financed), apr)}</p>
      <Btn variant="ghost" onClick={() => onUse(apr)}>
        {r.use(apr)}
      </Btn>
      <p className="hint">{r.note}</p>
    </section>
  );
}
