import type { Metadata } from "next";
import Link from "next/link";
import { SitePage } from "@/components/site/SitePage";
import { ArrowIcon } from "@/components/ui/icons";
import { more } from "@/data/strings/more";

const t = more.offline;

export const metadata: Metadata = { title: t.title, robots: { index: false } };

/** Shown by the service worker when a page that was never opened is asked for without a signal. */
export default function Offline() {
  return (
    <SitePage>
      <section className="nf s-wrap" aria-labelledby="nf-h">
        <h1 id="nf-h" className="nf-h">
          {t.title}
        </h1>
        <p className="nf-lead">{t.body}</p>
        <div className="nf-cta">
          <Link href="/deal" className="s-btn s-btn-lg">
            {t.open}
            <ArrowIcon size={22} />
          </Link>
        </div>
      </section>
    </SitePage>
  );
}
