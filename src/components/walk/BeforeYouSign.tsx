"use client";

import { useState } from "react";
import { more } from "@/data/strings/more";
import { computeDeal, type Offer } from "@/engine";

const b = more.before;

/** The list for this deal: five things that apply to every deal, then the ones its own numbers call for. */
export function beforeItems(offer: Offer): string[] {
  const d = computeDeal(offer);
  return [
    ...b.always,
    ...(offer.addons > 0 ? [b.extras] : []),
    ...(d.equity < 0 ? [b.negative] : []),
    ...(offer.months >= 72 ? [b.long] : []),
  ];
}

/** A tick list of what to do before signing. The ticks are kept on the page only, for the length of the visit. */
export function BeforeYouSign({ offer }: { offer: Offer }) {
  const items = beforeItems(offer);
  const [done, setDone] = useState<Record<string, boolean>>({});
  return (
    <section className="met sign" aria-labelledby="sign-h">
      <h2 id="sign-h">{b.title}</h2>
      <p className="hint">{b.sub}</p>
      <ul className="sign-list">
        {items.map((text) => (
          <li key={text}>
            <label className="checkrow">
              <input type="checkbox" checked={Boolean(done[text])} onChange={(e) => setDone((s) => ({ ...s, [text]: e.target.checked }))} />
              <span>{text}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
