"use client";

import { Popover } from "radix-ui";
import { Nums } from "@/components/Nums";
import { CloseIcon } from "@/components/ui/icons";

/**
 * The glossary as a cloud of words. Each word opens a small card with its meaning, so the page
 * stays short and the reader only opens what they do not know. Radix Popover gives the focus,
 * Escape and screen reader behaviour, and the card is the same one the Walk uses.
 */
export function WordChips({ items, closeLabel }: { items: readonly { k: string; v: string }[]; closeLabel: string }) {
  return (
    <ul className="i-chips">
      {items.map((w) => (
        <li key={w.k}>
          <Popover.Root>
            <Popover.Trigger className="i-chip">{w.k}</Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className="termcard" sideOffset={8} collisionPadding={12} align="start">
                <Popover.Close className="icon-btn termcard-x" aria-label={closeLabel}>
                  <CloseIcon size={18} />
                </Popover.Close>
                <h3 className="h">{w.k}</h3>
                <p className="p">
                  <Nums text={w.v} />
                </p>
                <Popover.Arrow className="termcard-arrow" width={16} height={8} />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </li>
      ))}
    </ul>
  );
}
