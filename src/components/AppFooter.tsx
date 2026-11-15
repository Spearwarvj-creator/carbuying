"use client";

import Link from "next/link";
import { en } from "@/data/strings/en";
import { useLang } from "@/lib/i18n";
import { localePath, siteFor } from "@/lib/site-locale";

/** A slim footer for the calculator: the legal pages and the reminder that this is an estimate. */
export function AppFooter() {
  const lang = useLang();
  const site = siteFor(lang);
  const f = site.footer.links;
  const to = (p: string) => localePath(lang, p);
  return (
    <footer className="app-foot">
      <nav aria-label={site.nav.footer}>
        <Link href={to("/privacy")}>{f.privacy}</Link>
        <Link href={to("/terms")}>{f.terms}</Link>
        <Link href={to("/accessibility")}>{f.accessibility}</Link>
        <Link href={to("/learn")}>{f.learn}</Link>
        <Link href={to("/how-it-works")}>{f.how}</Link>
      </nav>
      <p>{en.note}</p>
    </footer>
  );
}
