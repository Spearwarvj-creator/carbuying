"use client";

import { useState } from "react";
import { en } from "@/data/strings/en";
import { formatCents, toCents, type Lever, type Metric, type Offer } from "@/engine";
import { useDeal } from "@/store/deal";
import { useAnalysis } from "./analysis";
import { leverLine } from "./lever-line";
import { Nums } from "./Nums";
import { Btn } from "./ui/Btn";
import { ReadAloud } from "./walk/ReadAloud";
import { ai } from "@/data/strings/ai";

const METRICS: Metric[] = ["total", "pay", "otd"];

function MetricSwitch() {
  const metric = useDeal((s) => s.metric);
  const setMetric = useDeal((s) => s.setMetric);
  return (
    <div className="measure">
      <span>{en.compare.on}</span>
      <div className="seg" role="group" aria-label={en.compare.on}>
        {METRICS.map((m) => (
          <button key={m} type="button" aria-pressed={metric === m} onClick={() => setMetric(m)}>
            {en.compare.metrics[m]}
          </button>
        ))}
      </div>
    </div>
  );
}

const offerName = (side: "a" | "b") => (side === "a" ? en.offer1 : en.offer2);

type Take = NonNullable<ReturnType<typeof useAnalysis>["take"]>;

/** Levers that make sense for this offer: no fee lever without fees, no trade-in lever without a trade-in. */
function relevantLevers(take: Take, loser: Offer) {
  const hasTrade = loser.tradeAllowance > 0 || loser.tradePayoff > 0;
  return take.levers.filter(({ lever }) => {
    if (lever === "fees") return loser.fees > 0;
    if (lever === "addons") return loser.addons > 0;
    if (lever === "trade") return hasTrade;
    return true;
  });
}

