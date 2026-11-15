import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { RootShell } from "@/components/site/RootShell";

// The live domain is not settled yet; set NEXT_PUBLIC_SITE_URL when it is, so share images resolve.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Deal Desk", template: "%s | Deal Desk" },
  // Each page names itself as the canonical address, resolved against metadataBase; pages with a Spanish twin say so themselves.
  alternates: { canonical: "./" },
  openGraph: { siteName: "Deal Desk", type: "website", locale: "en_US" },
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

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <RootShell lang="en">{children}</RootShell>;
}
