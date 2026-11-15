import type { Metadata } from "next";
import { HowPage } from "@/components/site/pages/HowPage";
import { site } from "@/data/strings/site";
import { alternates } from "@/lib/site-locale";
import "../../info.css";

export const metadata: Metadata = {
  title: site.how.title,
  description: site.how.description,
  alternates: alternates("en", "/how-it-works"),
};

export default function HowItWorks() {
  return <HowPage locale="en" />;
}
