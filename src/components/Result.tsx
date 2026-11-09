"use client";

import { en } from "@/data/strings/en";
import { formatCents, formatSignedCents, splitCents, type TrailKey, type TrailStep } from "@/engine";
import { useDeal } from "@/store/deal";
import { Arrow } from "./Arrow";
import { Nums } from "./Nums";
import { useAnalysis } from "./analysis";
import { useMediaQuery } from "./use-media-query";

const t = en.result;

export function Result() {
  const { ready, d2, trail } = useAnalysis();

  if (!ready || !trail) {
    return (
      <div className="result">
        <div className="lbl">{t.totalLabel}</div>
        <div className="total">
          <span className="dash num">$&mdash;</span>
        </div>
        <p className="hint">{t.empty}</p>
      </div>
    );
  }

  const big = splitCents(d2.totalCents);
  const payChange = trail.monthlyCents;
  const totalChange = trail.totalCents;

  return (
    <div className="result">
      <div className="lbl">{t.totalLabel}</div>
      <div className="total" aria-label={formatCents(d2.totalCents)}>
        <span className="big num" aria-hidden="true">
          {big.dollars}
        </span>
        <span className="cents num" aria-hidden="true">
          .{big.cents}
        </span>
      </div>
      <div className="deltas">
        <div className={`delta ${payChange < 0 ? "down" : payChange > 0 ? "up" : "flat"}`}>
          <div className="lbl">{t.monthly}</div>
          <span className="v num">{formatCents(d2.payCents)}</span>
          <div className="n">
            {payChange !== 0 && <Arrow dir={payChange < 0 ? "down" : "up"} />}
            <span>
              {payChange === 0 ? t.noChange : `${formatCents(Math.abs(payChange))} ${payChange < 0 ? t.less : t.more}`}
              <span className="tail">{payChange === 0 ? "" : t.aMonth}</span>
            </span>
          </div>
        </div>
        <div className={`delta ${totalChange > 0 ? "up" : totalChange < 0 ? "down" : "flat"}`}>
          <div className="lbl">{t.changeInTotal}</div>
          <span className="v num">{formatSignedCents(totalChange)}</span>
          <div className="n">
            {totalChange !== 0 && <Arrow dir={totalChange > 0 ? "up" : "down"} />}
            <span>
              {totalChange === 0 ? t.noChange : totalChange > 0 ? t.more : t.less}
              <span className="tail">{totalChange === 0 ? "" : t.inTotal}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Row {
  label: string;
  cents: number;
}

/** The biggest steps by size, in the fixed order, with the rest added into one row so the rows still add up. */
function pickRows(steps: TrailStep[], max: number): Row[] {
  const nonzero = steps.filter((s) => s.cents !== 0);
  if (nonzero.length <= max) return nonzero.map(toRow);
  const keep = new Set(
    [...nonzero]
      .sort((a, b) => Math.abs(b.cents) - Math.abs(a.cents))
      .slice(0, max - 1)
      .map((s) => s.key),
  );
  const rows = nonzero.filter((s) => keep.has(s.key)).map(toRow);
  const rest = nonzero.filter((s) => !keep.has(s.key)).reduce((sum, s) => sum + s.cents, 0);
  if (rest !== 0) rows.push({ label: en.result.other, cents: rest });
  return rows;
}

function toRow(s: TrailStep): Row {
  return { label: en.trailSteps[s.key as TrailKey], cents: s.cents };
}

export function Trail() {
  const { ready, trail } = useAnalysis();
  const drawKey = useDeal((s) => s.drawKey);
  const wide = useMediaQuery("(min-width: 900px)");
  const narrow = useMediaQuery("(max-width: 340px)");

  if (!ready || !trail) return <div className="trail" />;

  const rows = pickRows(trail.steps, wide ? 7 : 3);
  const diverge = trail.monthlyCents < 0 && trail.totalCents > 0;
  const divergeUp = trail.monthlyCents > 0 && trail.totalCents < 0;
  const down = (narrow ? t.divergentShort : t.divergent)(formatCents(Math.abs(trail.monthlyCents)), formatCents(trail.totalCents));
  const up = (narrow ? t.divergentShortUp : t.divergentUp)(formatCents(trail.monthlyCents), formatCents(Math.abs(trail.totalCents)));
  const heading = diverge
    ? down
    : divergeUp
      ? up
      : rows.length === 0
        ? t.nothingMoved
        : t.movedHeading;
  const max = Math.max(...rows.map((r) => Math.abs(r.cents)), 1);

  return (
    <div className="trail">
      <h2>
        <Nums text={heading} />
      </h2>
      {rows.map((r) => {
        const dir = r.cents > 0 ? "up" : "down";
        return (
          <div className="row" key={`${drawKey}-${r.label}`}>
            <span className="k">{r.label}</span>
            <span className={`bar ${dir}`} aria-hidden="true">
              <i style={{ width: `${Math.max((Math.abs(r.cents) / max) * 100, 2)}%` }} />
            </span>
            <span className={`a num ${dir}`}>{formatSignedCents(r.cents)}</span>
          </div>
        );
      })}
    </div>
  );
}
