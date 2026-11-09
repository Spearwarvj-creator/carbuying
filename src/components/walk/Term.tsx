"use client";

import { Popover } from "radix-ui";
import type { ReactNode } from "react";
import { Nums } from "@/components/Nums";
import { CloseIcon } from "@/components/ui/icons";
import { TERMS, type TermKey } from "@/data/strings/terms";
import { walk } from "@/data/strings/walk";
import { useWalk } from "@/store/walk";

/**
 * A word the buyer can tap to learn. It opens a Radix Popover: placed beside the word, flipped or
 * shifted to stay on screen, closed by Escape or a tap outside, with focus returned to the word.
 * The card animates in from the side it opens on (see .termcard in walk.css).
 */
export function Term({ k, children }: { k: TermKey; children?: ReactNode }) {
  const t = TERMS[k];
  const markSeen = useWalk((s) => s.markSeen);

  return (
    <Popover.Root onOpenChange={(open) => open && markSeen(k)}>
      <Popover.Trigger className="term">{children ?? t.term}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="termcard" sideOffset={8} collisionPadding={12} align="start">
          <Popover.Close className="icon-btn termcard-x" aria-label={walk.term.close}>
            <CloseIcon size={18} />
          </Popover.Close>
          <h3 className="h">{t.plain}</h3>
          <p className="p was">
            On the paperwork: <b>{t.term}</b>
          </p>
          <p className="p">
            <Nums text={t.meaning} />
          </p>
          <p className="p ask">
            <b>{walk.term.ask}</b> {t.ask}
          </p>
          <Popover.Arrow className="termcard-arrow" width={16} height={8} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
