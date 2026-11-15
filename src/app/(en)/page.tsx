import type { Metadata } from "next";
import { HomePage } from "@/components/site/pages/HomePage";
import { alternates } from "@/lib/site-locale";
import { site } from "@/data/strings/site";
import "../landing.css";

export const metadata: Metadata = {
  title: { absolute: site.home.title },
  description: site.home.description,
  alternates: alternates("en", "/"),
};

export default function Home() {
  return <HomePage locale="en" />;
}
