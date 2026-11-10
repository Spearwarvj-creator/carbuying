"use client";

import Link from "next/link";
import { Prefs } from "@/components/Prefs";
import { SiteMenu } from "@/components/site/SiteMenu";
import { WalletIcon } from "@/components/ui/icons";
import { Segmented } from "@/components/ui/Segmented";
import { en } from "@/data/strings/en";
import { site } from "@/data/strings/site";
import { walk } from "@/data/strings/walk";
import { setMode, useMode } from "@/lib/mode";

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
  return (
    <header className="top">
      <Link href="/" className="brand" aria-label={`${en.appName}, home page`}>
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
          <Link href="/how-it-works">{site.nav.how}</Link>
          <Link href="/about">{site.nav.about}</Link>
        </nav>
        <span className="top-prefs">
          <Prefs language />
        </span>
        <span className="top-menu">
          <SiteMenu language />
        </span>
      </div>
    </header>
  );
}
