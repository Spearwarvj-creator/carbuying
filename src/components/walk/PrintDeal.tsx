"use client";

import { createPortal } from "react-dom";
import { useSyncExternalStore } from "react";
import { Btn } from "@/components/ui/Btn";
import { ai } from "@/data/strings/ai";
import { computeDeal, dealFlags, formatCents, type Offer } from "@/engine";
import { offerName, useDeal } from "@/store/deal";
import { more } from "@/data/strings/more";
import { beforeItems } from "./BeforeYouSign";

const p = ai.print;
const useMounted = () => useSyncExternalStore(() => () => {}, () => true, () => false);

const rows = (o: Offer, d: ReturnType<typeof computeDeal>): [string, string][] => [
  [p.rows.price, formatCents(Math.round(o.price * 100))],
  [p.rows.tax, `${(o.taxRate * 100).toFixed(2).replace(/\.?0+$/, "")}% (${formatCents(d.taxCents)})`],
  [p.rows.fees, formatCents(Math.round(o.fees * 100))],
  [p.rows.extras, formatCents(Math.round(o.addons * 100))],
  [p.rows.otd, formatCents(d.otdCents)],
  [p.rows.down, formatCents(Math.round(o.down * 100))],
  [p.rows.rebate, formatCents(Math.round(o.rebate * 100))],
  [p.rows.trade, `${formatCents(Math.round(o.tradeAllowance * 100))} / ${formatCents(Math.round(o.tradePayoff * 100))}`],
  [p.rows.financed, formatCents(d.finCents)],
  [p.rows.rateLabel, p.rows.rateLength(o.apr, o.months)],
  [p.rows.pay, formatCents(d.payCents)],
  [p.rows.interest, formatCents(d.interestCents)],
  [p.rows.total, formatCents(d.totalCents)],
];

/**
 * A one-page sheet for the showroom: the car, the numbers for one or two offers, the checks with the question to ask,
 * and the reminder that these are estimates. It is built on the page but shown only when printing (or saving as a
 * PDF), and it is the only thing printed. Everything on it comes from the calculator and the fixed rules.
 */
export function PrintDeal({ quotedPay = 0 }: { quotedPay?: number }) {
  const ready = useMounted();
  const offers = useDeal((s) => s.offers);
  const editing = useDeal((s) => s.editing);
  const vehicle = useDeal((s) => s.vehicle);
  const names = useDeal((s) => s.names);
  if (!ready) return null;

  const two = JSON.stringify(offers[0]) !== JSON.stringify(offers[1]) && offers[1].price > 0;
  const list = two ? [offers[0], offers[1]] : [offers[editing === 1 && !two ? 0 : editing]];
  const deals = list.map((o) => ({ o, d: computeDeal(o) }));
  const flags = dealFlags({ offer: list[list.length - 1], quotedPay });
  const date = new Date().toLocaleDateString(p.locale, { year: "numeric", month: "long", day: "numeric" });

  return (
    <>
      <Btn variant="ghost" onClick={() => window.print()}>
        {p.button}
      </Btn>
      {createPortal(
        <div className="print-root">
          <h1>{p.title}</h1>
          <p>
            {date}
            {vehicle ? ` · ${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ""}` : ""}
          </p>
          <table>
            <thead>
              <tr>
                <th />
                {deals.map((_, i) => (
                  <th key={i}>{deals.length > 1 ? offerName(names, i as 0 | 1) : p.yourDeal}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows(deals[0].o, deals[0].d).map(([label], r) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {deals.map((x, i) => (
                    <td key={i}>{rows(x.o, x.d)[r][1]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {quotedPay > 0 && <p>{p.quoted(formatCents(Math.round(quotedPay * 100)))}</p>}
          {flags.length > 0 && (
            <>
              <h2>{p.questions}</h2>
              <ol>
                {flags.map((f) => (
                  <li key={f.id}>
                    <b>{f.title}.</b> {f.ask}
                  </li>
                ))}
              </ol>
            </>
          )}
          <h2>{more.before.title}</h2>
          <ul className="print-list">
            {beforeItems(deals[deals.length - 1].o).map((text) => (
              <li key={text}>☐ {text}</li>
            ))}
          </ul>
          <p className="print-note">{p.note}</p>
        </div>,
        document.body,
      )}
    </>
  );
}
