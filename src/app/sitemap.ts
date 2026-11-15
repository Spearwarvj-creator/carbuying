import type { MetadataRoute } from "next";
import { SPANISH_PAGES, localePath } from "@/lib/site-locale";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const PAGES = ["/", "/deal", "/how-it-works", "/learn", "/about", "/privacy", "/terms", "/accessibility"];

/** Every page, with its twin in the other language where one is written, so search engines pair them. */
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((p) => {
    const en = `${base}${localePath("en", p)}`;
    if (!SPANISH_PAGES.includes(p)) return [{ url: en }];
    const es = `${base}${localePath("es", p)}`;
    const languages = { en, es };
    return [
      { url: en, alternates: { languages } },
      { url: es, alternates: { languages } },
    ];
  });
}
