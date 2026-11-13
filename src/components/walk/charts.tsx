"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Segmented } from "@/components/ui/Segmented";
import { useAnalysis } from "@/components/analysis";
import { useMediaQuery } from "@/components/use-media-query";
import { useOfferNames } from "@/store/deal";
import { Nums } from "@/components/Nums";
import { more } from "@/data/strings/more";
import { walk } from "@/data/strings/walk";
import { DEPRECIATION_KEYS, computeDeal, costBreakdown, formatCents, formatWhole, loanSchedule, paymentSplit, termComparison, underwater, type DepreciationKey, type Offer, type SchedulePoint } from "@/engine";

const v = more.visuals;
const whole = (cents: number) => formatWhole(cents / 100);

const PART_ORDER = ["car", "fees", "extras", "rolled", "interest"] as const;
type PartKey = (typeof PART_ORDER)[number];
/** Read when drawn, not when loaded, so the words follow the language the buyer picked. */
const partLabel = (k: PartKey): string => {
  const P = walk.stage6.parts;
  return { car: P.car, fees: P.taxFees, extras: P.extras, rolled: P.rolled, interest: P.interest }[k];
};

function partsOf(o: Offer): { key: PartKey; cents: number }[] {
  const b = costBreakdown(o);
  return [
    { key: "car", cents: b.carCents },
    { key: "fees", cents: b.taxFeesCents },
    { key: "extras", cents: b.extrasCents },
    { key: "rolled", cents: b.rolledInCents },
    { key: "interest", cents: b.interestCents },
  ];
}

/**
 * Offers on one scale. Each bar is one offer's total paid, cut into the car, tax and fees, extras, an old loan rolled in
 * and interest. Both bars share one scale, so the longer one costs more at a glance. When the totals differ, the longer
 * bar is hatched over the part that is more than the other offer, with the difference written on it.
 */
export function OfferBars({ offers, names, intro, caption = true, compact = false }: { offers: Offer[]; names: string[]; intro?: string; caption?: boolean; compact?: boolean }) {
  const reduce = useReducedMotion();
  const rows = offers.map((o, i) => ({ name: names[i], parts: partsOf(o), total: costBreakdown(o).totalCents }));
  const max = Math.max(...rows.map((r) => r.total), 1);
  const min = Math.min(...rows.map((r) => r.total));
  const diff = max - min;
  const longer = rows.length === 2 && diff > 0 ? rows.findIndex((r) => r.total === max) : -1;
  const used = PART_ORDER.filter((k) => rows.some((r) => r.parts.find((p) => p.key === k)!.cents > 0));
  return (
    <figure className={`vz-offers${compact ? " vz-compact" : ""}`}>
      {!compact && <p className="vz-hint">{intro ?? (rows.length > 1 ? v.money.hint : v.money.one)}</p>}
      {rows.map((r, i) => (
        <div key={i} className="vz-orow" role="img" aria-label={`${v.money.aria(r.name, whole(r.total))} ${r.parts.filter((p) => p.cents > 0).map((p) => `${partLabel(p.key)} ${whole(p.cents)}`).join(", ")}.`}>
          <div className="vz-ohead">
            <span className="vz-oname">{r.name}</span>
            <span className="vz-oright">
              {longer === i && (
                <span className="vz-plus num">
                  <span className="vz-hatch" aria-hidden="true" />+{whole(diff)} {v.money.extra}
                </span>
              )}
              <span className="vz-ototal num">{whole(r.total)}</span>
            </span>
          </div>
          <div className="vz-track">
            <div className="vz-bar mbar-row" style={{ width: `${(r.total / max) * 100}%` }}>
              {r.parts
                .filter((p) => p.cents > 0)
                .map((p, k) => (
                  <motion.span
                    key={p.key}
                    className={`mseg ${p.key}`}
                    initial={reduce ? false : { flexGrow: 0.0001, opacity: 0 }}
                    animate={{ flexGrow: p.cents, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 160, damping: 24, delay: k * 0.06 }}
                  />
                ))}
            </div>
            {longer === i && (
              <span className="vz-extra" style={{ left: `${(min / max) * 100}%`, width: `${(diff / max) * 100}%` }} aria-hidden="true" />
            )}
          </div>
        </div>
      ))}
      {!compact && <ul className="mbar-key">
        {used.map((k) => (
          <li key={k}>
            <span className={`sw ${k}`} aria-hidden="true" />
            <span className="k">{partLabel(k)}</span>
          </li>
        ))}
      </ul>}
      {rows.length === 2 && caption && !compact && (
        <figcaption>
          <Nums text={diff > 0 ? v.money.moreBy(rows[longer].name, whole(diff)) : v.money.same} />
        </figcaption>
      )}
    </figure>
  );
}

