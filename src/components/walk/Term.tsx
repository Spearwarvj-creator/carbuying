"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import { Nums } from "@/components/Nums";
import { TERMS, type TermKey } from "@/data/strings/terms";
import { walk } from "@/data/strings/walk";
import { useWalk } from "@/store/walk";

/**
 * A word the buyer can tap to learn. Opens a real popover (the Popover API is Baseline), placed
 * beside the word with anchor positioning where the browser has it, and as a card at the bottom
 * of the screen otherwise and on phones. Light dismiss, Escape and focus return come with the API.
 */
export function Term({ k, children }: { k: TermKey; children?: ReactNode }) {
  const t = TERMS[k];
  const uid = useId().replace(/:/g, "");
  const id = `term-${k}-${uid}`;
  const anchor = `--a-${k}-${uid}`;
  const markSeen = useWalk((s) => s.markSeen);

  return (
    <>
      <button
        type="button"
        className="term"
        // anchor-name and position-anchor tie the card to this word
        style={{ anchorName: anchor } as CSSProperties}
        popoverTarget={id}
        aria-haspopup="dialog"
      >
        {children ?? t.term}
      </button>
      <span
        id={id}
        popover="auto"
        role="dialog"
        aria-labelledby={`${id}-h`}
        className="termcard"
        style={{ positionAnchor: anchor } as CSSProperties}
        onToggle={(e) => {
          if ((e as unknown as { newState?: string }).newState === "open") markSeen(k);
        }}
      >
        <strong id={`${id}-h`} role="heading" aria-level={3} className="h">
          {t.plain}
        </strong>
        <span className="p was">
          On the paperwork: <b>{t.term}</b>
        </span>
        <span className="p">
          <Nums text={t.meaning} />
        </span>
        <span className="p ask">
          <b>{walk.term.ask}</b> {t.ask}
        </span>
        <button type="button" className="btn" popoverTarget={id} popoverTargetAction="hide">
          {walk.term.close}
        </button>
      </span>
    </>
  );
}
