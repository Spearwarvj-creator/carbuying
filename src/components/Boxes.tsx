"use client";

import { en } from "@/data/strings/en";
import { formatWhole, type Offer } from "@/engine";
import { useDeal, type BoxKey } from "@/store/deal";
import { BOX_ORDER } from "./field-config";

function boxValue(box: BoxKey, o: Offer): string {
  switch (box) {
    case "price":
      return o.price > 0 ? formatWhole(o.price) : "$—";
    case "fees":
      return formatWhole(o.fees + o.addons);
    case "down":
      return formatWhole(o.down);
    case "loan":
      return o.price > 0 || o.apr > 0 ? `${o.apr}% · ${o.months} mo` : `— · ${o.months} mo`;
  }
}

export function Boxes() {
  const offers = useDeal((s) => s.offers);
  const editing = useDeal((s) => s.editing);
  const openBox = useDeal((s) => s.openBox);
  const open = useDeal((s) => s.open);
  const setEditing = useDeal((s) => s.setEditing);
  const example = useDeal((s) => s.example);
  const startMine = useDeal((s) => s.useMine);
  const seeExample = useDeal((s) => s.seeExample);
  const o = offers[editing];

  return (
    <>
      <div className="editing">
        <span className="label">{en.editing}</span>
        <div className="seg" role="group" aria-label={en.editing}>
          <button type="button" aria-pressed={editing === 0} onClick={() => setEditing(0)}>
            {en.offer1}
          </button>
          <button type="button" aria-pressed={editing === 1} onClick={() => setEditing(1)}>
            {en.offer2}
          </button>
        </div>
        <span className="spacer" />
        <button type="button" className="link" onClick={example ? startMine : seeExample}>
          {example ? en.useMine : en.seeExample}
        </button>
      </div>
      <div className="fields">
        {BOX_ORDER.map((box) => (
          <button
            key={box}
            type="button"
            className="field"
            aria-expanded={openBox === box}
            aria-haspopup="dialog"
            onClick={() => open(box)}
          >
            <span className="l">{en.boxes[box].label}</span>
            <span className="v num">{boxValue(box, o)}</span>
          </button>
        ))}
      </div>
    </>
  );
}
