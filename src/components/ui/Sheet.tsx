"use client";

import { Dialog } from "radix-ui";
import type { ReactNode } from "react";
import { CloseIcon } from "./icons";

/**
 * A panel that slides up from the bottom on a phone and sits as a card on a wide screen. Radix
 * Dialog gives it the focus trap, Escape to close, scroll lock and a focus return to the button.
 */
export function Sheet({
  trigger,
  title,
  children,
  closeLabel,
}: {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  closeLabel: string;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay" />
        <Dialog.Content className="sheet" aria-describedby={undefined}>
          <div className="sheet-head">
            <Dialog.Title className="sheet-title">{title}</Dialog.Title>
            <Dialog.Close className="icon-btn" aria-label={closeLabel}>
              <CloseIcon size={20} />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
