"use client";

import { BookOpen, HelpCircle, Sparkles, Trophy } from "lucide-react";

import {
  useCardsCollection,
  useEndingsCollection,
  useLives,
} from "@/entities/game/api";
import type { KnowledgeCardCategory } from "@/entities/game/model/types";
import { useAuthStore } from "@/entities/session/model/auth-store";
import { BottomNav } from "@/widgets/game-nav/BottomNav";
import { cn } from "@/lib/utils";

const CATEGORY_LABEL: Record<KnowledgeCardCategory, string> = {
  finance: "Финансы",
  relationships: "Отношения",
  health: "Здоровье",
  career: "Карьера",
  life: "Жизнь",
};

const CATEGORY_STYLE: Record<KnowledgeCardCategory, string> = {
  finance: "bg-tg-amber-tint text-tg-amber-deep",
  relationships: "bg-tg-rose-tint text-tg-rose-deep",
  health: "bg-tg-terra-tint text-tg-terra-deep",
  career: "bg-tg-sage-tint text-tg-sage-deep",
  life: "bg-tg-line-soft text-tg-brown-2",
};

export function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const mode = useAuthStore((s) => s.mode);
  const { data: endings } = useEndingsCollection();
  const { data: cards } = useCardsCollection();
  const { data: lives } = useLives();

  const playHref =
    lives && lives.length > 0 ? `/play/${lives[0]!.id}` : "/lives";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-[radial-gradient(120%_58%_at_50%_-12%,#FCF2E0_0%,rgba(252,242,224,0)_58%),linear-gradient(180deg,#F5EAD7_0%,#F0E2CB_60%,#ECDDC2_100%)]">
      <header className="px-5 pt-5">
        <h1 className="m-0 font-display text-[26px] font-bold tracking-[-0.5px] text-tg-brown">
          Профиль
        </h1>
        <p className="mt-0.5 text-[13px] font-semibold text-tg-muted">
          {mode === "user" ? (user?.displayName ?? "Игрок") : "Гость"} · коллекция собирается за
          несколько жизней
        </p>
      </header>

      <div className="flex flex-1 flex-col gap-5 px-5 pt-4 pb-6">
        {/* галерея концовок */}
        <section>
          <div className="mb-2.5 flex items-baseline justify-between">
            <span className="inline-flex items-center gap-1.5 font-display text-[15px] font-semibold text-tg-brown">
              <Trophy size={15} strokeWidth={2.3} className="text-tg-amber-deep" /> Концовки
            </span>
            <span className="text-xs font-bold text-tg-muted">
              открыто {endings?.unlocked ?? 0} из {endings?.total ?? "…"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {(endings?.items ?? []).map((e) => {
              const locked = !e.unlockedAt;
              return (
                <div
                  key={e.id}
                  className={cn(
                    "rounded-2xl border p-3 transition-colors",
                    locked
                      ? "border-dashed border-tg-line bg-[rgba(251,244,232,0.45)]"
                      : "border-tg-line-soft bg-tg-card-2 shadow-[0_4px_14px_rgba(110,70,30,0.06)]",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[10px] font-extrabold tracking-[0.4px] uppercase",
                      locked ? "bg-tg-line-soft text-tg-faint" : "bg-tg-amber-tint text-tg-amber-deep",
                    )}
                  >
                    {locked ? <HelpCircle size={10} strokeWidth={2.6} /> : <Sparkles size={10} className="fill-current stroke-none" />}
                    {e.archetype}
                  </span>
                  <p
                    className={cn(
                      "mt-1.5 mb-0 font-display text-[14.5px] leading-tight font-bold",
                      locked ? "text-tg-faint" : "text-tg-brown",
                    )}
                  >
                    {locked ? "???" : e.title}
                  </p>
                  <p
                    className={cn(
                      "mt-1 mb-0 text-[11.5px] leading-[1.45] font-medium",
                      locked ? "text-tg-faint" : "text-tg-muted",
                    )}
                  >
                    {locked ? "Эта судьба ещё не прожита." : e.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* коллекция карточек знаний */}
        <section>
          <div className="mb-2.5 flex items-baseline justify-between">
            <span className="inline-flex items-center gap-1.5 font-display text-[15px] font-semibold text-tg-brown">
              <BookOpen size={15} strokeWidth={2.3} className="text-tg-sage-deep" /> Карточки знаний
            </span>
            <span className="text-xs font-bold text-tg-muted">
              собрано {cards?.unlocked ?? 0} из {cards?.total ?? "…"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {(cards?.items ?? []).map((card) => {
              const locked = !card.unlockedAt;
              return (
                <div
                  key={card.id}
                  className={cn(
                    "rounded-2xl border p-3.5",
                    locked
                      ? "border-dashed border-tg-line bg-[rgba(251,244,232,0.45)]"
                      : "border-tg-line-soft bg-tg-card-2 shadow-[0_2px_8px_rgba(110,70,30,0.05)]",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "font-display text-[14px] font-bold",
                        locked ? "text-tg-faint" : "text-tg-brown",
                      )}
                    >
                      {locked ? "???" : card.title}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-[3px] text-[10px] font-extrabold tracking-[0.3px] uppercase",
                        locked ? "bg-tg-line-soft text-tg-faint" : CATEGORY_STYLE[card.category],
                      )}
                    >
                      {CATEGORY_LABEL[card.category]}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "mt-1 mb-0 text-[12.5px] leading-[1.5] font-medium",
                      locked ? "text-tg-faint" : "text-tg-brown-2",
                    )}
                  >
                    {locked
                      ? `Прячется в сезоне ${card.season}. Живи внимательнее.`
                      : card.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <BottomNav playHref={playHref} />
    </div>
  );
}
