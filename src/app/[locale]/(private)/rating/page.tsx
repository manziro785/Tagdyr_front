import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { GameFrame } from "@/widgets/game-shell/GameFrame";
import { RatingScreen } from "@/widgets/rating/ui/RatingScreen";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.rating" });
  return { title: t("title") };
}

export default async function RatingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // включает статический рендер страницы под каждую локаль
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <GameFrame scene="city">
      <RatingScreen />
    </GameFrame>
  );
}
