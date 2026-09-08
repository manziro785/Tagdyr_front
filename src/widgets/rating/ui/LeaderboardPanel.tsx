"use client";

import { Medal, Trophy } from "lucide-react";
import { useState } from "react";

import { getCharacter } from "@/entities/game/content/characters";
import { getSeason, getSeasons } from "@/entities/game/content/seasons";
import { GameAvatar } from "@/entities/game/ui/GameAvatar";
import { useLeaderboard } from "@/entities/meta/api";
import type { LeaderboardWindow } from "@/entities/meta/api";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

const WINDOWS: { value: LeaderboardWindow; key: string }[] = [
  { value: "week", key: "windowWeek" },
  { value: "month", key: "windowMonth" },
  { value: "all", key: "windowAll" },
];

/** Медаль для тройки лидеров, дальше — просто номер. */
const MEDAL_COLOR: Record<number, string> = {
  1: "text-[#D9A441]",
  2: "text-[#A9A9A9]",
  3: "text-[#C08457]",
};

export function LeaderboardPanel() {
  const t = useTranslations("leaderboard");
  const locale = useLocale() as Locale;
  // сезон 1 по умолчанию: его прошли все, кто вообще играл, — таблица не пустая
  const [season, setSeason] = useState(1);
  const [window, setWindow] = useState<LeaderboardWindow>("week");

  // isPending вместо isLoading: в паузах между ретраями isLoading гаснет, и
  // таблица успевала показать «ещё никто не финишировал» вместо загрузки
  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useLeaderboard(season, window);

  const entries = (data?.pages ?? []).flatMap((p) => p.entries);
  const first = data?.pages[0];
  const seasonMeta = getSeason(season, locale);
  const seasons = getSeasons(locale);

  return (
    <section className="flex flex-col gap-3 rounded-[22px] border border-tg-line-soft bg-tg-card p-4 shadow-[0_1px_2px_rgba(120,80,40,0.04)] lg:rounded-[28px] lg:border-white/70 lg:bg-[rgba(251,245,234,0.78)] lg:p-6 lg:shadow-[0_18px_50px_rgba(74,42,16,0.14)] lg:backdrop-blur-md">
      <div className="flex items-baseline justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 font-display text-[15px] font-semibold text-tg-brown lg:text-[19px]">
          <Trophy size={15} strokeWidth={2.3} className="text-tg-amber-deep" />
          {t("title")}
        </span>
        <span className="shrink-0 text-xs font-bold text-tg-muted">
          {first ? t("players", { count: first.totalPlayers }) : "…"}
        </span>
      </div>

      {/* сезон: на мобиле лента с горизонтальным скроллом, на десктопе — в строку */}
      <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-0.5 lg:mx-0 lg:flex-wrap lg:px-0">
        {seasons.map((s) => (
          <button
            key={s.number}
            type="button"
            onClick={() => setSeason(s.number)}
            className={cn(
              "shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-[12px] font-extrabold transition-colors",
              season === s.number
                ? "border-tg-amber bg-tg-amber-tint text-tg-amber-deep"
                : "border-tg-line-soft bg-tg-card-2 text-tg-muted hover:text-tg-brown",
            )}
          >
            {s.number}. {s.title}
          </button>
        ))}
      </div>

      <div className="flex gap-1.5">
        {WINDOWS.map((w) => (
          <button
            key={w.value}
            type="button"
            onClick={() => setWindow(w.value)}
            className={cn(
              "flex-1 cursor-pointer rounded-xl border px-2 py-1.5 text-[12px] font-extrabold transition-colors",
              window === w.value
                ? "border-tg-line bg-tg-card-2 text-tg-brown"
                : "border-transparent bg-transparent text-tg-faint hover:text-tg-muted",
            )}
          >
            {t(w.key)}
          </button>
        ))}
      </div>

      {/* своя строка отдельно: она может быть далеко за пределами первой страницы */}
      {first?.me && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-tg-amber-tint px-4 py-3">
          <span className="min-w-0">
            <span className="block font-display text-[15px] font-bold text-tg-brown">
              {t("yourRank", { rank: first.me.rank, total: first.totalPlayers })}
            </span>
            <span className="block text-[11.5px] font-bold text-tg-amber-deep">
              {t("yourPercentile", { percent: first.me.percentile })}
            </span>
          </span>
          <span className="shrink-0 font-display text-[24px] leading-none font-bold text-tg-brown">
            {first.me.lifeIndex.toFixed(1)}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        {isPending && !isError && (
          <p className="m-0 text-[13px] font-semibold text-tg-muted">{t("loading")}</p>
        )}

        {isError && (
          <p className="m-0 text-[13px] font-bold text-[#B5503C]">
            {t("error")}
          </p>
        )}

        {!isPending && !isError && entries.length === 0 && (
          <div className="rounded-2xl border border-dashed border-tg-line bg-[rgba(251,244,232,0.5)] p-4 text-center">
            <p className="m-0 text-[13px] font-bold text-tg-brown-2">
              {t("emptyTitle", { season: seasonMeta.title })}
            </p>
            <p className="mt-1 mb-0 text-[12px] font-semibold text-tg-muted">
              {t("emptyHint")}
            </p>
          </div>
        )}

        {entries.map((e) => {
          const ch = getCharacter(e.characterId, locale);
          return (
            <div
              key={e.lifeId}
              className={cn(
                "flex items-center gap-2.5 rounded-2xl border p-2.5",
                e.isMe
                  ? "border-tg-amber bg-tg-card-2 shadow-[0_4px_14px_rgba(214,160,60,0.18)]"
                  : "border-tg-line-soft bg-tg-card-2",
              )}
            >
              <span
                className={cn(
                  "flex w-7 shrink-0 justify-center font-display text-[15px] font-bold",
                  MEDAL_COLOR[e.rank] ?? "text-tg-faint",
                )}
              >
                {e.rank <= 3 ? <Medal size={18} strokeWidth={2.4} /> : e.rank}
              </span>
              <GameAvatar
                size={34}
                age={seasonMeta.ageAtStart}
                breathe={false}
                characterId={e.characterId}
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-display text-[14px] font-bold text-tg-brown">
                  {e.displayName}
                  {e.isMe && t("you")}
                </span>
                <span className="text-[11px] font-semibold text-tg-muted">
                  {ch?.name ?? t("unnamed")}
                </span>
              </span>
              <span className="shrink-0 font-display text-[16px] font-bold text-tg-brown">
                {e.lifeIndex.toFixed(1)}
              </span>
            </div>
          );
        })}

        {hasNextPage && (
          <button
            type="button"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
            className="mt-1 cursor-pointer rounded-2xl border border-tg-line-soft bg-tg-card-2 py-2.5 text-[13px] font-extrabold text-tg-brown-2 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isFetchingNextPage ? t("loadingMore") : t("more")}
          </button>
        )}
      </div>
    </section>
  );
}
