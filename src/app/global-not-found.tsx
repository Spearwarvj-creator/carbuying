import type { Metadata } from "next";
import Link from "next/link";
import { RootShell } from "@/components/site/RootShell";
import { NotFoundRow } from "@/components/site/NotFoundRow";
import { SitePage } from "@/components/site/SitePage";
import { ArrowIcon } from "@/components/ui/icons";
import { site } from "@/data/strings/site";
import { siteEs } from "@/data/strings/site-es";

export const metadata: Metadata = { title: "Page not found | Página no encontrada", robots: { index: false } };

/**
 * The page for an address that matches nothing. With two root layouts there is no single layout to build it from,
 * so it brings its own document, and says it in both languages because the address gives no hint of which is wanted.
 */
export default function GlobalNotFound() {
  return (
    <RootShell lang="en">
      <SitePage>
        <section className="nf s-wrap" aria-labelledby="nf-h">
          <h1 id="nf-h" className="nf-h">
            {site.notFound.h1}
          </h1>
          <p className="nf-lead">{site.notFound.lead}</p>
          <div className="nf-cta">
            <Link href="/deal" className="s-btn s-btn-lg">
              {site.notFound.primary}
              <ArrowIcon size={22} />
            </Link>
            <Link href="/" className="s-btn s-btn-ghost s-btn-lg">
              {site.notFound.secondary}
            </Link>
          </div>
          <p className="nf-lead" lang="es">
            {siteEs.notFound.h1} <Link href="/es">{siteEs.notFound.secondary}</Link>
          </p>
          <NotFoundRow />
        </section>
      </SitePage>
    </RootShell>
  );
}
