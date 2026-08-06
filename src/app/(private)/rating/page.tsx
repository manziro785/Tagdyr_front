import type { Metadata } from "next";

import { GameFrame } from "@/widgets/game-shell/GameFrame";
import { RatingScreen } from "@/widgets/rating/ui/RatingScreen";

export const metadata: Metadata = {
  title: "Рейтинг — Тагдыр",
};

export default function RatingPage() {
  return (
    <GameFrame scene="city">
      <RatingScreen />
    </GameFrame>
  );
}
