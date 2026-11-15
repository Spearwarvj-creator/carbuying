"use client";

import Link from "next/link";
import { NotFoundRow } from "@/components/site/NotFoundRow";
import { SitePage } from "@/components/site/SitePage";
import { site } from "@/data/strings/site";

const t = site.error;

/** The page shown when something breaks while a page renders. It says what happened and what to do. */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <SitePage>
      <section className="nf s-wrap" aria-labelledby="err-h">
        <h1 id="err-h" className="nf-h">
          {t.h1}
        </h1>
        <p className="nf-lead">{t.lead}</p>
        <div className="nf-cta">
          <button type="button" className="s-btn s-btn-lg" onClick={reset}>
            {t.retry}
          </button>
          <Link href="/" className="s-btn s-btn-ghost s-btn-lg">
            {t.home}
          </Link>
        </div>
        <NotFoundRow />
      </section>
    </SitePage>
  );
}
