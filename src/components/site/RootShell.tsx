import type { ReactNode } from "react";
import "@fontsource/atkinson-hyperlegible-next/400.css";
import "@fontsource/atkinson-hyperlegible-next/600.css";
import "@fontsource/atkinson-hyperlegible-next/700.css";
import "@fontsource/sofia-sans-extra-condensed/700.css";
import "@fontsource/sofia-sans-extra-condensed/800.css";
import "@/app/globals.css";
import "@/app/site.css";
import "@/app/walk.css";
import "@/app/learn.css";
import { Providers } from "@/components/ui/Providers";
import { RegisterSW } from "@/components/RegisterSW";
import type { Locale } from "@/lib/site-locale";

// Applies the saved text size and screen choice before the first paint, so the page never flashes.
const prefsScript = `try{var d=document.documentElement,s=localStorage;if(s.getItem("dd-text")==="large")d.dataset.text="large";if(s.getItem("dd-theme")==="light")d.dataset.theme="light"}catch(e){}`;

const NO_SCRIPT = {
  en: "Deal Desk needs JavaScript to run the calculator. The guides on this site still read without it.",
  es: "Deal Desk necesita JavaScript para ejecutar la calculadora. Las guías de este sitio se pueden leer sin él.",
} as const;

/**
 * The document around every page. The site has two root layouts, one for English and one for Spanish, so each page
 * carries the right <html lang> from the first byte: screen readers pick the right voice and search engines file the
 * page under the right language.
 */
export function RootShell({ lang, children }: { lang: Locale; children: ReactNode }) {
  return (
    <html lang={lang} suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-head-element -- this is the root document of each layout, where a <head> is how the app router adds the first-paint script */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsScript }} />
      </head>
      <body>
        <noscript>
          <p style={{ margin: 0, padding: "12px 16px", background: "#f5c400", color: "#12161c", fontFamily: "sans-serif", fontWeight: 700 }}>{NO_SCRIPT[lang]}</p>
        </noscript>
        <Providers>{children}</Providers>
        <RegisterSW />
      </body>
    </html>
  );
}
