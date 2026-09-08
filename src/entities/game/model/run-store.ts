"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Locale } from "@/i18n/routing";

import { applyChoice, applyEffects, currentEvent } from "./engine";
import type { Localized } from "./localized";
import type { TimeSkip } from "./finance";
import type {
  ChoiceLogEntry,
  Debt,
  Effects,
  Ending,
  Flags,
  GameEvent,
  KeyDecision,
  Stats,
  TurnOutcome,
} from "./types";

/**
 * RunState — текущий незавершённый сезон. Живёт только на клиенте (Zustand +
 * persist в localStorage): сервер узнаёт о сезоне один раз — в момент complete
 * (граница состояния из ТЗ §1). Ключ — lifeId, параллельных жизней до трёх.
 */

export type RunPhase = "turn" | "season-end" | "interseason" | "finale";

export interface SeasonClose {
  epilogue: string;
  timeSkip: TimeSkip;
  /** Стартовое состояние следующего сезона (null после финального). */
  next: {
    seasonNumber: number;
    age: number;
    stats: Stats;
    flags: Flags;
    debts: Debt[];
  } | null;
  lifeIndex: number;
  /** Дельты статов за сезон — для сводки «что изменилось». */
  statDeltas: Partial<Stats>;
  /** Новые флаги, выставленные за сезон (для строки «открyт навык»). */
  newFlags: string[];
}

export interface FinaleData {
  ending: Ending;
  lifeIndex: number;
  newEnding: boolean;
  unlockedCharacterIds: string[];
}

export interface RunState {
  lifeId: string;
  characterId: string;
  /** Базовый seed жизни; seed сезона — `${baseSeed}-s${season}`. */
  baseSeed: string;
  season: number;
  turn: number;
  age: number;
  stats: Stats;
  flags: Flags;
  debts: Debt[];
  usedEvents: string[];
  /** Накапливаются в рамках сезона, уходят в complete и сбрасываются. */
  diary: string[];
  keyDecisions: KeyDecision[];
  unlockedCards: string[];
  choiceLog: ChoiceLogEntry[];
  /** Статы на старте сезона — для сводки изменений в межсезонье. */
  seasonStartStats: Stats;
  /** Флаги на старте сезона. */
  seasonStartFlags: Flags;
  phase: RunPhase;
  /** Результат последнего хода (оверлей с дельтами). */
  lastOutcome: TurnOutcome | null;
  seasonClose: SeasonClose | null;
  finale: FinaleData | null;
}

export function seasonSeed(run: Pick<RunState, "baseSeed" | "season">): string {
  return `${run.baseSeed}-s${run.season}`;
}

/** Событие текущего хода (чистая производная от состояния рана). */
export function runCurrentEvent(run: RunState): GameEvent<Localized> | null {
  return currentEvent(seasonSeed(run), run.season, run.turn, run.usedEvents, {
    characterId: run.characterId,
    stats: run.stats,
    flags: run.flags,
    debts: run.debts,
  });
}

export interface StartRunInput {
  lifeId: string;
  characterId: string;
  seed: string;
  season: number;
  age: number;
  stats: Stats;
  flags: Flags;
  debts: Debt[];
}

interface RunsStore {
  runs: Record<string, RunState>;
  startRun: (input: StartRunInput) => void;
  /**
   * Применить выбор текущего события. Возвращает исход хода.
   * locale нужен, потому что строка дневника пишется в ран сразу переведённой:
   * стор живёт вне React, useTranslations здесь недоступен.
   */
  choose: (lifeId: string, choiceId: string, locale: Locale) => TurnOutcome | null;
  /** Применить произвольные эффекты (мини-игра «Бюджет»; тексты уже переведены). */
  resolveSpecial: (
    lifeId: string,
    choiceId: string,
    effects: Effects,
    locale: Locale,
  ) => TurnOutcome | null;
  /** Закрыть оверлей результата; двигает фазу, если сезон кончился. */
  dismissOutcome: (lifeId: string) => void;
  /** Зафиксировать завершение сезона (данные от API или локального расчёта). */
  closeSeason: (lifeId: string, close: SeasonClose) => void;
  /** Начать следующий сезон из seasonClose.next. */
  beginNextSeason: (lifeId: string) => void;
  /** Перейти к финалу жизни. */
  setFinale: (lifeId: string, finale: FinaleData) => void;
  dropRun: (lifeId: string) => void;
}

