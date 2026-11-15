import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { LocaleSync } from "@/components/site/LocaleSync";
import { RootShell } from "@/components/site/RootShell";

// The Spanish half of the site. Its pages sit under /es and say so to search engines (see alternates in each page).
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Deal Desk", template: "%s | Deal Desk" },
  openGraph: { siteName: "Deal Desk", type: "website", locale: "es_US" },
  appleWebApp: { capable: true, title: "Deal Desk", statusBarStyle: "black-translucent" },
  icons: { apple: "/icons/apple-touch-icon.png" },
  twitter: { card: "summary_large_image" },
  description: "Escriba lo que dice el vendedor. Vea en dólares adónde se movió el dinero, y qué pedir después.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0e1a1f",
};

export default function SpanishLayout({ children }: { children: ReactNode }) {
  return (
    <RootShell lang="es">
      <LocaleSync lang="es" />
      {children}
    </RootShell>
  );
}
