"use client";

import { useState } from "react";
import { Btn } from "@/components/ui/Btn";
import { ai } from "@/data/strings/ai";
import type { Offer } from "@/engine";
import { clearDeal, saveDeal } from "@/lib/saved";

const s = ai.saved;

/** Saves the deal in this browser only, when the buyer asks. It can be deleted again. */
export function SaveDeal({ offer, quotedPay }: { offer: Offer; quotedPay: number }) {
  const [state, setState] = useState<"idle" | "saved" | "failed">("idle");
  return (
    <div className="savebox">
      {state === "saved" ? (
        <>
          <p role="status">{s.done}</p>
          <Btn
            variant="quiet"
            onClick={() => {
              clearDeal();
              setState("idle");
            }}
          >
            {s.clear}
          </Btn>
        </>
      ) : (
        <Btn variant="ghost" onClick={() => setState(saveDeal(offer, quotedPay) ? "saved" : "failed")}>
          {s.save}
        </Btn>
      )}
      <p className="hint">{state === "failed" ? "This browser would not save it." : s.note}</p>
    </div>
  );
}
