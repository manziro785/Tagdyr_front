import type { Metadata } from "next";

import { ProfileScreen } from "@/widgets/profile/ui/ProfileScreen";

export const metadata: Metadata = {
  title: "Профиль — Тагдыр",
};

export default function ProfilePage() {
  return <ProfileScreen />;
}
