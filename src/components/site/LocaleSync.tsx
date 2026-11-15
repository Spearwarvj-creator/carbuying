"use client";

import { useEffect } from "react";
import { setLang, type Lang } from "@/lib/i18n";

/**
 * Spanish pages are written in Spanish on the server, so search engines and screen readers get Spanish from the
 * first byte. The shared pieces inside them, such as the calculator and the pictures, take their words from the
 * language store, so this puts the store in Spanish when the page opens and they draw again. Coming to a /es page
 * also saves Spanish as the choice, so the calculator opens in Spanish.
 */
export function LocaleSync({ lang }: { lang: Lang }) {
  useEffect(() => {
    void setLang(lang);
  }, [lang]);
  return null;
}
