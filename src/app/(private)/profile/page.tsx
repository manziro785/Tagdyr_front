import type { Metadata } from "next";

import { ProfileScreen } from "@/widgets/profile/ui/ProfileScreen";
import { GameFrame } from "@/widgets/game-shell/GameFrame";

export const metadata: Metadata = {
  title: "Профиль — Тагдыр",
};

export default function ProfilePage() {
  return (
    <GameFrame scene="issykkul">
      <ProfileScreen />
    </GameFrame>
  );
}
