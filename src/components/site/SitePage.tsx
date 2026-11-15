import type { ReactNode } from "react";
import { Nums } from "@/components/Nums";
import { siteFor, type Locale } from "@/lib/site-locale";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader, type SiteSection } from "./SiteHeader";

/**
 * Shared frame for every page except the calculator, which keeps its own one-screen layout. `path` is the page's
 * English address, so the header can link to the same page in the other language.
 */
export function SitePage({ current, locale = "en", path = "/", children }: { current?: SiteSection; locale?: Locale; path?: string; children: ReactNode }) {
  const site = siteFor(locale);
  return (
    <div className="site">
      <a className="s-skip" href="#main">
        {site.nav.skip}
      </a>
      <SiteHeader current={current} locale={locale} path={path} />
      <main id="main">{children}</main>
      <SiteFooter locale={locale} />
    </div>
  );
}

/** A text page: title and contents on the left, sections on the right. Used for the legal pages and How it works. */
export function DocPage({
  current,
  locale = "en",
  path,
  title,
  lead,
  updated,
  contents,
  contentsLabel,
  children,
}: {
  current: SiteSection;
  locale?: Locale;
  path: string;
  title: string;
  lead?: string;
  updated?: string;
  contents: { id: string; label: string }[];
  contentsLabel?: string;
  children: ReactNode;
}) {
  const label = contentsLabel ?? (locale === "es" ? "En esta página" : "On this page");
  return (
    <SitePage current={current} locale={locale} path={path}>
      <div className="s-doc s-wrap">
        <aside className="s-doc-side">
          <h1 className="s-h1 s-h1-doc">{title}</h1>
          {lead && <p className="s-lead">{lead}</p>}
          {updated && (
            <p className="s-meta">
              <Nums text={updated} />
            </p>
          )}
          <nav aria-label={label} className="s-toc">
            <h2>{label}</h2>
            <ul>
              {contents.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`}>{c.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div className="s-doc-body">{children}</div>
      </div>
    </SitePage>
  );
}

/** A picture-first page: a short title block, then chapters that each carry one graphic. Used by How it works and About. */
export function InfoPage({ current, locale = "en", path, title, lead, children }: { current: SiteSection; locale?: Locale; path: string; title: string; lead: string; children: ReactNode }) {
  return (
    <SitePage current={current} locale={locale} path={path}>
      <header className="pg-head s-wrap">
        <h1 className="pg-h1">{title}</h1>
        <p className="pg-lead">{lead}</p>
      </header>
      {children}
    </SitePage>
  );
}
