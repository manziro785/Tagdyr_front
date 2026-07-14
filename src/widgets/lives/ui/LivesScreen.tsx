"use client";

import { ChevronRight, Coins, LogOut, Plus, Lock, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  useArchiveLife,
  useCharactersRoster,
  useCreateLife,
  useLives,
} from "@/entities/game/api";
import type { LifeSummary } from "@/entities/game/api/types";
import { getCharacter } from "@/entities/game/content/characters";
import { ageStage, getSeason } from "@/entities/game/content/seasons";
import { randomSeed } from "@/entities/game/model/rng";
import { useRunsStore } from "@/entities/game/model/run-store";
import type { Character } from "@/entities/game/model/types";
import { CtaButton } from "@/entities/game/ui/CtaButton";
import { GameAvatar } from "@/entities/game/ui/GameAvatar";
import { moneyPct, formatMoney } from "@/entities/game/ui/stats";
import { useAuthStore } from "@/entities/session/model/auth-store";
import { BottomNav } from "@/widgets/game-nav/BottomNav";
import { cn } from "@/lib/utils";

const MAX_SLOTS = 3;

const ACCENT: Record<Character["accent"], { c: string; bg: string }> = {
  amber: { c: "var(--color-tg-amber-deep)", bg: "var(--color-tg-amber-tint)" },
  sage: { c: "var(--color-tg-sage-deep)", bg: "var(--color-tg-sage-tint)" },
  terracotta: {
    c: "var(--color-tg-terra-deep)",
    bg: "var(--color-tg-terra-tint)",
  },
  rose: { c: "var(--color-tg-rose-deep)", bg: "var(--color-tg-rose-tint)" },
};

function SlotBars({ life }: { life: LifeSummary }) {
  const vals = [
    { pct: moneyPct(life.stats.money), color: "var(--color-tg-amber)" },
    { pct: life.stats.energy, color: "var(--color-tg-terracotta)" },
    { pct: life.stats.mood, color: "var(--color-tg-sage)" },
    { pct: life.stats.relationships, color: "var(--color-tg-rose)" },
  ];
  return (
    <span className="mt-px flex gap-[5px]">
      {vals.map((v, i) => (
        <span
          key={i}
          className="h-[5px] w-[30px] overflow-hidden rounded bg-tg-track"
        >
          <i
            className="block h-full rounded"
            style={{ width: `${v.pct}%`, background: v.color }}
          />
        </span>
      ))}
    </span>
  );
}

