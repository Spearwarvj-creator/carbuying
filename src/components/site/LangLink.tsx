"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { setLang, type Lang } from "@/lib/i18n";

/** The switch to the other language's version of this page. It saves the choice first, so the calculator follows. */
export function LangLink({ href, lang, className, children }: { href: string; lang: Lang; className?: string; children: ReactNode }) {
  return (
    <Link href={href} className={className} lang={lang} hrefLang={lang} onClick={() => void setLang(lang)}>
      {children}
    </Link>
  );
}
