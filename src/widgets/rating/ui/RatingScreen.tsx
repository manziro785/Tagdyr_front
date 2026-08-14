"use client";

import { LogIn, Users } from "lucide-react";

import { useLives } from "@/entities/game/api";
import { useAuthStore } from "@/entities/session/model/auth-store";
import { BottomNav } from "@/widgets/game-nav/BottomNav";

import { DailyDilemmaCard } from "./DailyDilemmaCard";
import { LeaderboardPanel } from "./LeaderboardPanel";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

/**
 * Общее поле игроков: дилемма дня и таблица индекса жизни. Гостю показываем
 * приглашение войти — обе фичи серверные, без аккаунта их не существует
 * (запросы к ним из гостевого режима даже не уходят, см. хуки меты).
 */
export function RatingScreen() {
  const mode = useAuthStore((s) => s.mode);
  const t = useTranslations("rating");
  const { data: lives } = useLives();

  const active = (lives ?? []).filter((l) => l.status !== "archived");
  const playHref = active.length > 0 ? `/play/${active[0]!.id}` : "/lives";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-[radial-gradient(120%_58%_at_50%_-12%,#FCF2E0_0%,rgba(252,242,224,0)_58%),linear-gradient(180deg,#F5EAD7_0%,#F0E2CB_60%,#ECDDC2_100%)] lg:min-h-0 lg:max-w-none lg:bg-none">
      <header className="px-5 pt-5 lg:px-0 lg:pt-3">
        <h1 className="m-0 font-display text-[26px] font-bold tracking-[-0.5px] text-tg-brown lg:text-[32px]">
          {t("title")}
        </h1>
        <p className="mt-0.5 text-[13px] font-semibold text-tg-muted lg:text-[14px]">
          {t("subtitle")}
        </p>
      </header>

      <div className="flex flex-1 flex-col gap-4 px-5 pt-4 pb-6 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-7 lg:px-0 lg:pt-4">
        {mode === "user" ? (
          <>
            <DailyDilemmaCard />
            <LeaderboardPanel />
          </>
        ) : (
          <section className="flex flex-col items-center gap-3 rounded-[22px] border border-dashed border-tg-line bg-[rgba(251,244,232,0.6)] p-6 text-center lg:col-span-2 lg:rounded-[28px]">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-tg-amber-tint text-tg-amber-deep">
              <Users size={22} strokeWidth={2.2} />
            </span>
            <p className="m-0 font-display text-[16px] font-bold text-tg-brown">
              {t("guestTitle")}
            </p>
            <p className="m-0 max-w-[34ch] text-[13px] leading-[1.55] font-semibold text-tg-muted">
              {t("guestHint")}
            </p>
            <Link
              href="/auth/register"
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(180deg,#EFBE63,#E2A03A)] px-5 py-3 font-display text-[14.5px] font-bold text-[#5A3F1C] shadow-[0_8px_20px_rgba(214,160,60,0.34)] transition-transform hover:-translate-y-px"
            >
              <LogIn size={16} strokeWidth={2.5} /> {t("guestCta")}
            </Link>
          </section>
        )}
      </div>

      <BottomNav playHref={playHref} />
    </div>
  );
}
