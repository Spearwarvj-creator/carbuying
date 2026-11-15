import Link from "next/link";
import { Prefs } from "@/components/Prefs";
import { localePath, siteFor, type Locale } from "@/lib/site-locale";

export function SiteFooter({ locale = "en" }: { locale?: Locale }) {
  const site = siteFor(locale);
  const f = site.footer;
  const to = (p: string) => localePath(locale, p);
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
                <Link href={to("/deal")}>{f.links.calculator}</Link>
              </li>
              <li>
                <Link href={to("/how-it-works")}>{f.links.how}</Link>
              </li>
              <li>
                <Link href={to("/learn")}>{f.links.learn}</Link>
              </li>
              <li>
                <Link href={to("/about")}>{f.links.about}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>{f.legal}</h2>
            <ul>
              <li>
                <Link href={to("/privacy")}>{f.links.privacy}</Link>
              </li>
              <li>
                <Link href={to("/terms")}>{f.links.terms}</Link>
              </li>
              <li>
                <Link href={to("/accessibility")}>{f.links.accessibility}</Link>
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
