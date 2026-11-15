"use client";

import { Popover } from "radix-ui";
import { more } from "@/data/strings/more";
import { openHelp } from "@/lib/onboarding";
import Link from "next/link";
import { Prefs } from "@/components/Prefs";
import { MenuIcon } from "@/components/ui/icons";
import { localePath, otherLocale, siteFor, type Locale } from "@/lib/site-locale";
import { LangLink } from "./LangLink";

/**
 * The menu for narrow screens. The header has no room for four links, so they live here, with the
 * legal pages and the text size and screen switches. Radix Popover gives the focus handling,
 * Escape to close and the return of focus to the button. On wide screens the header shows the links itself.
 */
export function SiteMenu({ calculator = true, language = false, locale = "en", path = "/" }: { calculator?: boolean; language?: boolean; locale?: Locale; path?: string }) {
  const site = siteFor(locale);
  const f = site.footer.links;
  const to = (p: string) => localePath(locale, p);
  const other = otherLocale(locale);
  return (
    <Popover.Root>
      <Popover.Trigger className="menu-btn" aria-label={site.nav.menu}>
        <MenuIcon size={22} />
        <span className="menu-txt">{site.nav.menu}</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="menu-pop" align="end" sideOffset={8} collisionPadding={12} aria-label={site.nav.menuLabel}>
          <nav aria-label={site.nav.menuLabel}>
            <ul className="menu-list">
              {calculator && (
                <li>
                  <Link href={to("/deal")}>{f.calculator}</Link>
                </li>
              )}
              <li>
                <Link href={to("/how-it-works")}>{f.how}</Link>
              </li>
              <li>
                <Link href={to("/learn")}>{f.learn}</Link>
              </li>
              <li>
                <Link href={to("/about")}>{f.about}</Link>
              </li>
              {!language && (
                <li>
                  <LangLink href={localePath(other, path)} lang={other}>
                    {other === "es" ? "Español" : "English"}
                  </LangLink>
                </li>
              )}
            </ul>
            {language && (
              <ul className="menu-list">
                <li>
                  <Popover.Close asChild>
                    <button type="button" className="menu-help" onClick={openHelp}>
                      {more.guide.help}
                    </button>
                  </Popover.Close>
                </li>
              </ul>
            )}
            <ul className="menu-list menu-legal">
              <li>
                <Link href={to("/privacy")}>{f.privacy}</Link>
              </li>
              <li>
                <Link href={to("/terms")}>{f.terms}</Link>
              </li>
              <li>
                <Link href={to("/accessibility")}>{f.accessibility}</Link>
              </li>
            </ul>
          </nav>
          <div className="menu-prefs">
            <Prefs language={language} />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
