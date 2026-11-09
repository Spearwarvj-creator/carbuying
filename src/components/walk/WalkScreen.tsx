"use client";

import Link from "next/link";
import { useState } from "react";
import { Nums } from "@/components/Nums";
import { Prefs } from "@/components/Prefs";
import { en } from "@/data/strings/en";
import { walk } from "@/data/strings/walk";
import { costBreakdown, formatWhole, toCents } from "@/engine";
import { setMode, useMode } from "@/lib/mode";
import { withTransition } from "@/lib/view-transition";
import { useDeal } from "@/store/deal";
import { STAGES, useWalk } from "@/store/walk";
import { TenSecondCheck } from "./Check";
import { Stage1, Stage2, Stage3, Stage4, Stage5, Stage6, canContinue, useQuote } from "./Stages";

/** The Walk and Desk switch. Both views edit the same numbers, so nothing is lost by switching. */
export function ModeSwitch() {
  const mode = useMode();
  const m = walk.mode;
  return (
    <div className="seg" role="group" aria-label={m.label}>
      <button type="button" aria-pressed={mode === "walk"} onClick={() => setMode("walk")}>
        {m.walk}
      </button>
      <button type="button" aria-pressed={mode === "desk"} onClick={() => setMode("desk")}>
        {m.desk}
      </button>
    </div>
  );
}

function Door() {
  const t = walk.door;
  const go = useWalk((s) => s.go);
  const reset = useWalk((s) => s.reset);

  const pick = (view: "check" | "quote" | "desk") =>
    withTransition(() => {
      if (view === "check") {
        go("check");
      } else if (view === "quote") {
        useDeal.getState().startQuote();
        reset();
        go("stage", 1);
      } else {
        useDeal.getState().useMine();
        setMode("desk");
      }
    });

  return (
    <div className="door">
      <header className="stagehead">
        <h1>{t.title}</h1>
        <p className="sub">{t.sub}</p>
      </header>
      <ul className="doors">
        <li>
          <button type="button" onClick={() => pick("check")}>
            <b>{t.think.title}</b>
            <span>{t.think.body}</span>
          </button>
        </li>
        <li>
          <button type="button" onClick={() => pick("quote")}>
            <b>{t.quote.title}</b>
            <span>{t.quote.body}</span>
          </button>
        </li>
        <li>
          <button type="button" onClick={() => pick("desk")}>
            <b>{t.desk.title}</b>
            <span>{t.desk.body}</span>
          </button>
        </li>
      </ul>
    </div>
  );
}

function CheckView() {
  const go = useWalk((s) => s.go);
  const setQuote = useWalk((s) => s.setQuote);
  const setStartedWith = useWalk((s) => s.setStartedWith);
  return (
    <div className="check-view">
      <header className="stagehead">
        <h1>{walk.check.title}</h1>
      </header>
      <TenSecondCheck
        onContinue={(v) => {
          withTransition(() => {
            useDeal.getState().startQuote();
            useDeal.setState((s) => ({ offers: [{ ...s.offers[0], months: v.months, down: v.down }, s.offers[1]] }));
            useWalk.getState().reset();
            setQuote(v.pay, v.months, v.down);
            setStartedWith("payment");
            go("stage", 1);
          });
        }}
      />
      <button type="button" className="quiet back" onClick={() => withTransition(() => go("door"))}>
        {walk.back}
      </button>
    </div>
  );
}

