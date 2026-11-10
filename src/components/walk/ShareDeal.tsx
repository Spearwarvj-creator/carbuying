"use client";

import { useState } from "react";
import { Btn } from "@/components/ui/Btn";
import { ai } from "@/data/strings/ai";
import { encodeDeal } from "@/engine";
import { useDeal } from "@/store/deal";

const s = ai.share;

/**
 * Copies a link that carries the deal in the part of the address after the # sign. Browsers do not send that part to
 * any server, so the numbers stay between the two people. On a phone it opens the share sheet where there is one.
 */
export function ShareDeal() {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const [link, setLink] = useState("");
  async function share() {
    const { offers, vehicle, names } = useDeal.getState();
    const two = JSON.stringify(offers[0]) !== JSON.stringify(offers[1]) && offers[1].price > 0;
    const fragment = await encodeDeal({
      v: 1,
      offers: two ? [offers[0], offers[1]] : [offers[0]],
      labels: two ? names.map((n) => n.trim()).slice(0, 2) : [],
      vehicle: vehicle ? { year: vehicle.year, make: vehicle.make, model: vehicle.model, trim: vehicle.trim } : undefined,
    });
    const url = `${location.origin}/deal#${fragment}`;
    setLink(url);
    try {
      if (navigator.share) await navigator.share({ title: "Deal Desk", url });
      else await navigator.clipboard.writeText(url);
      setState("copied");
    } catch (e) {
      // Closing the share sheet is not a failure.
      setState(e instanceof DOMException && e.name === "AbortError" ? "idle" : "failed");
    }
  }
  return (
    <div className="savebox">
      <Btn variant="ghost" onClick={() => void share()}>
        {state === "copied" ? s.copied : s.button}
      </Btn>
      <p className="hint" role="status">{state === "failed" ? s.failed : s.note}</p>
      {state === "failed" && link && (
        <input className="vf-input" readOnly value={link} aria-label={s.button} onFocus={(e) => e.currentTarget.select()} />
      )}
    </div>
  );
}