const W = 320;
const H = 176;
const X0 = 8;
const X1 = 312;
const Y0 = 22;
const Y1 = 136;

export interface BalanceSeries {
  id: string;
  name: string;
  points: SchedulePoint[];
}

/** The balance of one loan as a series for the chart. Empty when nothing is borrowed. */
export const balanceSeries = (id: string, name: string, financed: number, apr: number, months: number): BalanceSeries => ({
  id,
  name,
  points: loanSchedule(financed, apr, months),
});

/**
 * What you still owe, month by month. One loan shows the falling balance, with a dot at the halfway point and how much
 * is still owed there. Two loans are drawn on the same scale, so the longer or higher-rate loan is seen falling slower.
 * Every figure comes from loanSchedule(), which agrees with the deal's own interest to the cent.
 */
export function BalanceChart({ series }: { series: BalanceSeries[] }) {
  const reduce = useReducedMotion();
  const live = series.filter((s) => s.points.length > 1);
  if (live.length === 0) return null;
  const maxMonths = Math.max(...live.map((s) => s.points.length - 1));
  const maxBal = Math.max(...live.map((s) => s.points[0].balanceCents), 1);
  const x = (m: number) => X0 + (m / maxMonths) * (X1 - X0);
  const y = (c: number) => Y1 - (c / maxBal) * (Y1 - Y0);
  const line = (pts: SchedulePoint[]) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.month).toFixed(1)} ${y(p.balanceCents).toFixed(1)}`).join(" ");
  const first = live[0];
  const n = first.points.length - 1;
  const halfM = Math.round(n / 2);
  const halfPct = Math.round((first.points[halfM].balanceCents / first.points[0].balanceCents) * 100);
  const single = live.length === 1;
  const tones = ["a", "b"];
  const aria = single
    ? v.over.aria(whole(first.points[0].balanceCents), n, halfPct)
    : v.over.ariaTwo(live[0].name, live[0].points.length - 1, live[1].name, live[1].points.length - 1);

  return (
    <figure className="vz-over">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={aria} className="vz-svg">
        <line x1={X0} y1={Y1} x2={X1} y2={Y1} className="vz-axis" />
        {live.map((s, i) => {
          const d = line(s.points);
          return (
            <g key={s.id} className={`vz-line ${tones[i] ?? "b"}`}>
              {single && <path d={`${d} L${x(s.points.length - 1)} ${Y1} L${x(0)} ${Y1} Z`} className="vz-area" />}
              <motion.path
                d={d}
                pathLength={1}
                className="vz-stroke"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1], delay: i * 0.15 }}
              />
            </g>
          );
        })}
        <text x={X0} y={13} className="vz-t num">
          {whole(first.points[0].balanceCents)}
        </text>
        <text x={X0} y={H - 8} className="vz-t">
          {v.over.today}
        </text>
        {live.map((s, i) => {
          const m = s.points.length - 1;
          return (
            <text key={s.id} x={Math.min(x(m), X1)} y={H - 8 - (single ? 0 : i * 16)} textAnchor="end" className={`vz-t vz-end ${tones[i] ?? "b"}`}>
              {single ? v.over.month(m) : `${s.name}: ${v.over.month(m)}`}
            </text>
          );
        })}
        {single && (
          <g>
            <line x1={x(halfM)} y1={y(first.points[halfM].balanceCents)} x2={x(halfM)} y2={Y1} className="vz-drop" />
            <circle cx={x(halfM)} cy={y(first.points[halfM].balanceCents)} r={5} className="vz-dot" />
            <text x={x(halfM) + 10} y={y(first.points[halfM].balanceCents) - 8} className="vz-t vz-half">
              {v.over.halfShort(halfPct)}
            </text>
          </g>
        )}
      </svg>
      <figcaption>
        {single ? <Nums text={v.over.half(halfPct)} /> : <Nums text={v.over.longer(first.points.length > live[1].points.length ? live[0].name : live[1].name, Math.abs(first.points.length - live[1].points.length))} />}
      </figcaption>
    </figure>
  );
}

/**
 * The first and the last payment, each cut into interest and loan. It shows that early payments are mostly interest and
 * late ones almost none, which is why paying a loan off early saves so much.
 */
export function SplitBars({ financed, apr, months, pay }: { financed: number; apr: number; months: number; pay: number }) {
  const first = paymentSplit(financed, apr, months, 1);
  const last = paymentSplit(financed, apr, months, months);
  if (first.interestCents + first.principalCents === 0 || apr <= 0) return null;
  const rows = [
    { label: v.split.first, s: first },
    { label: v.split.last, s: last },
  ];
  return (
    <figure className="vz-split">
      {rows.map((r) => {
        const total = r.s.interestCents + r.s.principalCents || 1;
        return (
          <div key={r.label} className="vz-srow" role="img" aria-label={v.split.aria(r.label, formatCents(r.s.interestCents), formatCents(r.s.principalCents))}>
            <span className="vz-slabel">{r.label}</span>
            <div className="mbar-row vz-sbar">
              <span className="mseg interest" style={{ flexGrow: r.s.interestCents / total }} />
              <span className="mseg car" style={{ flexGrow: r.s.principalCents / total }} />
            </div>
            <span className="vz-sval num">{formatCents(r.s.interestCents)}</span>
          </div>
        );
      })}
      <ul className="mbar-key">
        <li>
          <span className="sw interest" aria-hidden="true" />
          <span className="k">{v.split.interest}</span>
        </li>
        <li>
          <span className="sw car" aria-hidden="true" />
          <span className="k">{v.split.loan}</span>
        </li>
      </ul>
      <figcaption>
        <Nums text={v.split.firstNote(formatCents(first.interestCents), formatCents(pay > 0 ? Math.round(pay * 100) : first.interestCents + first.principalCents))} />
      </figcaption>
    </figure>
  );
}

/** The pay-off picture for one deal: the balance falling over time, and what the first and last payment pay for. */
export function LoanPicture({ offer }: { offer: Offer }) {
  const d = computeDeal(offer);
  if (d.fin <= 0 || offer.months <= 0) return null;
  return (
    <section className="vz-block" aria-labelledby="vz-over-h">
      <h3 id="vz-over-h">{v.over.title}</h3>
      <BalanceChart series={[balanceSeries("a", "", d.fin, offer.apr, offer.months)]} />
      {offer.apr > 0 && (
        <>
          <h3>{v.split.title}</h3>
          <SplitBars financed={d.fin} apr={offer.apr} months={offer.months} pay={d.pay} />
        </>
      )}
      <h3>{v.value.title}</h3>
      <ValueChart offer={offer} />
    </section>
  );
}

/** Two deals' balances on one chart, so a longer or dearer loan is seen falling more slowly. */
export function LoanCompare({ offers, names }: { offers: [Offer, Offer]; names: [string, string] }) {
  const ds = offers.map((o) => computeDeal(o));
  if (ds.some((d) => d.fin <= 0)) return null;
  return (
    <section className="vz-block" aria-labelledby="vz-cmp-h">
      <h3 id="vz-cmp-h">{v.over.title}</h3>
      <BalanceChart series={offers.map((o, i) => balanceSeries(String(i), names[i], ds[i].fin, o.apr, o.months))} />
    </section>
  );
}

/** On a wide Desk, the offers' bars sit under the total, so the picture is there without a tap. Narrow screens show it in Compare. */
export function DeskBars() {
  const { d1, d2 } = useAnalysis();
  const names = useOfferNames();
  const wide = useMediaQuery("(min-width: 900px)");
  const shown = [d1, d2].map((d, i) => ({ o: d.offer, name: names[i] })).filter((x) => x.o.price > 0);
  if (shown.length === 0) return null;
  // A phone's Deal tab keeps to one screen, so it gets a slim version without the key. Compare has the full one.
  return <OfferBars offers={shown.map((x) => x.o)} names={shown.map((x) => x.name)} caption={false} compact={!wide} />;
}

/**
 * The same loan at other lengths, on one scale: a bar for the payment and a bar for the interest. The payment bars shrink
 * and the interest bars grow as the months go up. The buyer's own length is marked.
 */
export function TermChart({ offer }: { offer: Offer }) {
  const d = computeDeal(offer);
  const rows = termComparison(d.fin, offer.apr, offer.down, offer.months);
  if (rows.length === 0 || offer.apr <= 0) return null;
  const t = v.terms;
  const maxPay = Math.max(...rows.map((r) => r.payCents), 1);
  const maxInt = Math.max(...rows.map((r) => r.interestCents), 1);
  return (
    <figure className="vz-terms">
      <p className="vz-hint">{t.hint}</p>
      <div className="vz-thead" aria-hidden="true">
        <span />
        <span>{t.pay}</span>
        <span>{t.interest}</span>
      </div>
      {rows.map((r) => (
        <div key={r.months} className="vz-trow" data-here={r.months === offer.months} role="img" aria-label={t.aria(r.months, formatCents(r.payCents), whole(r.interestCents))}>
          <span className="vz-tlabel">
            {r.months}
            <small>{r.months === offer.months ? t.here : ""}</small>
          </span>
          <span className="vz-tcell">
            <span className="vz-ttrack"><span className="vz-tbar pay" style={{ width: `${(r.payCents / maxPay) * 100}%` }} /></span>
            <span className="num">{whole(r.payCents)}</span>
          </span>
          <span className="vz-tcell">
            <span className="vz-ttrack"><span className="vz-tbar int" style={{ width: `${(r.interestCents / maxInt) * 100}%` }} /></span>
            <span className="num">{whole(r.interestCents)}</span>
          </span>
        </div>
      ))}
      <figcaption>{t.note}</figcaption>
    </figure>
  );
}

/**
 * Trade-in against what is still owed on it, on one scale. When more is owed than the car is worth, the owed bar is
 * hatched over the part that is more, and the amount is named. That amount is added to the new loan.
 */
export function EquityBars({ allowance, payoff }: { allowance: number; payoff: number }) {
  const q = v.equity;
  const max = Math.max(allowance, payoff, 1);
  const diff = Math.abs(allowance - payoff);
  const short = payoff > allowance;
  const rows = [
    { label: q.worth, value: allowance, cls: "car" },
    { label: q.owe, value: payoff, cls: "rolled" },
  ];
  return (
    <figure className="vz-offers" role="img" aria-label={q.aria(formatWhole(allowance), formatWhole(payoff))}>
      {rows.map((r, i) => (
        <div key={r.cls} className="vz-orow">
          <div className="vz-ohead">
            <span className="vz-oname">{r.label}</span>
            <span className="vz-oright">
              {diff > 0 && ((short && i === 1) || (!short && i === 0)) && (
                <span className={`vz-plus num${short ? "" : " good"}`}>
                  <span className="vz-hatch" aria-hidden="true" />
                  {short ? q.short(formatWhole(diff)) : q.toward(formatWhole(diff))}
                </span>
              )}
              <span className="vz-ototal num">{formatWhole(r.value)}</span>
            </span>
          </div>
          <div className="vz-track">
            <div className="vz-bar mbar-row" style={{ width: `${Math.max((r.value / max) * 100, r.value > 0 ? 2 : 0)}%` }}>
              <span className={`mseg ${r.cls}`} style={{ flexGrow: 1 }} />
            </div>
            {diff > 0 && ((short && i === 1) || (!short && i === 0)) && (
              <span className="vz-extra" style={{ left: `${((short ? allowance : payoff) / max) * 100}%`, width: `${(diff / max) * 100}%` }} aria-hidden="true" />
            )}
          </div>
        </div>
      ))}
    </figure>
  );
}

const W2 = 320;
const H2 = 170;

/**
 * What you owe against an estimate of what the car is worth. Where the balance is above the value, the gap is shaded.
 * The value is a labelled estimate with three speeds to choose from, never a figure from the dealer.
 */
export function ValueChart({ offer }: { offer: Offer }) {
  const [speed, setSpeed] = useState<DepreciationKey>("typical");
  const d = computeDeal(offer);
  if (d.fin <= 0 || offer.months <= 0 || offer.price <= 0) return null;
  const q = v.value;
  const u = underwater(offer.price, d.fin, offer.apr, offer.months, speed);
  const n = offer.months;
  const maxC = Math.max(...u.points.map((p) => Math.max(p.balanceCents, p.valueCents)), 1);
  const x = (m: number) => X0 + (m / n) * (X1 - X0);
  const y = (c: number) => Y1 - (c / maxC) * (Y1 - Y0);
  const path = (key: "balanceCents" | "valueCents") => u.points.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.month).toFixed(1)} ${y(p[key]).toFixed(1)}`).join(" ");
  // The shaded gap: for each run of months where the balance is above the value, top edge forward, bottom edge back.
  const runs: { month: number; balanceCents: number; valueCents: number }[][] = [];
  let cur: typeof runs[number] = [];
  for (const p of u.points) {
    if (p.balanceCents > p.valueCents) cur.push(p);
    else if (cur.length) {
      cur.push(p);
      runs.push(cur);
      cur = [];
    }
  }
  if (cur.length) runs.push(cur);
  const gapPath = runs
    .map((r) => `${r.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.month).toFixed(1)} ${y(p.balanceCents).toFixed(1)}`).join(" ")} ${[...r].reverse().map((p) => `L${x(p.month).toFixed(1)} ${y(p.valueCents).toFixed(1)}`).join(" ")} Z`)
    .join(" ");
  const gap = formatWhole(u.worstGapCents / 100);
  return (
    <figure className="vz-value">
      <Segmented
        variant="chips"
        label={q.speed}
        value={speed}
        onChange={setSpeed}
        options={DEPRECIATION_KEYS.map((k) => ({ value: k, label: q.speeds[k] }))}
      />
      <svg viewBox={`0 0 ${W2} ${H2}`} role="img" aria-label={q.aria(q.speeds[speed], u.monthsUnder, gap)} className="vz-svg">
        <line x1={X0} y1={Y1} x2={X1} y2={Y1} className="vz-axis" />
        {gapPath && <path d={gapPath} className="vz-gap" />}
        <path d={path("valueCents")} className="vz-stroke vz-valueline" />
        <path d={path("balanceCents")} className="vz-stroke vz-balline" />
        <text x={X0} y={13} className="vz-t num">
          {whole(maxC)}
        </text>
        <text x={X0} y={H2 - 8} className="vz-t">
          {v.over.today}
        </text>
        <text x={X1} y={H2 - 8} textAnchor="end" className="vz-t">
          {v.over.month(n)}
        </text>
      </svg>
      <ul className="mbar-key">
        <li>
          <span className="sw vz-sw-bal" aria-hidden="true" />
          <span className="k">{q.owe}</span>
        </li>
        <li>
          <span className="sw vz-sw-val" aria-hidden="true" />
          <span className="k">{q.worth}</span>
        </li>
        {u.monthsUnder > 0 && (
          <li>
            <span className="sw vz-sw-gap" aria-hidden="true" />
            <span className="k">{q.gap}</span>
          </li>
        )}
      </ul>
      <figcaption>
        <Nums text={u.monthsUnder > 0 ? `${q.under(u.monthsUnder, gap)}${u.clearsAt ? ` ${q.clears(u.clearsAt)}` : ""}` : q.never} />
      </figcaption>
      <p className="vz-hint">{q.est}</p>
      {u.monthsUnder > 0 && <p className="vz-hint">{q.why}</p>}
    </figure>
  );
}
