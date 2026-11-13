"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Btn } from "@/components/ui/Btn";
import { more } from "@/data/strings/more";
import { endTour, useGuide } from "@/lib/onboarding";

const t = more.guide.tour;

/** The places the tour of the Desk points at, in order. A place that is not on screen at this size is skipped. */
const STOPS = [
  { id: "offers", sel: '[data-tour="offers"]' },
  { id: "total", sel: '[data-tour="total"]' },
  { id: "tabs", sel: '[data-tour="tabs"]' },
  { id: "share", sel: '[data-tour="share"]' },
] as const;

const visible = (el: Element) => {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden";
};
const find = (sel: string) => Array.from(document.querySelectorAll(sel)).find(visible) ?? null;

type Box = { top: number; left: number; width: number; height: number };

/**
 * A short tour of the Desk: a spotlight on one place at a time with a small card that says what it is for. It can be
 * skipped at any point, steps with the arrow keys, closes with Escape, and follows the place if the screen changes.
 */
export function Tour() {
  const { tour } = useGuide();
  return tour ? <Running /> : null;
}

function Running() {
  const [stops] = useState(() => STOPS.filter((s) => find(s.sel)));
  const [i, setI] = useState(0);
  const [box, setBox] = useState<Box | null>(null);
  const card = useRef<HTMLDivElement>(null);
  const stop = stops[i];

  const measure = useCallback(() => {
    const el = stop ? find(stop.sel) : null;
    if (!el) return setBox(null);
    const r = el.getBoundingClientRect();
    setBox({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, [stop]);

  useEffect(() => {
    const el = stop ? find(stop.sel) : null;
    if (el) {
      const r = el.getBoundingClientRect();
      const inView = r.top >= 0 && r.bottom <= window.innerHeight;
      if (!inView) el.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
    let frame = 0;
    const again = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    again();
    addEventListener("resize", again);
    addEventListener("scroll", again, true);
    // A scroll that is still settling after scrollIntoView, and any layout shift, is caught by a few more measures.
    const timers = [120, 400, 800].map((ms) => setTimeout(measure, ms));
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("resize", again);
      removeEventListener("scroll", again, true);
      timers.forEach(clearTimeout);
    };
  }, [stop, measure]);

  useEffect(() => {
    card.current?.querySelector<HTMLElement>("[data-primary]")?.focus({ preventScroll: true });
  }, [i]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") endTour();
      else if (e.key === "ArrowRight") setI((n) => Math.min(stops.length - 1, n + 1));
      else if (e.key === "ArrowLeft") setI((n) => Math.max(0, n - 1));
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [stops.length]);

  useEffect(() => {
    if (stops.length === 0) endTour();
  }, [stops.length]);

  if (!stop) return null;
  const copy = t.stops[stop.id];
  const last = i === stops.length - 1;
  const vw = typeof window === "undefined" ? 400 : window.innerWidth;
  const vh = typeof window === "undefined" ? 800 : window.innerHeight;
  const cardW = Math.min(352, vw - 24);
  const tall = box ? box.height > vh * 0.55 : false;
  const below = box ? box.top + box.height / 2 < vh * 0.5 : true;
  const cardStyle: React.CSSProperties = { width: cardW };
  const roomRight = box ? vw - (box.left + box.width) - 14 - 12 >= cardW : false;
  if (box && tall && vw >= 700 && roomRight) {
    // A tall place on a wide screen: the card sits beside it instead of covering other parts of the page.
    cardStyle.left = box.left + box.width + 14;
    cardStyle.top = Math.min(Math.max(12, box.top + box.height / 2 - 90), vh - 220);
  } else if (!box || tall) {
    cardStyle.bottom = 12;
    cardStyle.left = Math.max(12, (vw - cardW) / 2);
  } else {
    cardStyle.left = Math.min(Math.max(12, box.left), vw - cardW - 12);
    if (below) cardStyle.top = Math.min(box.top + box.height + 14, vh - 200);
    else cardStyle.bottom = Math.min(vh - box.top + 14, vh - 12);
  }

  return (
    <div className="gtour" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <div className="gtour-block" onClick={() => endTour()} aria-hidden="true" />
      {box && <div className="gtour-spot" style={{ top: box.top - 6, left: box.left - 6, width: box.width + 12, height: box.height + 12 }} aria-hidden="true" />}
      <div ref={card} className="gtour-card" style={cardStyle}>
        <p className="gtour-step">{t.step(i + 1, stops.length)}</p>
        <h2 id="tour-title">{copy.title}</h2>
        <p>{copy.body}</p>
        <div className="gtour-actions">
          <button type="button" className="link" onClick={() => endTour()}>
            {t.skip}
          </button>
          <span className="gtour-nav">
            {i > 0 && (
              <Btn variant="ghost" onClick={() => setI(i - 1)}>
                {t.back}
              </Btn>
            )}
            <Btn variant="primary" data-primary onClick={() => (last ? endTour() : setI(i + 1))}>
              {last ? t.done : t.next}
            </Btn>
          </span>
        </div>
      </div>
    </div>
  );
}