function advance(
  run: RunState,
  applied: ReturnType<typeof applyEffects>,
  event: GameEvent<Localized>,
  choiceId: string,
): RunState {
  const next: RunState = {
    ...run,
    stats: applied.stats,
    flags: applied.flags,
    debts: applied.debts,
    usedEvents: [...run.usedEvents, event.code],
    diary: applied.diaryLine ? [...run.diary, applied.diaryLine] : run.diary,
    keyDecisions: event.key
      ? [...run.keyDecisions, { code: event.code, choice: choiceId }]
      : run.keyDecisions,
    unlockedCards: applied.outcome.unlockedCard
      ? [...new Set([...run.unlockedCards, applied.outcome.unlockedCard.code])]
      : run.unlockedCards,
    choiceLog: [...run.choiceLog, { turn: run.turn, eventCode: event.code, choice: choiceId }],
    turn: run.turn + 1,
    lastOutcome: applied.outcome,
  };
  return next;
}

export const useRunsStore = create<RunsStore>()(
  persist(
    (set, get) => ({
      runs: {},

      startRun: (input) =>
        set((s) => ({
          runs: {
            ...s.runs,
            [input.lifeId]: {
              lifeId: input.lifeId,
              characterId: input.characterId,
              baseSeed: input.seed,
              season: input.season,
              turn: 0,
              age: input.age,
              stats: input.stats,
              flags: input.flags,
              debts: input.debts,
              usedEvents: [],
              diary: [],
              keyDecisions: [],
              unlockedCards: [],
              choiceLog: [],
              seasonStartStats: input.stats,
              seasonStartFlags: input.flags,
              phase: "turn",
              lastOutcome: null,
              seasonClose: null,
              finale: null,
            },
          },
        })),

      choose: (lifeId, choiceId, locale) => {
        const run = get().runs[lifeId];
        if (!run || run.phase !== "turn") return null;
        const event = runCurrentEvent(run);
        if (!event) return null;
        const choice = event.choices.find((c) => c.id === choiceId);
        if (!choice) return null;

        const applied = applyChoice(
          seasonSeed(run),
          run.season,
          run.turn,
          event,
          choice,
          { characterId: run.characterId, stats: run.stats, flags: run.flags, debts: run.debts },
          locale,
        );
        set((s) => ({ runs: { ...s.runs, [lifeId]: advance(run, applied, event, choiceId) } }));
        return applied.outcome;
      },

      resolveSpecial: (lifeId, choiceId, effects, locale) => {
        const run = get().runs[lifeId];
        if (!run || run.phase !== "turn") return null;
        const event = runCurrentEvent(run);
        if (!event) return null;

        const applied = applyEffects(event.code, choiceId, effects, {
          characterId: run.characterId,
          stats: run.stats,
          flags: run.flags,
          debts: run.debts,
        }, run.season, locale);
        set((s) => ({ runs: { ...s.runs, [lifeId]: advance(run, applied, event, choiceId) } }));
        return applied.outcome;
      },

      dismissOutcome: (lifeId) =>
        set((s) => {
          const run = s.runs[lifeId];
          if (!run) return s;
          const noMoreEvents = runCurrentEvent({ ...run, lastOutcome: null }) === null;
          return {
            runs: {
              ...s.runs,
              [lifeId]: {
                ...run,
                lastOutcome: null,
                phase: noMoreEvents ? "season-end" : run.phase,
              },
            },
          };
        }),

      closeSeason: (lifeId, close) =>
        set((s) => {
          const run = s.runs[lifeId];
          if (!run) return s;
          return {
            runs: { ...s.runs, [lifeId]: { ...run, phase: "interseason", seasonClose: close } },
          };
        }),

      beginNextSeason: (lifeId) =>
        set((s) => {
          const run = s.runs[lifeId];
          const next = run?.seasonClose?.next;
          if (!run || !next) return s;
          return {
            runs: {
              ...s.runs,
              [lifeId]: {
                ...run,
                season: next.seasonNumber,
                turn: 0,
                age: next.age,
                stats: next.stats,
                flags: next.flags,
                debts: next.debts,
                diary: [],
                keyDecisions: [],
                unlockedCards: [],
                choiceLog: [],
                seasonStartStats: next.stats,
                seasonStartFlags: next.flags,
                phase: "turn",
                lastOutcome: null,
                seasonClose: null,
              },
            },
          };
        }),

      setFinale: (lifeId, finale) =>
        set((s) => {
          const run = s.runs[lifeId];
          if (!run) return s;
          return { runs: { ...s.runs, [lifeId]: { ...run, phase: "finale", finale } } };
        }),

      dropRun: (lifeId) =>
        set((s) => {
          const runs = { ...s.runs };
          delete runs[lifeId];
          return { runs };
        }),
    }),
    { name: "tagdyr-runs" },
  ),
);