export function LivesScreen() {
  const router = useRouter();
  const signOut = useAuthStore((s) => s.signOut);
  const { data: lives, isLoading } = useLives();
  const { data: roster } = useCharactersRoster();
  const createLife = useCreateLife();
  const archiveLife = useArchiveLife();
  const startRun = useRunsStore((s) => s.startRun);
  const runs = useRunsStore((s) => s.runs);

  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const activeLives = (lives ?? []).filter((l) => l.status !== "archived");
  const freeSlots = Array.from({ length: MAX_SLOTS }, (_, i) => i).filter(
    (i) => !activeLives.some((l) => l.slotIndex === i),
  );

  const openLife = (life: LifeSummary) => {
    router.push(`/play/${life.id}`);
  };

  const startNewLife = () => {
    if (!selectedChar || freeSlots.length === 0 || createLife.isPending) return;
    const seed = randomSeed();
    createLife.mutate(
      { slotIndex: freeSlots[0]!, characterId: selectedChar, seed },
      {
        onSuccess: (life) => {
          startRun({
            lifeId: life.id,
            characterId: life.characterId,
            seed: life.seed,
            season: life.currentSeason,
            age: life.age,
            stats: life.stats,
            flags: life.flags,
            debts: life.debts,
          });
          router.push(`/play/${life.id}`);
        },
      },
    );
  };

  const playHref =
    activeLives.length > 0 ? `/play/${activeLives[0]!.id}` : "/lives";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-[radial-gradient(120%_58%_at_50%_-12%,#FCF2E0_0%,rgba(252,242,224,0)_58%),linear-gradient(180deg,#F5EAD7_0%,#F0E2CB_60%,#ECDDC2_100%)] lg:max-w-none lg:min-h-full">
      <header className="flex items-center justify-between px-5 pt-5">
        <span className="font-display text-[30px] font-bold tracking-[-0.5px] text-tg-brown">
          Тагдыр
        </span>
        <button
          type="button"
          onClick={() => {
            signOut();
            router.replace("/");
          }}
          className="flex size-[38px] cursor-pointer items-center justify-center rounded-xl border border-tg-line bg-white/45 text-tg-brown"
          aria-label="Выйти"
        >
          <LogOut size={17} strokeWidth={2} />
        </button>
      </header>
      <p className="px-5 pt-0.5 text-[13px] font-semibold text-tg-muted">
        Маленькие выборы складываются в судьбу
      </p>

      <div className="flex flex-1 flex-col gap-[11px] px-5 pt-4 pb-5">
        <div className="flex items-baseline justify-between">
          <span className="font-display text-[15px] font-semibold text-tg-brown">
            Ваши жизни
          </span>
          <span className="text-xs font-bold text-tg-muted">
            {activeLives.length} из {MAX_SLOTS}
          </span>
        </div>

        <div className="flex flex-col gap-[9px]">
          {isLoading && (
            <div className="rounded-[18px] border border-tg-line-soft bg-tg-card p-4 text-center text-[13px] font-semibold text-tg-muted">
              Загружаю жизни…
            </div>
          )}
          {activeLives.map((life) => {
            const ch = getCharacter(life.characterId);
            const finished = life.status === "finished";
            const run = runs[life.id];
            return (
              <div
                key={life.id}
                className="flex w-full items-center gap-3 rounded-[18px] border border-tg-line-soft bg-tg-card p-[11px] pr-2 shadow-[0_1px_2px_rgba(120,80,40,0.04)]"
              >
                <button
                  type="button"
                  onClick={() => openLife(life)}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                >
                  <GameAvatar
                    size={50}
                    age={life.age}
                    mood={life.stats.mood}
                    breathe={false}
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                    <span className="font-display text-[15.5px] font-bold text-tg-brown">
                      {ch?.name ?? "Безымянный"}, {life.age}
                    </span>
                    <span className="text-xs font-semibold text-tg-muted">
                      {finished
                        ? "Жизнь прожита — смотреть итог"
                        : `${getSeason(life.currentSeason).title} · ${ageStage(life.age)}${run && run.phase !== "turn" ? " · межсезонье" : ""}`}
                    </span>
                    <SlotBars life={life} />
                  </span>
                  <ChevronRight
                    size={20}
                    strokeWidth={2.2}
                    className="shrink-0 text-tg-faint"
                  />
                </button>
                {confirmDelete === life.id ? (
                  <button
                    type="button"
                    onClick={() => {
                      archiveLife.mutate(life.id);
                      useRunsStore.getState().dropRun(life.id);
                      setConfirmDelete(null);
                    }}
                    className="shrink-0 cursor-pointer rounded-lg bg-[#F1D6CE] px-2 py-1.5 text-[11px] font-extrabold text-[#B5503C]"
                  >
                    Точно?
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(life.id)}
                    className="shrink-0 cursor-pointer p-1.5 text-tg-faint hover:text-[#B5503C]"
                    aria-label="Удалить жизнь"
                  >
                    <Trash2 size={15} strokeWidth={2} />
                  </button>
                )}
              </div>
            );
          })}

          {freeSlots.length > 0 && !isLoading && (
            <div className="flex items-center gap-[11px] rounded-[18px] border border-dashed border-tg-line bg-[rgba(251,244,232,0.5)] p-[11px]">
              <span className="flex size-[42px] items-center justify-center rounded-full bg-tg-amber-tint text-tg-amber-deep">
                <Plus size={20} strokeWidth={2.4} />
              </span>
              <span className="text-sm font-bold text-tg-muted">
                Свободный слот — выбери старт ниже
              </span>
            </div>
          )}
        </div>

        <div className="mt-[5px] flex items-baseline justify-between">
          <span className="font-display text-[15px] font-semibold text-tg-brown">
            Новая жизнь — выбери старт
          </span>
        </div>

        <div className="flex gap-2.5">
          {(roster?.items ?? []).map((ch) => {
            const locked = !ch.unlocked;
            const selected = selectedChar === ch.id;
            const accent = ACCENT[ch.accent];
            return (
              <button
                key={ch.id}
                type="button"
                disabled={locked}
                onClick={() => setSelectedChar(ch.id)}
                className={cn(
                  "flex flex-1 cursor-pointer flex-col items-center gap-[7px] rounded-2xl border p-3 pb-[13px] text-center transition-all",
                  selected
                    ? "border-tg-amber bg-tg-card-2 shadow-[0_6px_18px_rgba(214,160,60,0.25)]"
                    : "border-tg-line-soft bg-tg-card",
                  locked && "cursor-not-allowed opacity-60",
                )}
              >
                <GameAvatar
                  size={56}
                  age={ch.age}
                  mood={ch.startStats.mood}
                  breathe={selected}
                />
                <span className="font-display text-[13.5px] font-bold text-tg-brown">
                  {ch.name}
                </span>
                <span className="-mt-[3px] text-[10.5px] font-semibold text-tg-muted">
                  {ch.place}
                </span>
                <span className="flex w-full flex-col items-center gap-1">
                  <span className="inline-flex items-center gap-[3px] rounded-full bg-tg-amber-tint px-2 py-[3px] text-[10.5px] font-extrabold whitespace-nowrap text-tg-amber-deep">
                    <Coins size={12} strokeWidth={2.2} />{" "}
                    {formatMoney(ch.startStats.money)} с
                  </span>
                  {locked ? (
                    <span className="inline-flex items-center gap-[3px] rounded-full bg-tg-line-soft px-2 py-[3px] text-[10.5px] font-extrabold whitespace-nowrap text-tg-muted">
                      <Lock size={11} strokeWidth={2.4} /> за концовку «Опора»
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center rounded-full px-2 py-[3px] text-[10.5px] font-extrabold whitespace-nowrap"
                      style={{ color: accent.c, background: accent.bg }}
                    >
                      {ch.trait}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-2">
          <CtaButton
            onClick={startNewLife}
            disabled={
              !selectedChar || freeSlots.length === 0 || createLife.isPending
            }
          >
            <Plus size={18} strokeWidth={2.6} />
            {freeSlots.length === 0
              ? "Все слоты заняты"
              : createLife.isPending
                ? "Начинаем…"
                : "Начать новую жизнь"}
          </CtaButton>
          {createLife.isError && (
            <p className="mt-2 text-center text-xs font-bold text-[#B5503C]">
              Не получилось создать жизнь. Попробуй ещё раз.
            </p>
          )}
        </div>
      </div>

      <BottomNav playHref={playHref} />
    </div>
  );
}
