"use client";

import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Slider } from "@/components/ui/Slider";
import { siteFor, type Locale } from "@/lib/site-locale";
import { formatWhole, payment } from "@/engine";
import { Car3D } from "./Car3D";
import { HeroCar } from "./HeroCar";

const MIN = 36;
const MAX = 84;
const BASE = 60;
const PER_ROW = 12;
const ROWS = MAX / PER_ROW;

/**
 * The hero. A loan drawn as a road: one tile for each monthly payment, twelve to a row, so each
 * row is a year. Dragging the loan longer lays more road, and the tail of it turns to interest.
 * The two figures beside it are the whole story: the payment falls, the total climbs.
 * Why a road: it is the one picture where "longer" is felt as distance, and it fills the screen
 * the way the best sites in this space let one object own the hero.
 */
export function Road({ principal, apr, down, locale = "en" }: { principal: number; apr: number; down: number; locale?: Locale }) {
  const r = siteFor(locale).home.road;
  const reduce = useReducedMotion();
  const [months, setMonths] = useState(BASE);
  const touched = useRef(false);
  // The line drawing is the car until the 3D one has drawn its first frame.
  // "wait" while the 3D car loads (the drawing is hidden on wide screens so two cars never show), "fallback" when it cannot.
  const [car3d, setCar3d] = useState<"wait" | "on" | "fallback">("wait");
  const on3d = useCallback(() => setCar3d("on"), []);
  const off3d = useCallback(() => setCar3d("fallback"), []);

  const pay = payment(principal, apr, months);
  const paid = pay * months;
  const total = paid + down;
  const basePay = payment(principal, apr, BASE);
  const baseTotal = basePay * BASE + down;
  const interestBlocks = Math.round((months * (paid - principal)) / paid);

  // One orchestrated moment on first sight: the road stretches from 60 to 84 by itself, once,
  // so the idea lands before anyone touches the control. Any touch cancels it.
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => {
      if (touched.current) return;
      const a = animate(BASE, MAX, {
        duration: 2.4,
        ease: [0.45, 0, 0.2, 1],
        onUpdate: (v) => {
          if (touched.current) a.stop();
          else setMonths(Math.round(v));
        },
      });
    }, 1100);
    return () => clearTimeout(t);
  }, [reduce]);

  // The floor leans a little toward the pointer. It is slow and small, so it reads as depth.
  const mx = useMotionValue(0);
  const rz = useSpring(useTransform(mx, [-1, 1], [-4, 4]), { stiffness: 60, damping: 18 });

  const rows = Array.from({ length: ROWS }, (_, i) => ROWS - 1 - i); // far year first, so year one is nearest
  const dMonthly = basePay - pay;
  const dTotal = total - baseTotal;
  const none = "\u00a0";
  const deltaMonthly = Math.abs(dMonthly) < 0.5 ? none : dMonthly > 0 ? `▼ ${r.monthLess(formatWhole(dMonthly))}` : `▲ ${r.monthMore(formatWhole(-dMonthly))}`;
  const deltaTotal = Math.abs(dTotal) < 0.5 ? none : dTotal > 0 ? `▲ ${r.totalMore(formatWhole(dTotal))}` : `▼ ${r.totalLess(formatWhole(-dTotal))}`;

  return (
    <div
      className="road"
      onPointerMove={(e) => {
        const b = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - b.left) / b.width) * 2 - 1);
      }}
    >
      <div className="road-sky" aria-hidden="true" />
      <div className="road-view" aria-hidden="true">
        <motion.div className="road-floor" style={{ rotateX: 50, rotateZ: reduce ? 0 : rz, transformPerspective: 1100 }}>
          {rows.map((row) => (
            <div className="road-row" key={row}>
              {Array.from({ length: PER_ROW }, (_, c) => {
                const i = row * PER_ROW + c;
                const on = i < months;
                const tail = on && i >= months - interestBlocks;
                return <i key={c} className="tile" data-on={on} data-tail={tail} style={{ "--c": c } as CSSProperties} />;
              })}
            </div>
          ))}
        </motion.div>
        <span className="road-car" data-3d={car3d}>
          <HeroCar />
          <Car3D months={months} onReady={on3d} onFail={off3d} />
          <span className="road-tag road-tag-far">{r.paidOff}</span>
        </span>
        <span className="road-tag road-tag-near">{r.today}</span>
      </div>

      <div className="dock">
        <div className="dock-ctl">
          <div className="dock-top">
            <span className="dock-label">{r.label}</span>
            <span className="dock-months num">{r.months(months)}</span>
          </div>
          <Slider
            value={months}
            min={MIN}
            max={MAX}
            step={1}
            label={r.sliderLabel}
            format={r.months}
            ticks={[36, 48, 60, 72, 84]}
            onChange={(n) => {
              touched.current = true;
              setMonths(n);
            }}
          />
          <ul className="dock-key" aria-hidden="true">
            <li>
              <i className="sw car" />
              {r.key.loan}
            </li>
            <li>
              <i className="sw interest" />
              {r.key.interest}
            </li>
          </ul>
        </div>
        <div className="dock-fig">
          <span className="dock-big num">
            <AnimatedNumber value={pay} format={formatWhole} duration={0.3} />
          </span>
          <span className="dock-small">{r.perMonth}</span>
          <span className="dock-delta" data-dir={dMonthly > 0 ? "down" : "up"}>
            {deltaMonthly}
          </span>
        </div>
        <div className="dock-fig dock-fig-total">
          <span className="dock-big dock-total num">
            <AnimatedNumber value={total} format={formatWhole} duration={0.3} />
          </span>
          <span className="dock-small">{r.inTotal}</span>
          <span className="dock-delta" data-dir={dTotal > 0 ? "up" : "down"}>
            {deltaTotal}
          </span>
        </div>
      </div>
    </div>
  );
}