function Rail() {
  const stage = useWalk((s) => s.stage);
  const setStage = useWalk((s) => s.setStage);
  return (
    <nav className="rail" aria-label={walk.stepOf(stage, STAGES)}>
      <p className="step num" aria-hidden="true">
        {walk.stepOf(stage, STAGES)}
      </p>
      <ol>
        {Array.from({ length: STAGES }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            <button
              type="button"
              className={n < stage ? "done" : n === stage ? "now" : ""}
              aria-label={walk.stepOf(n, STAGES)}
              aria-current={n === stage ? "step" : undefined}
              disabled={n > stage}
              onClick={() => withTransition(() => setStage(n))}
            />
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** The running summary. It stays on every step, and shows the most complete number known so far. */
function BottomBar() {
  const { o, d } = useQuote();
  const stage = useWalk((s) => s.stage);
  const setStage = useWalk((s) => s.setStage);
  const go = useWalk((s) => s.go);
  const startedWith = useWalk((s) => s.startedWith);
  const quotedPay = useWalk((s) => s.quotedPay);
  const rateEntered = useWalk((s) => s.rateEntered);

  const priceKnown = o.price > 0;
  const showTotal = priceKnown && rateEntered && stage >= 4;
  const label = showTotal ? walk.bar.total : walk.bar.otd;
  const value = showTotal ? d.total : d.otd;
  const b = costBreakdown(o);
  const ok = canContinue(stage, startedWith, quotedPay, o.price, rateEntered);

  const [needStage, setNeedStage] = useState(0);
  const go1 = (n: number) => withTransition(() => (n < 1 ? go("door") : setStage(n)));
  function forward() {
    if (!ok) {
      setNeedStage(stage);
      document.querySelector<HTMLInputElement>(".walk-main input, .walk-main .pick button")?.focus();
      return;
    }
    go1(stage + 1);
  }

  return (
    <div className="wbar" role="region" aria-label={walk.bar.partsHeading}>
      <div className="sum">
        <span className="lbl">{priceKnown ? label : walk.bar.nothing}</span>
        {priceKnown && (
          <span className="amt num" aria-live="polite">
            {formatWhole(value)}
          </span>
        )}
      </div>
      {priceKnown && (
        <>
          <button type="button" className="parts-btn" popoverTarget="bar-parts" aria-label={walk.bar.open}>
            <span aria-hidden="true" className="chev" />
          </button>
          <div id="bar-parts" popover="auto" className="barparts">
            <h2>{walk.bar.partsHeading}</h2>
            <dl>
              <div>
                <dt>{walk.bar.price}</dt>
                <dd className="num">{formatWhole(o.price)}</dd>
              </div>
              <div>
                <dt>{walk.bar.tax}</dt>
                <dd className="num">{formatWhole(d.tax)}</dd>
              </div>
              {o.fees > 0 && (
                <div>
                  <dt>{walk.bar.fees}</dt>
                  <dd className="num">{formatWhole(o.fees)}</dd>
                </div>
              )}
              {b.extrasCents > 0 && (
                <div>
                  <dt>{walk.bar.extras}</dt>
                  <dd className="num">{formatWhole(toCents(o.addons) / 100)}</dd>
                </div>
              )}
              <div className="sum">
                <dt>{walk.bar.otd}</dt>
                <dd className="num">{formatWhole(d.otd)}</dd>
              </div>
              {showTotal && (
                <>
                  <div>
                    <dt>{walk.bar.interest}</dt>
                    <dd className="num">{formatWhole(d.interest)}</dd>
                  </div>
                  <div className="sum">
                    <dt>{walk.bar.total}</dt>
                    <dd className="num">{formatWhole(d.total)}</dd>
                  </div>
                </>
              )}
            </dl>
            <button type="button" className="btn" popoverTarget="bar-parts" popoverTargetAction="hide">
              {walk.bar.close}
            </button>
          </div>
        </>
      )}
      {needStage === stage && !ok && (
        <p className="need" role="status">
          {walk.need[stage]}
        </p>
      )}
      <div className="nav">
        <button type="button" className="btn" onClick={() => go1(stage - 1)}>
          {walk.back}
        </button>
        {stage < STAGES && (
          <button type="button" className="btn primary" aria-disabled={!ok} onClick={forward}>
            {walk.next}
          </button>
        )}
      </div>
    </div>
  );
}

export function WalkScreen() {
  const view = useWalk((s) => s.view);
  const stage = useWalk((s) => s.stage);
  const Stage = [Stage1, Stage2, Stage3, Stage4, Stage5, Stage6][stage - 1];

  return (
    <div className="walk" data-view={view}>
      <header className="top">
        <Link href="/" className="brand" aria-label={`${en.appName}, home page`}>
          {en.appName}
        </Link>
        <ModeSwitch />
        <Prefs />
      </header>
      {view === "stage" && <Rail />}
      <main className="walk-main" id="main">
        {view === "door" && <Door />}
        {view === "check" && <CheckView />}
        {view === "stage" && (
          <div className="stage" key={stage}>
            <Stage />
          </div>
        )}
      </main>
      {view === "stage" && <BottomBar />}
      <p className="sr-only">
        <Nums text={en.note} />
      </p>
    </div>
  );
}
