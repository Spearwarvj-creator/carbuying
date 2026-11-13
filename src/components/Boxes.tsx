"use client";

import { useState } from "react";
import { en } from "@/data/strings/en";
import { formatWhole, type Offer } from "@/engine";
import { more } from "@/data/strings/more";
import { ai } from "@/data/strings/ai";
import { offerName, useDeal, type BoxKey } from "@/store/deal";
import { BOX_ORDER } from "./field-config";
import { QuickFill } from "./walk/QuickFill";
import { LeaseCheck } from "./walk/LeaseCheck";
import { VehicleFinder } from "./walk/VehicleFinder";
import { walk } from "@/data/strings/walk";

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
  const names = useDeal((s) => s.names);
  const setName = useDeal((s) => s.setName);
  const [renaming, setRenaming] = useState(false);
  const o = offers[editing];

  return (
    <>
      <div className="editing">
        <span className="label">{en.editing}</span>
        <div className="seg" role="group" aria-label={en.editing}>
          <button type="button" aria-pressed={editing === 0} onClick={() => setEditing(0)}>
            {offerName(names, 0)}
          </button>
          <button type="button" aria-pressed={editing === 1} onClick={() => setEditing(1)}>
            {offerName(names, 1)}
          </button>
        </div>
        <QuickFill
          target="desk"
          trigger={
            <button type="button" className="link">
              {walk.quick.openShort}
            </button>
          }
        />
        <button type="button" className="link" aria-expanded={renaming} onClick={() => setRenaming((r) => !r)}>
          {more.names.rename}
        </button>
        <VehicleFinder
          trigger={
            <button type="button" className="link">
              {ai.finder.openShort}
            </button>
          }
        />
        <LeaseCheck
          trigger={
            <button type="button" className="link">
              {more.lease.open}
            </button>
          }
        />
        <span className="spacer" />
        <button type="button" className="link" onClick={example ? startMine : seeExample}>
          {example ? en.useMine : en.seeExample}
        </button>
      </div>
      {renaming && (
        <div className="namebox">
          <label htmlFor="offer-name">{more.names.label}</label>
          <input
            id="offer-name"
            type="text"
            maxLength={40}
            autoFocus
            autoComplete="off"
            value={names[editing]}
            placeholder={offerName(["", ""], editing)}
            onChange={(e) => setName(editing, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") setRenaming(false);
            }}
            aria-describedby="offer-name-h"
          />
          <p className="hint" id="offer-name-h">
            {more.names.hint}
          </p>
        </div>
      )}
      <div className="fields" data-tour="offers">
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
