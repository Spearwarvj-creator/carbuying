import type { Metadata } from "next";
import { HowPage } from "@/components/site/pages/HowPage";
import { siteEs } from "@/data/strings/site-es";
import { alternates } from "@/lib/site-locale";
import "../../info.css";

export const metadata: Metadata = {
  title: siteEs.how.title,
  description: siteEs.how.description,
  alternates: alternates("es", "/how-it-works"),
};

export default function ComoFunciona() {
  return <HowPage locale="es" />;
}
