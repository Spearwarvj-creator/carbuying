"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Nums } from "@/components/Nums";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Btn } from "@/components/ui/Btn";
import { ArrowIcon, BackIcon, CheckIcon, ListIcon, LockIcon, SceneCar, SceneDesk, SceneQuote } from "@/components/ui/icons";
import { Sheet } from "@/components/ui/Sheet";
import { en } from "@/data/strings/en";
import { walk } from "@/data/strings/walk";
import { costBreakdown, formatWhole, toCents } from "@/engine";
import { setMode } from "@/lib/mode";
import { useDeal } from "@/store/deal";
import { STAGES, useWalk } from "@/store/walk";
import { TenSecondCheck } from "./Check";
import { Stage1, Stage2, Stage3, Stage4, Stage5, Stage6, canContinue, useQuote } from "./Stages";

/** Items rise in one after another. One orchestrated moment on arrival, then the page is still. */
const rise = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 26, delay: 0.05 + i * 0.07 } }),
};

function Door() {
  const t = walk.door;
  const go = useWalk((s) => s.go);
  const reset = useWalk((s) => s.reset);

  const pick = (view: "check" | "quote" | "desk") => {
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
  };

  const doors = [
    { id: "check", scene: <SceneCar />, ...t.think },
    { id: "quote", scene: <SceneQuote />, ...t.quote },
    { id: "desk", scene: <SceneDesk />, ...t.desk },
  ] as const;

  return (
    <div className="door">
      <motion.header className="stagehead door-head" variants={rise} initial="hidden" animate="show" custom={0}>
        <div>
          <h1>{t.title}</h1>
          <p className="sub">{t.sub}</p>
        </div>
        <ul className="reassure">
          {t.reassure.map((r, i) => (
            <li key={r}>
              {i === 0 ? <CheckIcon size={18} /> : <LockIcon size={18} />}
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </motion.header>
      <ul className="doors">
        {doors.map((d, i) => (
          <motion.li key={d.id} variants={rise} initial="hidden" animate="show" custom={i + 1}>
            <button type="button" className="doorbtn" onClick={() => pick(d.id)}>
              <span className="door-art">{d.scene}</span>
              <span className="door-text">
                <b>{d.title}</b>
                <span>{d.body}</span>
              </span>
              <span className="door-go" aria-hidden="true">
                <ArrowIcon size={22} />
              </span>
            </button>
          </motion.li>
        ))}
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
        <div>
          <h1>{walk.check.title}</h1>
        </div>
      </header>
      <TenSecondCheck
        onContinue={(v) => {
          useDeal.getState().startQuote();
          useDeal.setState((s) => ({ offers: [{ ...s.offers[0], months: v.months, down: v.down }, s.offers[1]] }));
          useWalk.getState().reset();
          setQuote(v.pay, v.months, v.down);
          setStartedWith("payment");
          go("stage", 1);
        }}
      />
      <Btn variant="quiet" icon={<BackIcon size={18} />} onClick={() => go("door")}>
        {walk.back}
      </Btn>
    </div>
  );
}

/** Six steps as a stepper: a dot per step, a line that fills as you move on, and a drawn check on finished steps. */
function Rail() {
  const stage = useWalk((s) => s.stage);
  const setStage = useWalk((s) => s.setStage);
  return (
    <nav className="rail" aria-label={walk.stepOf(stage, STAGES)}>
      <ol>
        {Array.from({ length: STAGES }, (_, i) => i + 1).map((n) => {
          const state = n < stage ? "done" : n === stage ? "now" : "todo";
          return (
            <li key={n} data-state={state}>
              <button
                type="button"
                className="rail-dot"
                aria-label={`${walk.stepOf(n, STAGES)}: ${walk.stepNames[n - 1]}`}
                aria-current={n === stage ? "step" : undefined}
                disabled={n > stage}
                onClick={() => setStage(n)}
              >
                {state === "done" ? (
                  <motion.svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <motion.path d="m5 12.5 4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.1 }} />
                  </motion.svg>
                ) : (
                  <span className="num">{n}</span>
                )}
              </button>
              <span className="rail-name" aria-hidden="true">
                {walk.stepNames[n - 1]}
              </span>
              {n < STAGES && (
                <span className="rail-line" aria-hidden="true">
                  <motion.span className="rail-fill" initial={false} animate={{ scaleX: n < stage ? 1 : 0 }} transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }} />
                </span>
              )}
            </li>
          );
        })}
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
  const go1 = (n: number) => (n < 1 ? go("door") : setStage(n));
  function forward() {
    if (!ok) {
      setNeedStage(stage);
      document.querySelector<HTMLInputElement>(".walk-main input, .walk-main .tg-item")?.focus();
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
            <AnimatedNumber value={value} format={formatWhole} />
          </span>
        )}
      </div>
      {priceKnown && (
        <Sheet
          title={walk.bar.partsHeading}
          closeLabel={walk.bar.close}
          trigger={
            <button type="button" className="parts-btn">
              <ListIcon size={20} />
              <span className="parts-txt">{walk.bar.open}</span>
            </button>
          }
        >
          <dl className="parts">
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
        </Sheet>
      )}
      <AnimatePresence>
        {needStage === stage && !ok && (
          <motion.p
            className="need"
            role="status"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {walk.need[stage]}
          </motion.p>
        )}
      </AnimatePresence>
      <div className="nav">
        <Btn variant="ghost" icon={<BackIcon size={18} />} onClick={() => go1(stage - 1)} aria-label={walk.back}>
          <span className="nav-txt">{walk.back}</span>
        </Btn>
        {stage < STAGES && (
          <Btn variant="primary" arrow aria-disabled={!ok} onClick={forward}>
            {walk.next}
          </Btn>
        )}
      </div>
    </div>
  );
}

/** Which way the buyer is moving, so a step slides in from the side they are heading toward. */
const order = (view: string, stage: number) => (view === "door" ? 0 : view === "check" ? 0.5 : stage);

export function WalkScreen() {
  const view = useWalk((s) => s.view);
  const stage = useWalk((s) => s.stage);
  const Stage = [Stage1, Stage2, Stage3, Stage4, Stage5, Stage6][stage - 1];

  const here = order(view, stage);
  // Derived from the previous position during render, the pattern React recommends over a ref here.
  const [prev, setPrev] = useState(here);
  const [dir, setDir] = useState(1);
  if (here !== prev) {
    setPrev(here);
    setDir(here > prev ? 1 : -1);
  }

  return (
    <div className="walk" data-view={view}>
      <AppHeader />
      {view === "stage" && <Rail />}
      <main className="walk-main" id="main">
        {/* Enter only: the new step slides in from the side the buyer is heading toward. No exit animation, so there is no blank gap between steps. */}
        <motion.div
          key={`${view}-${stage}`}
          className="walk-page"
          initial={{ opacity: 0, x: dir * 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.26, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {view === "door" && <Door />}
          {view === "check" && <CheckView />}
          {view === "stage" && (
            <div className="stage">
              <Stage />
            </div>
          )}
        </motion.div>
      </main>
      {view === "stage" ? <BottomBar /> : <AppFooter />}
      <p className="sr-only">
        <Nums text={en.note} />
      </p>
    </div>
  );
}
