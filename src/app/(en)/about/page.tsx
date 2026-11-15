import type { Metadata } from "next";
import { AboutPage } from "@/components/site/pages/AboutPage";
import { site } from "@/data/strings/site";
import { alternates } from "@/lib/site-locale";
import "../../info.css";

export const metadata: Metadata = {
  title: site.about.title,
  description: site.about.description,
  alternates: alternates("en", "/about"),
};

export default function About() {
  return <AboutPage locale="en" />;
}
