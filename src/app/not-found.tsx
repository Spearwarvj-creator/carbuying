import type { Metadata } from "next";
import Link from "next/link";
import { NotFoundRow } from "@/components/site/NotFoundRow";
import { SitePage } from "@/components/site/SitePage";
import { ArrowIcon } from "@/components/ui/icons";
import { site } from "@/data/strings/site";

const t = site.notFound;

export const metadata: Metadata = { title: t.title, robots: { index: false } };

/** A page of the site's own, so a mistyped link still shows the header, a way home and the calculator. */
export default function NotFound() {
  return (
    <SitePage>
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
          <Link href="/" className="s-btn s-btn-ghost s-btn-lg">
            {t.secondary}
          </Link>
        </div>
        <NotFoundRow />
      </section>
    </SitePage>
  );
}
