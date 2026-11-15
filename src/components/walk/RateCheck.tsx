"use client";

import { useState } from "react";
import { Nums } from "@/components/Nums";
import { Segmented } from "@/components/ui/Segmented";
import { BAND_KEYS, RATE_REFERENCE, type CreditBand } from "@/data/rates";
import { more } from "@/data/strings/more";
import { bandAverage, rateStanding, type CarKind } from "@/lib/rates";

const r = more.rates;
const pct = (n: number) => `${n.toFixed(2).replace(/\.?0+$/, "")}%`;

const W = 320;
const X0 = 8;
const X1 = 312;
const MAX = 25;
const x = (rate: number) => X0 + (Math.min(Math.max(rate, 0), MAX) / MAX) * (X1 - X0);

/**
 * Is this rate typical? The buyer picks a credit range and sees their rate on a scale next to the published average for
 * that range. The averages are reference data (see data/rates.ts), not offers, and the card says where they come from.
 * It never says whether to take the loan; it shows where the rate sits and what to ask next.
 */
export function RateCheck({ apr }: { apr: number }) {
  const [kind, setKind] = useState<CarKind>("new");
  const [band, setBand] = useState<CreditBand | "unsure">("unsure");
  if (apr <= 0) return null;
  const chosen = band === "unsure" ? null : rateStanding(apr, band, kind);
  const name = band === "unsure" ? "" : r.bands[band].toLowerCase();
  const tone = chosen ? (chosen.standing === "above" ? "up" : chosen.standing === "below" ? "down" : "near") : "near";

  return (
    <section className="vz-block rate" aria-labelledby="rate-h">
      <h3 id="rate-h">{r.title}</h3>
      <p className="vz-hint">{r.intro}</p>
      <Segmented variant="chips" label={r.kindLabel} value={kind} onChange={setKind} options={(["new", "used"] as const).map((k) => ({ value: k, label: r.kinds[k] }))} />
      <Segmented
        variant="chips"
        label={r.creditLabel}
        value={band}
        onChange={setBand}
        options={[
          ...BAND_KEYS.map((k) => ({ value: k, label: r.bands[k] })),
          { value: "unsure" as const, label: r.notSure },
        ]}
      />
      <svg viewBox={`0 0 ${W} 84`} className="vz-svg" role="img" aria-label={chosen ? r.scaleAria(pct(apr), pct(chosen.average)) : r.scaleAriaNone(pct(apr))}>
        <line x1={X0} y1={46} x2={X1} y2={46} className="vz-axis" />
        {[0, 5, 10, 15, 20, 25].map((t) => (
          <g key={t}>
            <line x1={x(t)} y1={42} x2={x(t)} y2={50} className="vz-axis" />
            <text x={x(t)} y={68} textAnchor="middle" className="vz-t">
              {t}%
            </text>
          </g>
        ))}
        {BAND_KEYS.map((k) => (
          <circle key={k} cx={x(bandAverage(k, kind))} cy={46} r={band === k ? 7 : 4} className={band === k ? "rc-avg on" : "rc-avg"} />
        ))}
        {chosen && (
          <text x={Math.min(Math.max(x(chosen.average), 40), 280)} y={24} textAnchor="middle" className="vz-t">
            {r.average} {pct(chosen.average)}
          </text>
        )}
        <circle cx={x(apr)} cy={46} r={9} className={`rc-you ${tone}`} />
        <text x={Math.min(Math.max(x(apr), 36), 284)} y={chosen && Math.abs(x(apr) - x(chosen.average)) < 70 ? 10 : 24} textAnchor="middle" className="vz-t vz-half">
          {r.you} {pct(apr)}
        </text>
      </svg>
      {band !== "unsure" && <p className="vz-hint">{r.rangeNote(r.bands[band], RATE_REFERENCE.bands.find((x) => x.key === band)!.range)}</p>}
      {chosen ? (
        <p>
          <Nums text={`${r.line(r.kinds[kind].toLowerCase(), name, pct(chosen.average))} ${chosen.standing === "near" ? r.near : chosen.standing === "above" ? r.above(Math.abs(chosen.points).toFixed(1)) : r.below(Math.abs(chosen.points).toFixed(1))}`} />
        </p>
      ) : (
        <>
          <ul className="rc-list">
            {BAND_KEYS.map((k) => (
              <li key={k}>
                <span>{r.bands[k]}</span>
                <span className="num">{pct(bandAverage(k, kind))}</span>
              </li>
            ))}
          </ul>
          <p className="vz-hint">{r.notSureHint}</p>
        </>
      )}
      <p>{r.preapprove}</p>
      <p className="vz-hint">
        {r.source(RATE_REFERENCE.asOf, RATE_REFERENCE.model)}{" "}
        <a href={RATE_REFERENCE.url} target="_blank" rel="noopener noreferrer">
          {r.sourceLink}
        </a>
      </p>
    </section>
  );
}
