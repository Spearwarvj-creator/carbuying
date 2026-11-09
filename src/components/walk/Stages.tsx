"use client";

import { useMemo } from "react";
import { Nums } from "@/components/Nums";
import { TERMS } from "@/data/strings/terms";
import { walk } from "@/data/strings/walk";
import {
  computeDeal,
  costBreakdown,
  extrasRealCostCents,
  formatCents,
  formatWhole,
  paymentEquivalents,
  toCents,
  type Offer,
} from "@/engine";
import { setMode } from "@/lib/mode";
import { useDeal } from "@/store/deal";
import { useWalk } from "@/store/walk";
import { withTransition } from "@/lib/view-transition";
import { MonthChips, TenSecondCheck } from "./Check";
import { FourSquare, MoneyBar, PaymentStrip, type BarPart } from "./graphics";
import { MoneyField } from "./MoneyField";
import { Term } from "./Term";

/** The first offer, the one the Walk edits. */
export function useQuote() {
  const o = useDeal((s) => s.offers[0]);
  const d = useMemo(() => computeDeal(o), [o]);
  const set = (patch: Partial<Offer>) => useDeal.setState((s) => ({ offers: [{ ...s.offers[0], ...patch }, s.offers[1]], example: false }));
  return { o, d, set };
}

const whole = (cents: number) => formatWhole(cents / 100);

/** What the buyer can go forward with at each step. */
export function canContinue(stage: number, startedWith: string | null, quotedPay: number, price: number, rateEntered: boolean): boolean {
  if (stage === 1) return startedWith === "price" || (startedWith === "payment" && quotedPay > 0);
  if (stage === 2) return price > 0;
  if (stage === 4) return rateEntered;
  return true;
}

function StageHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <header className="stagehead">
      <h1>{title}</h1>
      {sub && <p className="sub">{sub}</p>}
    </header>
  );
}

