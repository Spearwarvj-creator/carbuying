import Link from "next/link";
import { en } from "@/data/strings/en";
import { site } from "@/data/strings/site";

const f = site.footer.links;

/** A slim footer for the calculator: the legal pages and the reminder that this is an estimate. */
export function AppFooter() {
  return (
    <footer className="app-foot">
      <nav aria-label={site.nav.footer}>
        <Link href="/privacy">{f.privacy}</Link>
        <Link href="/terms">{f.terms}</Link>
        <Link href="/accessibility">{f.accessibility}</Link>
        <Link href="/how-it-works">{f.how}</Link>
      </nav>
      <p>{en.note}</p>
    </footer>
  );
}
