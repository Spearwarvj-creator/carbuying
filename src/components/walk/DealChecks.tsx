"use client";

import { Btn } from "@/components/ui/Btn";
import { ai } from "@/data/strings/ai";
import { dealFlags, type Offer } from "@/engine";
import { dealSummary } from "@/lib/summary";
import { AskSheet } from "./AskSheet";
import { ReadAloud } from "./ReadAloud";

const c = ai.checks;

/**
 * The checks on a deal. Each is a fixed rule with the calculator's numbers and a question to ask (see
 * engine/flags.ts). The buyer can have any of them explained, in Spanish if they like, or read aloud.
 */
export function DealChecks({ offer, quotedPay = 0 }: { offer: Offer; quotedPay?: number }) {
  const flags = dealFlags({ offer, quotedPay });
  const sum = dealSummary(offer, quotedPay);
  if (offer.price <= 0) return null;
  const spoken = flags.length ? flags.map((f) => `${f.title}. ${f.body} ${c.ask} ${f.ask}`).join(" ") : c.none;
  return (
    <section className="checks" aria-labelledby="checks-h">
      <div className="checks-head">
        <h2 id="checks-h">{c.heading}</h2>
        <ReadAloud text={spoken} variant="quiet" />
      </div>
      {flags.length === 0 ? (
        <p className="hint">{c.none}</p>
      ) : (
        <ul className="checks-list">
          {flags.map((f) => (
            <li key={f.id} data-sev={f.severity}>
              <span className="checks-sev">{c.severity[f.severity]}</span>
              <b>{f.title}</b>
              <p>{f.body}</p>
              <p className="checks-ask">
                <span>{c.ask}</span> {f.ask}
              </p>
              <details>
                <summary>{c.sourceLabel}</summary>
                <p className="hint">{f.source}</p>
              </details>
              <AskSheet
                topic={`flag:${f.id}`}
                title={f.title}
                context={`${f.title}. ${f.body} ${c.ask} ${f.ask}`}
                figures={[...f.figures, ...sum.figures]}
                trigger={
                  <Btn variant="quiet" type="button">
                    {c.explain}
                  </Btn>
                }
              />
            </li>
          ))}
        </ul>
      )}
      <p className="hint">{c.aiNote}</p>
    </section>
  );
}
