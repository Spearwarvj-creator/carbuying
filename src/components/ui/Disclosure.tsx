"use client";

import { Collapsible } from "radix-ui";
import { useState, type ReactNode } from "react";
import { ChevronIcon } from "./icons";

/**
 * A section that opens and closes with a height animation. Radix Collapsible supplies the
 * measured height as a CSS variable, so the panel grows to its real size with no JavaScript
 * animation code. A chevron turns to show the state.
 */
export function Disclosure({ title, children, className }: { title: ReactNode; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className={`disc${className ? ` ${className}` : ""}`}>
      <Collapsible.Trigger className="disc-trigger">
        <span>{title}</span>
        <ChevronIcon size={20} className="disc-chev" />
      </Collapsible.Trigger>
      <Collapsible.Content className="disc-content">
        <div className="disc-inner">{children}</div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
