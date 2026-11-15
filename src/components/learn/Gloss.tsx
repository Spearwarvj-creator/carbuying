"use client";

import Link from "next/link";
import { Popover } from "radix-ui";
import { useMemo, type ReactNode } from "react";
import { Nums } from "@/components/Nums";
import { CloseIcon } from "@/components/ui/icons";
import { UI_EN, UI_ES } from "@/data/learn/ui";
import { segment } from "@/lib/learn/gloss";
import { mineLine } from "@/lib/learn/mine";
import { useDictionary, useMyOffer } from "@/lib/learn/use-dictionary";
import { Art } from "./Art";

/**
 * A car-buying word the reader can tap. It opens a small card with the plain meaning, an everyday picture and sentence,
 * the buyer's own figure when a deal is open, and a link to the full entry in the Learn hub. Used on the Desk, the
 * results and the checks, so the words are explained where they are met, not only in the Walk.
 */
export function Gloss({ id, children }: { id: string; children?: ReactNode }) {
  const dict = useDictionary();
  const offer = useMyOffer();
  const t = dict.byId.get(id);
  const ui = dict.lang === "es" ? UI_ES : UI_EN;
  if (!t) return <>{children}</>;
  const mine = mineLine(id, offer, dict.lang);
  return (
    <Popover.Root>
      <Popover.Trigger className="term">{children ?? t.term}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="termcard gcard" sideOffset={8} collisionPadding={12} align="start">
          <Popover.Close className="icon-btn termcard-x" aria-label={ui.popover.close}>
            <CloseIcon size={18} />
          </Popover.Close>
          <h3 className="h">{t.plain}</h3>
          <p className="p was">
            <b>{t.term}</b>
          </p>
          <div className="gcard-row">
            <div className="gcard-art">
              <Art k={t.art} />
            </div>
            <p className="p gcard-daily">{t.daily}</p>
          </div>
          <p className="p">{t.meaning}</p>
          {mine && (
            <p className="p gcard-mine">
              <b>{ui.popover.inDeal}.</b> <Nums text={mine} />
            </p>
          )}
          <p className="p ask">
            <b>{ui.ask}:</b> {t.ask}
          </p>
          <p className="p">
            <Link href={`/learn#${id}`} className="link">
              {ui.popover.learn}
            </Link>
          </p>
          <Popover.Arrow className="termcard-arrow" width={16} height={8} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/**
 * Text with its car-buying words made tappable. Each word is marked once, the first time it appears. It only reads the
 * text; it never changes a word or a figure.
 */
export function AutoGloss({ text, once = true }: { text: string; once?: boolean }) {
  const dict = useDictionary();
  const pieces = useMemo(() => segment(text, dict.entries, once), [text, dict.entries, once]);
  return (
    <>
      {pieces.map((p, i) =>
        p.id ? (
          <Gloss key={i} id={p.id}>
            {p.text}
          </Gloss>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}
