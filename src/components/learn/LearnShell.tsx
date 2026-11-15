"use client";

import { LearnHub } from "@/components/learn/LearnHub";
import { SitePage } from "@/components/site/SitePage";
import { useLang } from "@/lib/i18n";

/** The Learn page's frame follows the language the reader picks, since the page changes language in place. */
export function LearnShell() {
  const lang = useLang();
  return (
    <SitePage current="learn" locale={lang} path="/learn">
      <LearnHub />
    </SitePage>
  );
}
