import type { Metadata } from "next";
import { DealScreen } from "@/components/DealScreen";

export const metadata: Metadata = {
  title: "Calculator",
  description: "Enter what the dealer says. See in dollars where the money moved, and what to ask for next.",
};

export default function DealPage() {
  return <DealScreen />;
}
