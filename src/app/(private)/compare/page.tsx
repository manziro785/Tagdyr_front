import type { Metadata } from "next";

import { CompareScreen } from "@/widgets/compare/ui/CompareScreen";
import { GameFrame } from "@/widgets/game-shell/GameFrame";

export const metadata: Metadata = {
  title: "Две судьбы — Тагдыр",
};

export default function ComparePage() {
  return (
    <GameFrame scene="city">
      <CompareScreen />
    </GameFrame>
  );
}
