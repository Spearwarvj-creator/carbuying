"use client";

import Link from "next/link";
import { Prefs } from "@/components/Prefs";
import { SiteMenu } from "@/components/site/SiteMenu";
import { WalletIcon } from "@/components/ui/icons";
import { Segmented } from "@/components/ui/Segmented";
import { en } from "@/data/strings/en";
import { walk } from "@/data/strings/walk";
import { useLang } from "@/lib/i18n";
import { setMode, useMode } from "@/lib/mode";
import { localePath, siteFor } from "@/lib/site-locale";
import { openHelp } from "@/lib/onboarding";
import { more } from "@/data/strings/more";
import { InfoIcon } from "@/components/ui/icons";

/** The Walk and Desk switch. Both views edit the same numbers, so nothing is lost by switching. */
export function ModeSwitch() {
  const mode = useMode();
  const m = walk.mode;
  return (
    <Segmented
      variant="pill"
      label={m.label}
      value={mode}
      onChange={(v) => setMode(v)}
      options={[
        { value: "walk", label: m.walk },
        { value: "desk", label: m.desk },
      ]}
    />
  );
}

/**
 * One header for both views of the calculator, drawn like the site header: the same mark and name,
 * the same two links. On a phone the links and the screen switches move into the menu.
 */
export function AppHeader({ tag }: { tag?: string }) {
  const lang = useLang();
  const site = siteFor(lang);
  const to = (p: string) => localePath(lang, p);
  return (
    <header className="top">
      <Link href={to("/")} className="brand" aria-label={`${en.appName}, home page`}>
        <span className="brand-mark" aria-hidden="true">
          <WalletIcon size={18} />
        </span>
        {en.appName}
      </Link>
      <div className="top-mid">
        {tag && <span className="tag">{tag}</span>}
        <ModeSwitch />
      </div>
      <div className="top-end">
        <nav className="top-links" aria-label={site.nav.main}>
          <Link href={to("/how-it-works")}>{site.nav.how}</Link>
          <Link href={to("/learn")}>{site.nav.learn}</Link>
          <Link href={to("/about")}>{site.nav.about}</Link>
        </nav>
        <button type="button" className="top-help" onClick={openHelp} aria-label={more.guide.help} title={more.guide.help}>
          <InfoIcon size={20} />
          <span>{more.guide.help}</span>
        </button>
        <span className="top-prefs">
          <Prefs language />
        </span>
        <span className="top-menu">
          <SiteMenu language locale={lang} path="/deal" />
        </span>
      </div>
    </header>
  );
}
