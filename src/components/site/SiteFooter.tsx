import Link from "next/link";
import { Prefs } from "@/components/Prefs";
import { site } from "@/data/strings/site";

const f = site.footer;

export function SiteFooter() {
  return (
    <footer className="s-foot s-wrap">
      <div className="s-foot-top">
        <div className="s-foot-lead">
          <p className="s-foot-brand">{site.name}</p>
          <p className="s-foot-blurb">{f.blurb}</p>
        </div>
        <nav className="s-foot-cols" aria-label={site.nav.footer}>
          <div>
            <h2>{f.pages}</h2>
            <ul>
              <li>
                <Link href="/deal">{f.links.calculator}</Link>
              </li>
              <li>
                <Link href="/how-it-works">{f.links.how}</Link>
              </li>
              <li>
                <Link href="/about">{f.links.about}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>{f.legal}</h2>
            <ul>
              <li>
                <Link href="/privacy">{f.links.privacy}</Link>
              </li>
              <li>
                <Link href="/terms">{f.links.terms}</Link>
              </li>
              <li>
                <Link href="/accessibility">{f.links.accessibility}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>{f.screen}</h2>
            <Prefs />
          </div>
        </nav>
      </div>
      <div className="s-foot-base">
        <p>{f.note}</p>
        <p>{f.project}</p>
      </div>
    </footer>
  );
}
