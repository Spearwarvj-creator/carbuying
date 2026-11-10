import Link from "next/link";
import { Prefs } from "@/components/Prefs";
import { WalletIcon } from "@/components/ui/icons";
import { site } from "@/data/strings/site";
import { SiteMenu } from "./SiteMenu";

export type SiteSection = "home" | "how" | "about" | "privacy" | "terms" | "accessibility";

export function SiteHeader({ current }: { current?: SiteSection }) {
  return (
    <header className="s-head s-wrap">
      <Link href="/" className="s-brand" aria-label={`${site.name}, home`}>
        <span className="brand-mark" aria-hidden="true">
          <WalletIcon size={18} />
        </span>
        {site.name}
      </Link>
      <nav className="s-nav" aria-label={site.nav.main}>
        <Link href="/how-it-works" className="s-navlink" aria-current={current === "how" ? "page" : undefined}>
          {site.nav.how}
        </Link>
        <Link href="/about" className="s-navlink" aria-current={current === "about" ? "page" : undefined}>
          {site.nav.about}
        </Link>
        <span className="s-prefs">
          <Prefs />
        </span>
        <span className="s-menu">
          <SiteMenu calculator={false} />
        </span>
        <Link href="/deal" className="s-btn s-btn-sm">
          <span className="s-long">{site.nav.open}</span>
          <span className="s-short">{site.nav.openShort}</span>
        </Link>
      </nav>
    </header>
  );
}
