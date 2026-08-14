import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LivesScreen } from "@/widgets/lives/ui/LivesScreen";
import { GameFrame } from "@/widgets/game-shell/GameFrame";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.lives" });
  return { title: t("title") };
}

export default async function LivesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // включает статический рендер страницы под каждую локаль
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <GameFrame scene="valley">
      <LivesScreen />
    </GameFrame>
  );
}
