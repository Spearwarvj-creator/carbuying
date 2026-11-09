"use client";

import { useEffect, useRef, useState } from "react";
import { en } from "@/data/strings/en";
import { formatWhole } from "@/engine";
import { useDeal, type BoxKey } from "@/store/deal";
import { BOX_FIELDS, type FieldDef } from "./field-config";

function shown(def: FieldDef, stored: number): string {
  return String(+(stored * def.scale).toFixed(def.decimals));
}

function formatBuffer(buf: string, def: FieldDef): string {
  const [whole, frac] = buf.split(".");
  const w = Number(whole || 0).toLocaleString("en-US");
  const body = frac === undefined ? w : `${w}.${frac}`;
  return def.unit === "$" ? `$${body}` : `${body}%`;
}

function Inner({ box }: { box: BoxKey }) {
  const offers = useDeal((s) => s.offers);
  const editing = useDeal((s) => s.editing);
  const setValue = useDeal((s) => s.setValue);
  const close = useDeal((s) => s.close);
  const o = offers[editing];
  const defs = BOX_FIELDS[box];
  const copy = en.boxes[box];

  const [active, setActive] = useState(0);
  const def = defs[active];
  const [buf, setBuf] = useState(() => (o[defs[0].key] === 0 ? "" : shown(defs[0], o[defs[0].key] as number)));
  const fresh = useRef(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  function choose(i: number) {
    const d = defs[i];
    const v = o[d.key] as number;
    setActive(i);
    setBuf(v === 0 ? "" : shown(d, v));
    fresh.current = true;
  }

  function commit(next: string) {
    setBuf(next);
    setValue(def.key, Number(next || 0) / def.scale);
  }

  function press(k: string) {
    if (k === "clear") {
      fresh.current = false;
      return commit("");
    }
    if (k === "back") {
      fresh.current = false;
      return commit(buf.slice(0, -1));
    }
    const base = fresh.current ? "" : buf;
    let next = base + k;
    if (k === ".") {
      if (def.decimals === 0 || base.includes(".")) return;
      if (base === "") next = "0.";
    }
    const frac = next.split(".")[1];
    if (frac !== undefined && frac.length > def.decimals) return;
    if (next.length > 10) return;
    next = next.replace(/^0+(?=\d)/, "");
    if (Number(next) > def.max) return;
    fresh.current = false;
    commit(next);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape" || e.key === "Enter") {
      e.preventDefault();
      return close();
    }
    if (e.key === "Backspace") {
      e.preventDefault();
      return press("back");
    }
    if (/^[0-9.]$/.test(e.key)) {
      e.preventDefault();
      press(e.key);
    }
  }

  const months = o.months;

  return (
    <div className="sheet" role="dialog" aria-label={copy.title} ref={ref} tabIndex={-1} onKeyDown={onKeyDown}>
      <h3>{copy.title}</h3>
      <p>{copy.help}</p>

      {defs.length > 1 && (
        <div className="chips">
          {defs.map((d, i) => (
            <button key={d.key} type="button" className="chip" aria-pressed={i === active} onClick={() => choose(i)}>
              <span className="l">{en.fields[d.key]}</span>
              <span className="v num">
                {d.unit === "$" ? formatWhole(o[d.key] as number) : `${shown(d, o[d.key] as number)}%`}
              </span>
            </button>
          ))}
        </div>
      )}

      {box === "loan" && (
        <div className="stepper">
          <button type="button" aria-label={en.sheet.fewer} disabled={months <= 12} onClick={() => setValue("months", months - 12)}>
            &minus;
          </button>
          <span className="months num">
            {months} {en.sheet.months}
          </span>
          <button type="button" aria-label={en.sheet.moreMonths} disabled={months >= 96} onClick={() => setValue("months", months + 12)}>
            +
          </button>
        </div>
      )}

      <div className="entry">
        <span className="v num" aria-live="polite">
          {formatBuffer(buf, def)}
        </span>
        <span className="actions">
          <button type="button" className="btn" onClick={() => press("clear")}>
            {en.sheet.clear}
          </button>
          <button type="button" className="btn primary" onClick={close}>
            {en.sheet.done}
          </button>
        </span>
      </div>

      <div className="keys">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((k) => (
          <button key={k} type="button" className="num" onClick={() => press(k)}>
            {k}
          </button>
        ))}
        <button
          type="button"
          className="num"
          onClick={() => press(def.decimals > 0 ? "." : "000")}
          aria-label={def.decimals > 0 ? "Decimal point" : "Three zeros"}
        >
          {def.decimals > 0 ? "." : "000"}
        </button>
        <button type="button" className="num" onClick={() => press("0")}>
          0
        </button>
        <button type="button" className="fn" onClick={() => press("back")}>
          {en.sheet.back}
        </button>
      </div>
    </div>
  );
}

export function EntrySheet() {
  const openBox = useDeal((s) => s.openBox);
  const editing = useDeal((s) => s.editing);
  if (!openBox) return null;
  // Remount for a different box or offer so the keypad starts from the current value.
  return <Inner key={`${openBox}-${editing}`} box={openBox} />;
}
