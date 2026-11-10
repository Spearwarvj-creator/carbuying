import type { Metadata, Viewport } from "next";
import "@fontsource/atkinson-hyperlegible-next/400.css";
import "@fontsource/atkinson-hyperlegible-next/600.css";
import "@fontsource/atkinson-hyperlegible-next/700.css";
import "@fontsource/sofia-sans-extra-condensed/700.css";
import "@fontsource/sofia-sans-extra-condensed/800.css";
import "./globals.css";
import "./site.css";
import "./walk.css";
import { Providers } from "@/components/ui/Providers";
import { RegisterSW } from "@/components/RegisterSW";

// The live domain is not settled yet; set NEXT_PUBLIC_SITE_URL when it is, so share images resolve.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Deal Desk", template: "%s | Deal Desk" },
  // Each page names itself as the canonical address, resolved against metadataBase.
  alternates: { canonical: "./" },
  openGraph: { siteName: "Deal Desk", type: "website" },
  appleWebApp: { capable: true, title: "Deal Desk", statusBarStyle: "black-translucent" },
  icons: { apple: "/icons/apple-touch-icon.png" },
  twitter: { card: "summary_large_image" },
  description: "Enter what the dealer says. See in dollars where the money moved, and what to ask for next.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // The site is dark by default whatever the system says, so one colour; the light screen is a choice made on the page.
  themeColor: "#0e1a1f",
};

// Applies the saved text size and screen choice before the first paint, so the page never flashes.
const prefsScript = `try{var d=document.documentElement,s=localStorage;if(s.getItem("dd-text")==="large")d.dataset.text="large";if(s.getItem("dd-theme")==="light")d.dataset.theme="light"}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsScript }} />
      </head>
      <body>
        <noscript>
          <p style={{ margin: 0, padding: "12px 16px", background: "#f5c400", color: "#12161c", fontFamily: "sans-serif", fontWeight: 700 }}>
            Deal Desk needs JavaScript to run the calculator. The guides on this site still read without it.
          </p>
        </noscript>
        <Providers>{children}</Providers>
        <RegisterSW />
      </body>
    </html>
  );
}
