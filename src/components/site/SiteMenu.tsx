"use client";

import { Popover } from "radix-ui";
import Link from "next/link";
import { Prefs } from "@/components/Prefs";
import { MenuIcon } from "@/components/ui/icons";
import { site } from "@/data/strings/site";

const f = site.footer.links;

/**
 * The menu for narrow screens. The header has no room for four links, so they live here, with the
 * legal pages and the text size and screen switches. Radix Popover gives the focus handling,
 * Escape to close and the return of focus to the button. On wide screens the header shows the links itself.
 */
export function SiteMenu({ calculator = true }: { calculator?: boolean }) {
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
                  <Link href="/deal">{f.calculator}</Link>
                </li>
              )}
              <li>
                <Link href="/how-it-works">{f.how}</Link>
              </li>
              <li>
                <Link href="/about">{f.about}</Link>
              </li>
            </ul>
            <ul className="menu-list menu-legal">
              <li>
                <Link href="/privacy">{f.privacy}</Link>
              </li>
              <li>
                <Link href="/terms">{f.terms}</Link>
              </li>
              <li>
                <Link href="/accessibility">{f.accessibility}</Link>
              </li>
            </ul>
          </nav>
          <div className="menu-prefs">
            <Prefs />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
