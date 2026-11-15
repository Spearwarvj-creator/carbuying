"use client";

import Link from "next/link";
import { NotFoundRow } from "@/components/site/NotFoundRow";
import { SitePage } from "@/components/site/SitePage";
import { siteEs } from "@/data/strings/site-es";

const t = siteEs.error;

/** La página que se muestra cuando algo falla al dibujar una página. Dice qué pasó y qué hacer. */
export default function ErrorEs({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <SitePage locale="es">
      <section className="nf s-wrap" aria-labelledby="err-h">
        <h1 id="err-h" className="nf-h">
          {t.h1}
        </h1>
        <p className="nf-lead">{t.lead}</p>
        <div className="nf-cta">
          <button type="button" className="s-btn s-btn-lg" onClick={reset}>
            {t.retry}
          </button>
          <Link href="/es" className="s-btn s-btn-ghost s-btn-lg">
            {t.home}
          </Link>
        </div>
        <NotFoundRow />
      </section>
    </SitePage>
  );
}
