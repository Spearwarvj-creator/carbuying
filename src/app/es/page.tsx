import type { Metadata } from "next";
import { HomePage } from "@/components/site/pages/HomePage";
import { siteEs } from "@/data/strings/site-es";
import { alternates } from "@/lib/site-locale";
import "../landing.css";

export const metadata: Metadata = {
  title: { absolute: siteEs.home.title },
  description: siteEs.home.description,
  alternates: alternates("es", "/"),
};

export default function InicioEs() {
  return <HomePage locale="es" />;
}
