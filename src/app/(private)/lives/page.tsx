import type { Metadata } from "next";

import { LivesScreen } from "@/widgets/lives/ui/LivesScreen";
import { GameFrame } from "@/widgets/game-shell/GameFrame";

export const metadata: Metadata = {
  title: "Мои жизни — Тагдыр",
};

export default function LivesPage() {
  return (
    <GameFrame scene="valley">
      <LivesScreen />
    </GameFrame>
  );
}
