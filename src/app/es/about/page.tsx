import type { Metadata } from "next";
import { AboutPage } from "@/components/site/pages/AboutPage";
import { siteEs } from "@/data/strings/site-es";
import { alternates } from "@/lib/site-locale";
import "../../info.css";

export const metadata: Metadata = {
  title: siteEs.about.title,
  description: siteEs.about.description,
  alternates: alternates("es", "/about"),
};

export default function AcercaDe() {
  return <AboutPage locale="es" />;
}
