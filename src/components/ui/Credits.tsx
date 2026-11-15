"use client";

import { useState } from "react";
import { Btn } from "@/components/ui/Btn";
import { applyBoost, useCredits } from "@/lib/ai-status";
import { getLang } from "@/lib/i18n";
import { links } from "@/lib/links";
import { more } from "@/data/strings/more";

const c = more.credits;

/** How many free AI uses are left today. Shown only once the server has said, so it never shows a made-up number. */
export function CreditsLeft({ className = "hint" }: { className?: string }) {
  const credits = useCredits();
  if (!credits) return null;
  const share = credits.limit > 0 ? Math.max(0, Math.min(1, credits.left / credits.limit)) : 0;
  return (
    <div className="credits-meter">
      <p className={className}>{c.left(credits.left, credits.limit)}</p>
      <span className="credits-bar" aria-hidden="true">
        <i style={{ width: `${share * 100}%` }} />
      </span>
    </div>
  );
}

/** Where to reach us for more free uses: YouTube and email when they are set, the contact page otherwise. */
export function ContactLinks() {
  const items = [
    links.youtube && { href: links.youtube, label: c.youtube },
    links.email && { href: `mailto:${links.email}?subject=${encodeURIComponent("More AI uses for Deal Desk")}`, label: c.email },
  ].filter(Boolean) as { href: string; label: string }[];
  if (items.length === 0) items.push({ href: links.contact, label: c.contact });
  return (
    <ul className="contact-links">
      {items.map((i) => (
        <li key={i.href}>
          <a href={i.href} target="_blank" rel="noopener noreferrer">
            {i.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Shown when the day's free uses are gone: when they come back, what still works, how to ask for more, and a code box. */
export function LimitReached({ onApplied }: { onApplied?: () => void }) {
  const credits = useCredits();
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "ok" | "bad">("idle");
  const [limit, setLimit] = useState(0);
  const time = credits
    ? new Date(credits.resetsAt).toLocaleTimeString(getLang() === "es" ? "es-US" : "en-US", { hour: "numeric", minute: "2-digit" })
    : "";

  async function apply() {
    if (!code.trim()) return;
    setState("busy");
    const r = await applyBoost(code);
    setLimit(r.limit);
    setState(r.ok ? "ok" : "bad");
    if (r.ok) onApplied?.();
  }

  return (
    <div className="limit-card" role="status">
      <h3>{c.reachedTitle}</h3>
      <p>{c.reached(time)}</p>
      <p>{c.more}</p>
      <ContactLinks />
      <form
        className="limit-code"
        onSubmit={(e) => {
          e.preventDefault();
          void apply();
        }}
      >
        <label htmlFor="boost-code">{c.codeLabel}</label>
        <div>
          <input id="boost-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder={c.codePlaceholder} autoComplete="off" maxLength={40} />
          <Btn variant="ghost" type="submit" aria-disabled={state === "busy" || !code.trim()}>
            {state === "busy" ? c.applying : c.apply}
          </Btn>
        </div>
        {state === "ok" && <p className="hint">{c.codeOk(limit)}</p>}
        {state === "bad" && <p className="hint limit-bad">{c.codeBad}</p>}
      </form>
    </div>
  );
}
