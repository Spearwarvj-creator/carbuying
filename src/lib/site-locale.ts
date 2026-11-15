import { site, type SiteCopy } from "@/data/strings/site";
import { siteEs } from "@/data/strings/site-es";

/** The two languages the site pages are written in. English lives at the root, Spanish under /es. */
export type Locale = "en" | "es";

export function siteFor(locale: Locale): SiteCopy {
  return locale === "es" ? siteEs : site;
}

/**
 * The pages that are written out in Spanish under /es. The calculator and the Learn page are not on this list: they
 * change language in place, so one address serves both and the choice is kept on the device.
 */
export const SPANISH_PAGES = ["/", "/how-it-works", "/about", "/privacy", "/terms", "/accessibility"];

/** A site path in a language: "/about" stays "/about" in English and becomes "/es/about" in Spanish. */
export function localePath(locale: Locale, path: string): string {
  if (locale === "en" || !SPANISH_PAGES.includes(path)) return path;
  return path === "/" ? "/es" : `/es${path}`;
}

export const otherLocale = (locale: Locale): Locale => (locale === "es" ? "en" : "es");

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * The page's own address and its twin in the other language, for search engines (hreflang). English is the default
 * for anyone whose language is not Spanish.
 */
export function alternates(locale: Locale, path: string) {
  return {
    canonical: `${SITE_URL}${localePath(locale, path)}`,
    languages: {
      en: `${SITE_URL}${localePath("en", path)}`,
      es: `${SITE_URL}${localePath("es", path)}`,
      "x-default": `${SITE_URL}${localePath("en", path)}`,
    },
  };
}
