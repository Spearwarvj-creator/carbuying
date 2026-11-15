import Link from "next/link";
import { Prefs } from "@/components/Prefs";
import { WalletIcon } from "@/components/ui/icons";
import { localePath, otherLocale, siteFor, type Locale } from "@/lib/site-locale";
import { LangLink } from "./LangLink";
import { SiteMenu } from "./SiteMenu";

export type SiteSection = "home" | "how" | "learn" | "about" | "privacy" | "terms" | "accessibility";

export function SiteHeader({ current, locale = "en", path = "/" }: { current?: SiteSection; locale?: Locale; path?: string }) {
  const site = siteFor(locale);
  const to = (p: string) => localePath(locale, p);
  const other = otherLocale(locale);
  return (
    <header className="s-head s-wrap">
      <Link href={to("/")} className="s-brand" aria-label={locale === "es" ? `${site.name}, inicio` : `${site.name}, home`}>
        <span className="brand-mark" aria-hidden="true">
          <WalletIcon size={18} />
        </span>
        {site.name}
      </Link>
      <nav className="s-nav" aria-label={site.nav.main}>
        <Link href={to("/how-it-works")} className="s-navlink" aria-current={current === "how" ? "page" : undefined}>
          {site.nav.how}
        </Link>
        <Link href={to("/learn")} className="s-navlink" aria-current={current === "learn" ? "page" : undefined}>
          {site.nav.learn}
        </Link>
        <Link href={to("/about")} className="s-navlink" aria-current={current === "about" ? "page" : undefined}>
          {site.nav.about}
        </Link>
        <LangLink href={localePath(other, path)} lang={other} className="s-navlink s-lang">
          {other === "es" ? "Español" : "English"}
        </LangLink>
        <span className="s-prefs">
          <Prefs />
        </span>
        <span className="s-menu">
          <SiteMenu calculator={false} locale={locale} path={path} />
        </span>
        <Link href={to("/deal")} className="s-btn s-btn-sm">
          <span className="s-long">{site.nav.open}</span>
          <span className="s-short">{site.nav.openShort}</span>
        </Link>
      </nav>
    </header>
  );
}
