import type { ReactNode } from "react";
import { Nums } from "@/components/Nums";
import { site } from "@/data/strings/site";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader, type SiteSection } from "./SiteHeader";

/** Shared frame for every page except the calculator, which keeps its own one-screen layout. */
export function SitePage({ current, children }: { current?: SiteSection; children: ReactNode }) {
  return (
    <div className="site">
      <a className="s-skip" href="#main">
        {site.nav.skip}
      </a>
      <SiteHeader current={current} />
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  );
}

/** A text page: title and contents on the left, sections on the right. Used for the legal pages and How it works. */
export function DocPage({
  current,
  title,
  lead,
  updated,
  contents,
  contentsLabel = "On this page",
  children,
}: {
  current: SiteSection;
  title: string;
  lead?: string;
  updated?: string;
  contents: { id: string; label: string }[];
  contentsLabel?: string;
  children: ReactNode;
}) {
  return (
    <SitePage current={current}>
      <div className="s-doc s-wrap">
        <aside className="s-doc-side">
          <h1 className="s-h1 s-h1-doc">{title}</h1>
          {lead && <p className="s-lead">{lead}</p>}
          {updated && (
            <p className="s-meta">
              <Nums text={updated} />
            </p>
          )}
          <nav aria-label={contentsLabel} className="s-toc">
            <h2>{contentsLabel}</h2>
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
