import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Sparkles, Trophy } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";

import { getCharacter } from "@/entities/game/content/characters";
import { ageStage } from "@/entities/game/content/seasons";
import { GameAvatar } from "@/entities/game/ui/GameAvatar";
import { SceneBackground } from "@/entities/game/ui/SceneBackground";
import { StatsRow } from "@/entities/game/ui/stats";
import type { SharePayload } from "@/entities/meta/api/types";
import { API_BASE_URL } from "@/shared/ui/api/base-url";

/**
 * Публичная витрина жизни по share-токену. Серверный компонент: данные тянем
 * обычным fetch (у гостя нет и не должно быть сессии), поэтому OG-теги уходят
 * в мессенджеры уже заполненными. Бэкенд отдаёт безопасный срез — без дневника,
 * флагов и почты владельца.
 */

async function fetchShared(token: string): Promise<SharePayload | null> {
  const res = await fetch(`${API_BASE_URL}/share/${encodeURIComponent(token)}`, {
    // ссылку открывают пачкой из чата — минута кэша бережёт бесплатный Render
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return (await res.json()) as SharePayload;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string; locale: string }>;
}): Promise<Metadata> {
  const { token, locale } = await params;
  const t = await getTranslations({ locale, namespace: "sharePage" });
  const payload = await fetchShared(token);
  if (!payload) return { title: t("notFoundTitle") };

  const headline = t("headline", {
    name: getCharacter(payload.characterId)?.name ?? t("player"),
    age: payload.age,
    index: payload.lifeIndex.toFixed(1),
  });
  const title = t("metaTitle", { headline });
  const description = payload.endingTitle
    ? t("metaFinished", { name: payload.displayName, ending: payload.endingTitle })
    : t("metaInProgress", { name: payload.displayName, seasons: payload.seasonsPlayed });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: ["/tagdyr/blur/issykkul.jpg"],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SharedLifePage({
  params,
}: {
  params: Promise<{ token: string; locale: string }>;
}) {
  const { token, locale } = await params;
  const t = await getTranslations({ locale, namespace: "sharePage" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const payload = await fetchShared(token);
  if (!payload) notFound();

  const character = getCharacter(payload.characterId);
  const finished = payload.status === "finished";

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden font-sans">
      <SceneBackground scene="issykkul" dim />

      <div className="relative z-[1] mx-auto flex w-full max-w-[430px] flex-col gap-4 px-5 py-8 lg:max-w-[620px]">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-[-0.5px] text-[#F7E6C6] transition-opacity hover:opacity-80"
        >
          {tc("appName")}
        </Link>

        <div className="flex flex-col items-center gap-2 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/20 px-3.5 py-[7px] font-display text-[11px] font-bold tracking-[1px] text-[#F7E6C6] uppercase backdrop-blur-sm">
            <Sparkles size={12} className="fill-current stroke-none" />
            {finished ? t("lived") : t("living")}
          </span>
          <GameAvatar size={104} age={payload.age} characterId={payload.characterId} />
          <h1 className="m-0 font-display text-[28px] leading-tight font-bold tracking-[-0.6px] text-[#FFFCF6] [text-shadow:0_2px_20px_rgba(46,30,18,0.55)] lg:text-[34px]">
            {payload.endingTitle ??
              t("nameAge", { name: character?.name ?? t("player"), age: payload.age })}
          </h1>
          <p className="m-0 text-[13px] font-bold text-[#F7E6C6]/90">
            {t("byline", {
              player: payload.displayName,
              character: character?.name ?? t("hero"),
              age: payload.age,
            })}
            {ageStage(payload.age)}
          </p>
        </div>

        <div className="rounded-[20px] border border-white/60 bg-[rgba(251,245,234,0.92)] p-4 shadow-[0_22px_54px_rgba(30,18,8,0.35)] backdrop-blur-md">
          <div className="flex items-center justify-between rounded-2xl bg-tg-amber-tint px-4 py-3">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-extrabold tracking-wide text-tg-amber-deep uppercase">
              <Trophy size={14} strokeWidth={2.4} /> {t("lifeIndex")}
            </span>
            <span className="font-display text-[26px] leading-none font-bold text-tg-brown">
              {payload.lifeIndex.toFixed(1)}
            </span>
          </div>

          <StatsRow stats={payload.stats} className="mt-4" />

          <p className="mt-4 mb-0 text-center text-[12.5px] font-semibold text-tg-muted">
            {payload.seasonsPlayed > 0
              ? t("seasonsDone", { done: payload.seasonsPlayed })
              : t("firstSeason")}
          </p>
        </div>

        <div className="rounded-[20px] border border-white/50 bg-[rgba(251,245,234,0.88)] p-4 backdrop-blur-md">
          <p className="m-0 text-[13.5px] leading-[1.6] font-medium text-tg-brown-2">
            {t("about")}
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link
            href="/auth/register"
            className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-[linear-gradient(180deg,#EFBE63,#E2A03A)] p-[15px] font-display text-base font-bold text-[#5A3F1C] shadow-[0_8px_20px_rgba(214,160,60,0.34)] transition-transform hover:-translate-y-px"
          >
            <ArrowRight size={18} strokeWidth={2.6} /> {t("cta")}
          </Link>
          <Link
            href="/about"
            className="inline-flex w-full items-center justify-center rounded-[18px] border border-white/50 bg-white/20 p-[13px] font-display text-[15px] font-bold text-[#FFFCF6] backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            {t("whatIsIt")}
          </Link>
        </div>
      </div>
    </main>
  );
}
