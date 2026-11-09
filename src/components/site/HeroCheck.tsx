"use client";

import { useRouter } from "next/navigation";
import { site } from "@/data/strings/site";
import { setMode } from "@/lib/mode";
import { useDeal } from "@/store/deal";
import { useWalk } from "@/store/walk";
import { TenSecondCheck } from "@/components/walk/Check";

/**
 * The landing page's main interaction: two numbers the dealer already said, one fact back.
 * "See where the money goes" opens the Walk on its first step with those numbers carried over.
 */
export function HeroCheck() {
  const router = useRouter();
  return (
    <section className="s-readout" aria-labelledby="check-h">
      <h2 id="check-h" className="s-readout-h">
        {site.home.checkHeading}
      </h2>
      <TenSecondCheck
        showDown={false}
        onContinue={(v) => {
          useDeal.getState().startQuote();
          useDeal.setState((s) => ({ offers: [{ ...s.offers[0], months: v.months }, s.offers[1]] }));
          const walk = useWalk.getState();
          walk.reset();
          walk.setQuote(v.pay, v.months, 0);
          walk.setStartedWith("payment");
          walk.go("stage", 1);
          setMode("walk");
          router.push("/deal");
        }}
      />
    </section>
  );
}