export function CompareView() {
  const { ready, d1, d2 } = useAnalysis();
  const c = en.compare;
  if (!ready) return <section className="view"><h2>{c.heading}</h2><p className="hint">{en.result.empty}</p></section>;

  const lowerOf = (a: number, b: number) => (a < b ? 0 : a > b ? 1 : -1);
  const rows: Array<{ label: string; v: [string, string]; low: number }> = [
    { label: c.rows.pay, v: [formatCents(d1.payCents), formatCents(d2.payCents)], low: lowerOf(d1.payCents, d2.payCents) },
    { label: c.rows.months, v: [String(d1.offer.months), String(d2.offer.months)], low: -1 },
    { label: c.rows.otd, v: [formatCents(d1.otdCents), formatCents(d2.otdCents)], low: lowerOf(d1.otdCents, d2.otdCents) },
    { label: c.rows.total, v: [formatCents(d1.totalCents), formatCents(d2.totalCents)], low: lowerOf(d1.totalCents, d2.totalCents) },
  ];
  const payLow = lowerOf(d1.payCents, d2.payCents);
  const totalLow = lowerOf(d1.totalCents, d2.totalCents);
  const names = [en.offer1, en.offer2];
  const diff = formatCents(Math.abs(d1.totalCents - d2.totalCents));
  const headline =
    payLow >= 0 && totalLow >= 0 && payLow !== totalLow
      ? c.winnersDiffer(names[payLow], names[totalLow], diff)
      : totalLow >= 0
        ? c.sameWinner(names[totalLow])
        : null;

  return (
    <section className="view">
      <h2>{c.heading}</h2>
      {headline && (
        <p className="headline">
          <Nums text={headline} />
        </p>
      )}
      <table className="cmp">
        <thead>
          <tr>
            <th scope="col">
              <span className="sr-only">Measure</span>
            </th>
            <th scope="col">{en.offer1}</th>
            <th scope="col">{en.offer2}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              {[0, 1].map((i) => (
                <td key={i} className="n num">
                  {r.low === i && <span className="mark">{c.lower}</span>}
                  {r.v[i]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function TargetView() {
  const { ready, take, d1, d2 } = useAnalysis();
  const t = en.target;
  if (!ready || !take) return <section className="view"><h2>{t.heading}</h2><p className="hint">{en.result.empty}</p></section>;

  const loserOffer = take.loser === "a" ? d1.offer : d2.offer;
  const items: Record<Lever, number> = {
    price: loserOffer.price,
    fees: loserOffer.fees,
    addons: loserOffer.addons,
    rate: loserOffer.apr,
    trade: 0,
  };
  const cards = relevantLevers(take, loserOffer);

  return (
    <section className="view">
      <h2>{t.heading}</h2>
      <MetricSwitch />
      {take.tie ? (
        <p className="intro">{t.tie}</p>
      ) : (
        <p className="intro">{t.intro(offerName(take.loser), t.measure[take.metric])}</p>
      )}
      {!take.tie &&
        cards.map(({ lever, result }) => (
          <div className="card" key={lever}>
            <b>{t.levers[lever]}</b>
            <span className="big">
              {result ? <Nums text={leverLine(lever, result)} /> : t.cantMatch}
              {result && result.percentOfItem !== null && items[lever] > 0 && lever !== "addons" && (
                <> ({t.percentOf(`${result.percentOfItem.toFixed(1)}%`, lever === "rate" ? "rate" : lever === "price" ? "price" : "fees")})</>
              )}
            </span>
          </div>
        ))}
      {take.metric === "pay" && <p className="note">{t.paymentNote}</p>}
    </section>
  );
}

export function buildAsk(take: Take, loser: Offer): string {
  const a = en.ask;
  // Each side is rounded to cents first, so this matches the totals on screen to the cent.
  const measureFmt = formatCents(toCents(take.loserNow) - toCents(take.target));
  const lines = relevantLevers(take, loser).filter((l) => l.result).map((l) => `- ${leverLine(l.lever, l.result!)}`);
  const head = a.opening(offerName(take.loser), measureFmt, en.target.measure[take.metric]);
  if (lines.length === 0) return [head, a.fallback, a.thanks].join("\n\n");
  return [head, a.request(offerName(take.winner)), lines.join("\n"), a.thanks].join("\n\n");
}

export function AskView() {
  const { ready, take, d1, d2 } = useAnalysis();
  const [copied, setCopied] = useState(false);
  const [reworded, setReworded] = useState<{ base: string; text: string } | null>(null);
  const [rewording, setRewording] = useState(false);
  const [toneNote, setToneNote] = useState("");
  const a = en.ask;
  if (!ready || !take) return <section className="view"><h2>{a.heading}</h2><p className="hint">{en.result.empty}</p></section>;
  if (take.tie) return <section className="view"><h2>{a.heading}</h2><p className="hint">{a.nothing}</p></section>;

  const standard = buildAsk(take, take.loser === "a" ? d1.offer : d2.offer);
  const text = reworded && reworded.base === standard ? reworded.text : standard;
  async function reword(tone: "polite" | "firm" | "short" | "text", lang: "en" | "es" = "en") {
    if (tone === "polite" && lang === "en") return setReworded(null);
    setRewording(true);
    setToneNote("");
    try {
      const res = await fetch("/api/draft", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: standard, tone, lang }) });
      if (!res.ok) return setToneNote(ai.tone.kept);
      const a = (await res.json()) as { text: string; source: "ai" | "template" };
      setReworded({ base: standard, text: a.text });
      setToneNote(a.source === "ai" ? ai.tone.ai : ai.tone.kept);
    } catch {
      setToneNote(ai.tone.kept);
    } finally {
      setRewording(false);
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="view">
      <h2>{a.heading}</h2>
      <div className="card">
        <p className="askbox" style={{ margin: 0 }}>{text}</p>
      </div>
      <div className="tonebox" role="group" aria-label={ai.tone.label}>
        <span className="label">{ai.tone.label}</span>
        {(["polite", "firm", "short", "text"] as const).map((k) => (
          <Btn key={k} variant="ghost" onClick={() => reword(k)} aria-disabled={rewording}>
            {ai.tone.options[k]}
          </Btn>
        ))}
        <Btn variant="ghost" onClick={() => reword("polite", "es")} aria-disabled={rewording}>
          {ai.tone.es}
        </Btn>
      </div>
      {toneNote && (
        <p className="hint" role="status">
          {rewording ? ai.tone.working : toneNote}
        </p>
      )}
      <p style={{ margin: "10px 0 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" className="btn primary" onClick={copy}>
          {copied ? a.copied : a.copy}
        </button>
        <ReadAloud text={text} />
      </p>
    </section>
  );
}
