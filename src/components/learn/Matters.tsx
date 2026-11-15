"use client";

import { Nums } from "@/components/Nums";
import { SparkIcon } from "@/components/ui/icons";
import { more } from "@/data/strings/more";
import { formatWhole, type Offer } from "@/engine";
import { everyday, spotlight, type Matter } from "@/lib/learn/spotlight";
import { Gloss } from "./Gloss";

const m = more.matters;

/** The sentence for the thing that matters most, from the calculator's figures. Words only; the rule that picked it is in spotlight(). */
export function matterText(x: Matter): string {
  const money = formatWhole(x.dollars);
  switch (x.key) {
    case "trade":
      return m.trade(money);
    case "extras":
      return m.extras(money, x.other);
    case "length":
      return m.length(money, x.other, x.dollars > 0);
    case "rate":
      return m.rate(money, x.other);
    case "fees":
      return m.fees(money);
    default:
      return m.price(x.other);
  }
}

/**
 * "What matters most here": one thing in the deal, picked by fixed rules, said in one sentence, with a tap to learn the
 * word. It points the buyer at one thing instead of five. It never says whether to take the deal.
 */
export function Matters({ offer }: { offer: Offer }) {
  const x = spotlight(offer);
  if (!x) return null;
  return (
    <aside className="matters" aria-labelledby="matters-h">
      <span className="matters-ico" aria-hidden="true">
        <SparkIcon size={22} />
      </span>
      <div>
        <h2 id="matters-h">{m.title}</h2>
        <p>
          <Nums text={matterText(x)} />
        </p>
        <p className="matters-why">
          <Gloss id={x.gloss}>{m.why}</Gloss>
        </p>
      </div>
    </aside>
  );
}

/** The payment in everyday terms: what it costs each day, and what the interest alone is worth in payments. */
export function Everyday({ offer }: { offer: Offer }) {
  const e = everyday(offer);
  if (!e) return null;
  const t = more.everyday;
  return (
    <ul className="everyday">
      <li>
        <Nums text={t.perDay(formatWhole(e.perDay), e.payments)} />
      </li>
      {e.interestPayments >= 0.5 && (
        <li>
          <Nums text={t.interestPays(e.interestPayments)} />
        </li>
      )}
    </ul>
  );
}
