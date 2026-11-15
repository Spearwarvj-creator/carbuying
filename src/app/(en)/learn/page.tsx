import type { Metadata } from "next";
import { LearnShell } from "@/components/learn/LearnShell";
import "../../info.css";

export const metadata: Metadata = {
  title: "Learn the words of car buying",
  description: "Plain-language meanings for the words dealers and lenders use, each tied to something from everyday life, with six short lessons and a decoder for what the dealer wrote.",
};

export default function Learn() {
  return <LearnShell />;
}
