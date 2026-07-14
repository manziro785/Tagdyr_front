"use client";

import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BookOpen,
  MapPin,
  Quote,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import Link from "next/link";

import { ageStage, getSeason } from "@/entities/game/content/seasons";
import { getCharacter } from "@/entities/game/content/characters";
import { getSeasonGoal } from "@/entities/game/content/goals";
import { choiceAvailable } from "@/entities/game/model/engine";
import {
  runCurrentEvent,
  useRunsStore,
  type RunState,
} from "@/entities/game/model/run-store";
import type { GameEvent, Stats, TurnOutcome } from "@/entities/game/model/types";
import { ChoiceCard } from "@/entities/game/ui/ChoiceCard";
import { CtaButton } from "@/entities/game/ui/CtaButton";
import { GameAvatar } from "@/entities/game/ui/GameAvatar";
import { SceneBackground } from "@/entities/game/ui/SceneBackground";
import { formatMoney, StatsRow } from "@/entities/game/ui/stats";
import { BudgetGame } from "./BudgetGame";

const STAT_LABEL: Record<keyof Stats, string> = {
  money: "Деньги",
  energy: "Энергия",
  mood: "Настроение",
  relationships: "Отношения",
};

/** Оверлей результата хода: успех/провал, дельты, открытая карточка знаний. */
function OutcomeSheet({ outcome, onNext }: { outcome: TurnOutcome; onNext: () => void }) {
  const deltas = Object.entries(outcome.statDeltas) as [keyof Stats, number][];
  return (
    <div className="absolute inset-0 z-20 flex items-end justify-center bg-[rgba(58,40,26,0.35)] backdrop-blur-[2px]">
      <div className="w-full max-w-[430px] animate-in slide-in-from-bottom-8 fade-in rounded-t-3xl border border-white/60 bg-[rgba(251,245,234,0.97)] p-5 pb-7 shadow-[0_-16px_50px_rgba(74,42,16,0.3)] duration-300">
        {!outcome.success && (
          <p className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#F1D6CE] px-3 py-1.5 text-[12px] font-extrabold text-[#B5503C]">
            <X size={13} strokeWidth={2.6} /> {outcome.failText ?? "Не выгорело…"}
          </p>
        )}
        {deltas.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {deltas.map(([key, delta]) => (
              <span
                key={key}
                className={
                  "inline-flex items-center gap-1 rounded-xl px-3 py-2 text-[13.5px] font-extrabold " +
                  (delta > 0 ? "bg-tg-sage-tint text-tg-sage-deep" : "bg-[#F1D6CE] text-[#B5503C]")
                }
              >
                {delta > 0 ? (
                  <ArrowUp size={14} strokeWidth={2.6} />
                ) : (
                  <ArrowDown size={14} strokeWidth={2.6} />
                )}
                {STAT_LABEL[key]}
                {key === "money" ? ` ${delta > 0 ? "+" : "−"}${formatMoney(Math.abs(delta))} с` : ""}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm font-semibold text-tg-brown-2">Жизнь идёт своим чередом.</p>
        )}
        {outcome.tookDebt && (
          <p className="mt-2.5 rounded-xl bg-[#F6E0D6] px-3 py-2 text-[12.5px] font-bold text-[#B5503C]">
            Взял в долг {formatMoney(outcome.tookDebt.amount)} с под{" "}
            {Math.round(outcome.tookDebt.rate * 100)}% годовых — проценты не спят.
          </p>
        )}
        {outcome.unlockedCard && (
          <div className="mt-3 rounded-2xl border border-tg-amber/50 bg-tg-amber-tint p-3.5">
            <p className="inline-flex items-center gap-1.5 font-display text-[11px] font-bold tracking-[0.6px] text-tg-amber-deep uppercase">
              <BookOpen size={13} strokeWidth={2.4} /> Карточка знаний
            </p>
            <p className="mt-1 font-display text-[15px] font-bold text-tg-brown">
              {outcome.unlockedCard.title}
            </p>
            <p className="mt-1 text-[13px] leading-[1.5] font-medium text-tg-brown-2">
              {outcome.unlockedCard.body}
            </p>
          </div>
        )}
        <CtaButton onClick={onNext} className="mt-4">
          Дальше <ArrowRight size={18} strokeWidth={2.6} />
        </CtaButton>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: GameEvent }) {
  return (
    <div
      key={event.code}
      className="relative animate-in fade-in slide-in-from-bottom-4 rounded-[18px] border border-white/70 bg-[rgba(252,247,238,0.82)] p-4 shadow-[0_10px_28px_rgba(80,45,18,0.16)] backdrop-blur-lg duration-500"
    >
      <Quote size={26} className="mb-1.5 fill-tg-amber stroke-none opacity-50" />
      <p className="mb-1.5 inline-flex items-center gap-1.5 font-display text-[11px] font-bold tracking-[0.6px] text-tg-amber-deep uppercase">
        <Sparkles size={12} className="fill-current stroke-none" /> {event.kicker}
      </p>
      <p className="m-0 text-[15px] leading-[1.55] font-medium text-pretty text-tg-brown-2">
        {event.text}
      </p>
    </div>
  );
}

export function TurnView({ run }: { run: RunState }) {
  const choose = useRunsStore((s) => s.choose);
  const resolveSpecial = useRunsStore((s) => s.resolveSpecial);
  const dismissOutcome = useRunsStore((s) => s.dismissOutcome);

  const season = getSeason(run.season);
  const character = getCharacter(run.characterId);
  const goal = getSeasonGoal(run.season);
  const event = runCurrentEvent(run);
  const engineState = {
    characterId: run.characterId,
    stats: run.stats,
    flags: run.flags,
    debts: run.debts,
  };

  const totalDebt = run.debts.reduce((s, d) => s + d.amount, 0);

  const header = (
    <div className="flex items-center gap-3 px-1">
      <GameAvatar size={62} age={run.age} mood={run.stats.mood} />
      <div className="min-w-0 flex-1">
        <div className="font-display text-lg font-bold tracking-[-0.2px] text-tg-brown">
          {character?.name}, {run.age}
        </div>
        <div className="mt-0.5 flex items-center gap-1 text-xs font-bold text-tg-muted">
          <MapPin size={12} strokeWidth={2.2} /> {season.place} · {ageStage(run.age)}
        </div>
      </div>
      <Link
        href="/lives"
        className="flex size-[38px] shrink-0 items-center justify-center rounded-xl bg-white/45 text-tg-brown"
        aria-label="К списку жизней"
      >
        <X size={17} strokeWidth={2} />
      </Link>
    </div>
  );

  const eventBlock = event ? (
    event.special === "budget" ? (
      <BudgetGame
        onDone={(choiceId, effects) => resolveSpecial(run.lifeId, choiceId, effects)}
      />
    ) : (
      <>
        <EventCard event={event} />
        <div className="flex flex-col gap-[9px]">
          {event.choices.map((c) => (
            <ChoiceCard
              key={c.id}
              choice={c}
              disabled={!choiceAvailable(c, engineState)}
              onSelect={() => choose(run.lifeId, c.id)}
            />
          ))}
        </div>
      </>
    )
  ) : null;

  return (
    <div className="relative mx-auto flex min-h-dvh w-full flex-col overflow-hidden lg:max-w-none">
      <SceneBackground scene={season.scene} />

      {/* мобильная раскладка: вариант C+ «Дневник с фоном» */}
      <div className="relative z-[1] mx-auto flex min-h-dvh w-full max-w-[430px] flex-col lg:hidden">
        <div className="flex items-center justify-between px-4 pt-4 pb-1 text-[11px] font-extrabold text-tg-brown-2">
          <span>
            Сезон {run.season} · {season.title}
          </span>
          <span>
            ход {Math.min(run.turn + 1, season.turns)} из {season.turns}
            {totalDebt > 0 && ` · долг ${formatMoney(totalDebt)} с`}
          </span>
        </div>
        {header}
        <StatsRow stats={run.stats} className="px-[18px] pt-3" />
        {goal && (
          <div className="px-[18px] pt-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/45 px-3 py-1.5 text-[11.5px] font-bold text-tg-brown-2">
              <Target size={12} strokeWidth={2.4} className="text-tg-amber-deep" />
              Цель сезона: {goal.text}
            </span>
          </div>
        )}
        <div className="flex flex-1 flex-col gap-3 px-[18px] pt-3.5 pb-6">{eventBlock}</div>
      </div>

      {/* десктоп: сцена слева, панель справа (MainDesktop из макета) */}
      <div className="relative z-[1] mx-auto hidden min-h-dvh w-full max-w-[1200px] lg:grid lg:grid-cols-[420px_1fr]">
        <div className="flex flex-col items-center justify-center gap-[18px] p-8">
          <GameAvatar size={210} age={run.age} mood={run.stats.mood} />
          <div className="flex flex-col items-center gap-1">
            <div className="font-display text-[26px] font-bold tracking-[-0.4px] text-tg-brown [text-shadow:0_1px_10px_rgba(250,240,224,0.6)]">
              {character?.name}, {run.age}
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/50 px-3 py-[5px] text-[13px] font-bold text-tg-brown-2">
              <MapPin size={13} strokeWidth={2.2} /> {season.place} · {ageStage(run.age)}
            </span>
          </div>
          {goal && (
            <div className="flex max-w-[300px] flex-col gap-1 rounded-2xl border border-white/60 bg-white/50 px-4 py-3 text-center">
              <span className="inline-flex items-center justify-center gap-1.5 font-display text-[11px] font-bold tracking-[0.6px] text-tg-amber-deep uppercase">
                <Target size={13} strokeWidth={2.4} /> Цель сезона
              </span>
              <span className="text-[14px] font-bold text-tg-brown">{goal.text}</span>
              <span className="text-[11.5px] font-semibold text-tg-muted">{goal.hint}</span>
            </div>
          )}
          <span className="font-mono text-[11px] text-tg-muted opacity-80">
            сезон {run.season} · ход {Math.min(run.turn + 1, season.turns)}/{season.turns} · seed{" "}
            {run.baseSeed.slice(0, 6)}
          </span>
          <Link
            href="/lives"
            className="rounded-xl border border-white/70 bg-white/50 px-4 py-2 text-sm font-bold text-tg-brown-2 hover:bg-white/70"
          >
            ← Мои жизни
          </Link>
        </div>
        <div className="my-6 mr-6 flex flex-col gap-4 overflow-y-auto rounded-[26px] border border-white/65 bg-[rgba(251,245,234,0.78)] p-6 shadow-[0_24px_60px_rgba(74,42,16,0.2)] backdrop-blur-xl">
          <StatsRow stats={run.stats} />
          <div className="flex flex-1 flex-col justify-center gap-3.5">{eventBlock}</div>
        </div>
      </div>

      {run.lastOutcome && (
        <OutcomeSheet outcome={run.lastOutcome} onNext={() => dismissOutcome(run.lifeId)} />
      )}
    </div>
  );
}
