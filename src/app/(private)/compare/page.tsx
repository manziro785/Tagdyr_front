import type { Metadata } from "next";

import { CompareScreen } from "@/widgets/compare/ui/CompareScreen";

export const metadata: Metadata = {
  title: "Две судьбы — Тагдыр",
};

export default function ComparePage() {
  return <CompareScreen />;
}
