import type { Metadata } from "next";

import { LivesScreen } from "@/widgets/lives/ui/LivesScreen";

export const metadata: Metadata = {
  title: "Мои жизни — Тагдыр",
};

export default function LivesPage() {
  return <LivesScreen />;
}
