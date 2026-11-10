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

// The live domain is not settled yet; set NEXT_PUBLIC_SITE_URL when it is, so share images resolve.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Deal Desk", template: "%s | Deal Desk" },
  openGraph: { siteName: "Deal Desk", type: "website" },
  twitter: { card: "summary_large_image" },
  description: "Enter what the dealer says. See in dollars where the money moved, and what to ask for next.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
