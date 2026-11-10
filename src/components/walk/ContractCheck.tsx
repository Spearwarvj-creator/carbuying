"use client";

import { ai } from "@/data/strings/ai";
import { computeDeal, type Offer } from "@/engine";
import type { Detected, FillKey } from "@/lib/extract/fields";

const c = ai.contract;
const money = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

interface Row {
  key: FillKey;
  label: string;
  agreed: number;
  /** How far apart two figures can be and still match: contracts round, and some fees are summed. */
  tolerance: number;
  unit: "$" | "%" | "mo";
}

export type ContractRow = { key: FillKey; label: string; agreed: number; paper: number | null; status: "match" | "differ" | "missing"; unit: Row["unit"] };

/**
 * Compares what was read on a contract with the deal the buyer agreed, line by line. The agreed figures come
 * from the calculator; the contract figures come from the photo reader. It reports matches and differences only:
 * it never says a contract is safe, because a line it could not read may be the one that matters.
 */
export function compareContract(found: Detected, offer: Offer): ContractRow[] {
  const d = computeDeal(offer);
  const rows: Row[] = [
    { key: "price", label: c.rows.price, agreed: offer.price, tolerance: 1, unit: "$" },
    { key: "fees", label: c.rows.fees, agreed: offer.fees, tolerance: 1, unit: "$" },
    { key: "addons", label: c.rows.addons, agreed: offer.addons, tolerance: 1, unit: "$" },
    { key: "down", label: c.rows.down, agreed: offer.down, tolerance: 1, unit: "$" },
    { key: "amountFinanced", label: c.rows.amountFinanced, agreed: d.fin, tolerance: 2, unit: "$" },
    { key: "apr", label: c.rows.apr, agreed: offer.apr, tolerance: 0.05, unit: "%" },
    { key: "months", label: c.rows.months, agreed: offer.months, tolerance: 0, unit: "mo" },
    { key: "monthlyPayment", label: c.rows.monthlyPayment, agreed: d.pay, tolerance: 1, unit: "$" },
    { key: "totalOfPayments", label: c.rows.totalOfPayments, agreed: d.pay * offer.months, tolerance: Math.max(5, offer.months), unit: "$" },
  ];
  return rows.map((r) => {
    const paper = found[r.key]?.value ?? null;
    const status = paper === null ? "missing" : Math.abs(paper - r.agreed) <= r.tolerance ? "match" : "differ";
    return { key: r.key, label: r.label, agreed: r.agreed, paper, status, unit: r.unit };
  });
}

const show = (n: number, unit: Row["unit"]) => (unit === "$" ? money(n) : unit === "%" ? `${n}%` : c.monthsUnit(n));

export function ContractCheck({ found, offer }: { found: Detected; offer: Offer }) {
  if (offer.price <= 0) return <p className="qf-note">{c.needDeal}</p>;
  const rows = compareContract(found, offer);
  return (
    <div className="qf-body">
      <p className="hint">{c.intro}</p>
      <table className="qf-compare">
        <caption className="sr-only">{c.title}</caption>
        <thead>
          <tr>
            <th scope="col" />
            <th scope="col">{c.agreed}</th>
            <th scope="col">{c.onPaper}</th>
            <th scope="col" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} data-status={r.status}>
              <th scope="row">{r.label}</th>
              <td className="num">{show(r.agreed, r.unit)}</td>
              <td className="num">{r.paper === null ? "—" : show(r.paper, r.unit)}</td>
              <td>
                <span className="qf-pill">{r.status === "match" ? c.match : r.status === "differ" ? c.differ : c.missing}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.some((r) => r.status === "differ") && <p className="qf-note">{c.ask}</p>}
      <p className="hint">{c.note}</p>
    </div>
  );
}