/* ---------------------------------------------------------------- 1 */
export function Stage1() {
  const t = walk.stage1;
  const startedWith = useWalk((s) => s.startedWith);
  const setStartedWith = useWalk((s) => s.setStartedWith);
  const quotedPay = useWalk((s) => s.quotedPay);
  const checkMonths = useWalk((s) => s.checkMonths);
  const checkDown = useWalk((s) => s.checkDown);
  const setQuote = useWalk((s) => s.setQuote);
  const { set } = useQuote();

  return (
    <>
      <div className="col-a">
        <StageHead title={t.title} sub={t.sub} />
        <div className="pick" role="group" aria-label={t.title}>
          <button type="button" aria-pressed={startedWith === "payment"} onClick={() => setStartedWith("payment")}>
            {t.payment}
          </button>
          <button type="button" aria-pressed={startedWith === "price"} onClick={() => setStartedWith("price")}>
            {t.price}
          </button>
        </div>
        <p className="learn">
          <Term k="fourSquare" />
        </p>
        {startedWith === "payment" && (
          <>
            <p className="hint">{t.payFields}</p>
            <TenSecondCheck
              initial={{ pay: quotedPay, months: checkMonths, down: checkDown }}
              onChange={(v) => {
                setQuote(v.pay, v.months, v.down);
                set({ months: v.months, down: v.down });
              }}
            />
          </>
        )}
      </div>
      <div className="col-b">
        <FourSquare lit={startedWith === "payment" ? "pay" : startedWith === "price" ? "price" : null} />
        {startedWith === "payment" && quotedPay > 0 && <p className="hint">{t.payAdds}</p>}
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- 2 */
export function Stage2() {
  const t = walk.stage2;
  const { o, d, set } = useQuote();
  const parts: BarPart[] = [
    { key: "car", label: t.parts.car, cents: toCents(o.price) },
    { key: "tax", label: t.parts.tax, cents: d.taxCents },
    { key: "fees", label: t.parts.fees, cents: toCents(o.fees) },
  ];
  return (
    <>
      <div className="col-a">
        <StageHead title={t.title} sub={t.sub} />
        <MoneyField label={t.price} prefix="$" value={o.price} onChange={(n) => set({ price: n })} autoFocus />
        <MoneyField label={t.tax} suffix="%" decimals={2} max={20} value={o.taxRate * 100} onChange={(n) => set({ taxRate: n / 100 })} />
        <MoneyField label={t.fees} prefix="$" value={o.fees} onChange={(n) => set({ fees: n })} hint={t.feesHint} learn={<Term k="docFee" />} />
      </div>
      <div className="col-b">
        <p className="big-label">
          <Term k="outTheDoor">{t.numberLabel}</Term>
        </p>
        <p className="big num dup" aria-live="polite">
          {o.price > 0 ? formatWhole(d.otd) : "$0"}
        </p>
        {o.price > 0 && <MoneyBar parts={parts} showShare={false} />}
        <p className="hint">{t.barCaption}</p>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- 3 */
export function Stage3() {
  const t = walk.stage3;
  const { o, set } = useQuote();
  const b = costBreakdown(o);
  const parts: BarPart[] = [
    { key: "car", label: walk.stage2.parts.car, cents: toCents(o.price) },
    { key: "fees", label: walk.stage6.parts.taxFees, cents: b.taxFeesCents },
    { key: "extras", label: walk.stage6.parts.extras, cents: b.extrasCents },
  ];
  return (
    <>
      <div className="col-a">
        <StageHead title={t.title} sub={t.sub} />
        <MoneyField
          key={o.addons === 0 ? "none" : "has"}
          label={t.addons}
          learn={<Term k="addOn" />}
          prefix="$"
          value={o.addons}
          onChange={(n) => set({ addons: n })}
          autoFocus
        />
        <button type="button" className="quiet" onClick={() => set({ addons: 0 })}>
          {t.none}
        </button>
        {o.addons === 0 && <p className="hint">{t.noneNote}</p>}
      </div>
      <div className="col-b">
        <p className="big-label">{t.numberLabel}</p>
        <p className="big num" aria-live="polite">
          {formatWhole(b.extrasCents / 100)}
        </p>
        <MoneyBar parts={parts} showShare={false} />
        <p className="hint">{t.caption}</p>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- 4 */
export function Stage4() {
  const t = walk.stage4;
  const { o, d, set } = useQuote();
  const rateEntered = useWalk((s) => s.rateEntered);
  const setRateEntered = useWalk((s) => s.setRateEntered);
  const guess = useWalk((s) => s.guess);
  const setGuess = useWalk((s) => s.setGuess);

  const paid = d.pay * o.months;
  const share = paid > 0 ? Math.round((d.interest / paid) * 100) : 0;
  const interestBlocks = paid > 0 ? Math.round((d.interest / paid) * o.months) : 0;

  const altMonths = o.months <= 60 ? o.months + 24 : o.months - 24;
  const alt = useMemo(() => computeDeal({ ...o, months: altMonths }), [o, altMonths]);
  const totalDiff = alt.totalCents - d.totalCents;
  const payDiff = Math.abs(alt.payCents - d.payCents);

  const ready = rateEntered && o.price > 0;

  return (
    <>
      <div className="col-a">
        <StageHead title={t.title} sub={t.sub} />
        <div className="mf">
          <div className="mf-head">
            <span className="lab">{t.months}</span>
            <span className="learn">
              <Term k="loanTerm" />
            </span>
          </div>
          <MonthChips value={o.months} onChange={(m) => set({ months: m })} label={t.months} />
        </div>
        <MoneyField
          label={t.apr}
          learn={<Term k="apr" />}
          suffix="%"
          decimals={2}
          max={40}
          value={o.apr}
          onChange={(n) => {
            set({ apr: n });
            setRateEntered(true);
          }}
          autoFocus
        />
        {ready && (
          <details className="guess">
            <summary>{t.guess.title}</summary>
            <p>{o.months <= 60 ? t.guess.askLonger(altMonths) : t.guess.askShorter(altMonths)}</p>
            <div className="chipset">
              {(["higher", "same", "lower"] as const).map((g) => (
                <button key={g} type="button" className="chipbtn" aria-pressed={guess === g} onClick={() => setGuess(g)}>
                  {t.guess[g]}
                </button>
              ))}
            </div>
            {guess && (
              <p className="reveal" aria-live="polite">
                <Nums
                  text={
                    totalDiff >= 0
                      ? t.guess.revealMore(formatWhole(totalDiff / 100), formatWhole(payDiff / 100), altMonths)
                      : t.guess.revealLess(formatWhole(Math.abs(totalDiff) / 100), formatWhole(payDiff / 100), altMonths)
                  }
                />{" "}
                <span className="hint">{t.guess.note}</span>
              </p>
            )}
          </details>
        )}
      </div>
      <div className="col-b">
        <p className="big-label dup">{t.numberLabel}</p>
        <p className="big num tot dup" aria-live="polite">
          {ready ? formatWhole(d.total) : "$0"}
        </p>
        {ready ? (
          <>
            <PaymentStrip months={o.months} interestBlocks={interestBlocks} caption={t.stripCaption(o.months, interestBlocks)} />
            <p className="hint">
              <Term k="interest">Interest</Term>: <Nums text={t.interestShare(share)} />
            </p>
          </>
        ) : (
          <p className="hint">{t.needRate}</p>
        )}
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- 5 */
export function Stage5() {
  const t = walk.stage5;
  const { o, d, set } = useQuote();
  const equity = d.equity;
  const hasTrade = o.tradeAllowance > 0 || o.tradePayoff > 0;
  return (
    <>
      <div className="col-a">
        <StageHead title={t.title} sub={t.sub} />
        <MoneyField
          label={t.down}
          learn={<Term k="downPayment" />}
          prefix="$"
          value={o.down}
          onChange={(n) => set({ down: n })}
          autoFocus
        />
        <MoneyField
          key={`a${hasTrade ? 1 : 0}`}
          label={t.allowance}
          learn={<Term k="tradeIn" />}
          prefix="$"
          value={o.tradeAllowance}
          onChange={(n) => set({ tradeAllowance: n })}
        />
        <MoneyField
          key={`p${hasTrade ? 1 : 0}`}
          label={t.payoff}
          learn={<Term k="payoff" />}
          prefix="$"
          value={o.tradePayoff}
          onChange={(n) => set({ tradePayoff: n })}
        />
        <button type="button" className="quiet" onClick={() => set({ tradeAllowance: 0, tradePayoff: 0 })}>
          {t.noTrade}
        </button>
      </div>
      <div className="col-b">
        <p className="big-label">
          <Term k="amountFinanced">{t.numberLabel}</Term>
        </p>
        <p className="big num" aria-live="polite">
          {formatWhole(d.fin)}
        </p>
        {hasTrade && (
          <p className="hint">
            <Nums text={equity > 0 ? t.ahead(formatWhole(equity)) : equity < 0 ? t.behind(formatWhole(-equity)) : t.even} />{" "}
            {equity < 0 && <Term k="negativeEquity" />}
          </p>
        )}
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- 6 */
export function Stage6() {
  const t = walk.stage6;
  const { o, d } = useQuote();
  const seen = useWalk((s) => s.seen);
  const quotedPay = useWalk((s) => s.quotedPay);
  const b = costBreakdown(o);
  const share = d.totalCents > 0 ? Math.round((b.interestCents / d.totalCents) * 100) : 0;
  const extrasReal = extrasRealCostCents(o);
  const eq = paymentEquivalents(extrasReal, d.payCents);
  const parts: BarPart[] = [
    { key: "car", label: t.parts.car, cents: b.carCents },
    { key: "fees", label: t.parts.taxFees, cents: b.taxFeesCents },
    { key: "extras", label: t.parts.extras, cents: b.extrasCents },
    { key: "rolled", label: t.parts.rolled, cents: b.rolledInCents },
    { key: "interest", label: t.parts.interest, cents: b.interestCents },
  ];

  function startOver() {
    withTransition(() => {
      useDeal.getState().startQuote();
      useWalk.getState().reset();
      useWalk.getState().go("door");
    });
  }
  function second() {
    useDeal.getState().addSecondOffer();
    setMode("desk");
  }

  return (
    <>
      <div className="col-a">
        <StageHead title={t.title} />
        <p className="big-label">{t.totalLabel}</p>
        <p className="big num tot" aria-live="polite">
          {formatWhole(d.total)}
        </p>
        <p className="line">
          <Nums text={t.interestLine(share)} />
        </p>
        {o.addons > 0 && (
          <p className="line">
            <Nums text={t.extrasLine(formatWhole(extrasReal / 100), t.paymentsEq(eq))} />
          </p>
        )}
        {quotedPay > 0 &&
          (Math.abs(d.payCents - toCents(quotedPay)) > 500 ? (
            <p className="note-flag">
              <Nums text={walk.stage4.mismatch(formatCents(d.payCents), formatCents(toCents(quotedPay)))} />
            </p>
          ) : (
            <p className="line">
              <Nums text={walk.stage4.match(formatCents(toCents(quotedPay)))} />
            </p>
          ))}
        <div className="actions">
          <button type="button" className="go" onClick={second}>
            {t.compare}
          </button>
          <button type="button" className="quiet" onClick={startOver}>
            {t.again}
          </button>
          <button type="button" className="quiet" onClick={() => setMode("desk")}>
            {t.desk}
          </button>
        </div>
      </div>
      <div className="col-b">
        <MoneyBar parts={parts} />
        <details className="math">
          <summary>{t.showMath}</summary>
          <dl>
            {parts
              .filter((p) => p.cents > 0)
              .map((p) => (
                <div key={p.key}>
                  <dt>{p.label}</dt>
                  <dd className="num">{whole(p.cents)}</dd>
                </div>
              ))}
            <div className="sum">
              <dt>{walk.bar.total}</dt>
              <dd className="num">{whole(d.totalCents)}</dd>
            </div>
          </dl>
        </details>
        {seen.length > 0 && (
          <section className="met">
            <h2>{t.askHeading}</h2>
            <ul>
              {seen.slice(0, 5).map((k) => (
                <li key={k}>
                  <b>{TERMS[k].term}.</b> {TERMS[k].ask}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
