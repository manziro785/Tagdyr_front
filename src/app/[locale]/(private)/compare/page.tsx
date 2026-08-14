import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CompareScreen } from "@/widgets/compare/ui/CompareScreen";
import { GameFrame } from "@/widgets/game-shell/GameFrame";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.compare" });
  return { title: t("title") };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // включает статический рендер страницы под каждую локаль
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <GameFrame scene="city">
      <CompareScreen />
    </GameFrame>
  );
}
