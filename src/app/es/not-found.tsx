import type { Metadata } from "next";
import Link from "next/link";
import { NotFoundRow } from "@/components/site/NotFoundRow";
import { SitePage } from "@/components/site/SitePage";
import { ArrowIcon } from "@/components/ui/icons";
import { siteEs } from "@/data/strings/site-es";

const t = siteEs.notFound;

export const metadata: Metadata = { title: t.title, robots: { index: false } };

/** La página propia del sitio para un enlace con error: muestra el encabezado, una salida y la calculadora. */
export default function NoEncontrada() {
  return (
    <SitePage locale="es">
      <section className="nf s-wrap" aria-labelledby="nf-h">
        <h1 id="nf-h" className="nf-h">
          {t.h1}
        </h1>
        <p className="nf-lead">{t.lead}</p>
        <div className="nf-cta">
          <Link href="/deal" className="s-btn s-btn-lg">
            {t.primary}
            <ArrowIcon size={22} />
          </Link>
          <Link href="/es" className="s-btn s-btn-ghost s-btn-lg">
            {t.secondary}
          </Link>
        </div>
        <NotFoundRow />
      </section>
    </SitePage>
  );
}
