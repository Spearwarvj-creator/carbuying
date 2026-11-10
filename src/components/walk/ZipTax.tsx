"use client";

import { useState } from "react";
import { Btn } from "@/components/ui/Btn";
import { ai } from "@/data/strings/ai";
import { STATE_SALES_TAX } from "@/data/state-tax";
import { lookupZip } from "@/lib/zip";

const z = ai.zip;

/**
 * An optional ZIP code that suggests the state's sales tax as a starting point. The lookup table is part of the
 * page, so the ZIP code never leaves the device. It is only a suggestion: the buyer confirms the rate from the
 * worksheet, and the text says a city or county can add to it.
 */
export function ZipTax({ onUse }: { onUse: (percent: number) => void }) {
  const [zip, setZip] = useState("");
  const [found, setFound] = useState<{ state: string; rate: number } | null>(null);
  const [miss, setMiss] = useState(false);

  async function change(v: string) {
    const clean = v.replace(/\D/g, "").slice(0, 5);
    setZip(clean);
    setFound(null);
    setMiss(false);
    if (clean.length === 5) {
      const place = await lookupZip(clean);
      const rate = place ? STATE_SALES_TAX[place.state] : undefined;
      if (place && rate !== undefined) setFound({ state: place.state, rate });
      else setMiss(true);
    }
  }

  return (
    <div className="zipbox">
      <label htmlFor="zip-in">{z.label}</label>
      <input id="zip-in" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={zip} onChange={(e) => void change(e.target.value)} aria-describedby="zip-h" placeholder="12345" />
      <p id="zip-h" className="hint" role="status">
        {found ? z.suggest(found.state, found.rate) : miss ? z.none : z.hint}
      </p>
      {found && found.rate > 0 && (
        <Btn variant="ghost" onClick={() => onUse(found.rate)}>
          {z.use(found.rate)}
        </Btn>
      )}
    </div>
  );
}
