import type { Locale } from "@/i18n/routing";

import { eventsOfSeason } from "../content/events";
import { getCard } from "../content/cards";
import { seasonTurns } from "../content/seasons";
import { localizeEffects, tx, type Localized } from "./localized";
import { createRng } from "./rng";
import type {
  Condition,
  Debt,
  Effects,
  EventChoice,
  Flags,
  GameEvent,
  Stats,
  TurnOutcome,
} from "./types";

/**
 * Движок хода: детерминированный выбор события из пула и применение эффектов.
 * Всё чистые функции от (seed, season, turn, state) — один seed даёт один ран,
 * поэтому состояние можно восстановить и реплеить (анти-чит §9).
 */

export interface EngineState {
  characterId: string;
  stats: Stats;
  flags: Flags;
  debts: Debt[];
}

export function conditionMet(cond: Condition | undefined, s: EngineState): boolean {
  if (!cond) return true;
  if (cond.flag && s.flags[cond.flag] !== true) return false;
  if (cond.notFlag && s.flags[cond.notFlag] === true) return false;
  if (cond.minMoney !== undefined && s.stats.money < cond.minMoney) return false;
  if (cond.maxMoney !== undefined && s.stats.money > cond.maxMoney) return false;
  if (cond.hasDebt !== undefined) {
    const inDebt = s.debts.some((d) => d.amount > 0);
    if (inDebt !== cond.hasDebt) return false;
  }
  if (cond.characterId && s.characterId !== cond.characterId) return false;
  if (cond.minStat) {
    for (const [key, min] of Object.entries(cond.minStat)) {
      if (s.stats[key as keyof Stats] < (min ?? 0)) return false;
    }
  }
  return true;
}

/**
 * Событие текущего хода. Детерминировано: rng собирается из seed+season+turn,
 * так что перезагрузка страницы показывает то же событие.
 */
export function currentEvent(
  seed: string,
  season: number,
  turn: number,
  usedEvents: readonly string[],
  state: EngineState,
): GameEvent<Localized> | null {
  // сезон заканчивается по числу ходов из меты или по исчерпанию пула
  if (turn >= seasonTurns(season)) return null;
  const pool = eventsOfSeason(season).filter(
    (e) => !usedEvents.includes(e.code) && conditionMet(e.requires, state),
  );
  if (pool.length === 0) return null;

  const rng = createRng(`${seed}:s${season}:t${turn}`);
  const totalWeight = pool.reduce((sum, e) => sum + (e.weight ?? 1), 0);
  let roll = rng.next() * totalWeight;
  for (const event of pool) {
    roll -= event.weight ?? 1;
    if (roll <= 0) return event;
  }
  return pool[pool.length - 1] ?? null;
}

/** Доступен ли вариант выбора (кнопка активна). Язык текста тут не важен. */
export function choiceAvailable<T>(choice: EventChoice<T>, state: EngineState): boolean {
  return conditionMet(choice.requires, state);
}

const clamp = (v: number) => Math.max(0, Math.min(100, v));

export interface ApplyResult {
  stats: Stats;
  flags: Flags;
  debts: Debt[];
  diaryLine: string | null;
  outcome: TurnOutcome;
}

/**
 * Применить выбор. Бросок шанса детерминирован от seed+season+turn+choiceId:
 * сохранение/перезагрузка не даёт «перекинуть кубик».
 *
 * locale нужен только текстам (дневник, карточка, текст провала) — на бросок
 * и на цифры он не влияет, поэтому реплей на сервере остаётся сходимым.
 */
export function applyChoice(
  seed: string,
  season: number,
  turn: number,
  event: GameEvent<Localized>,
  choice: EventChoice<Localized>,
  state: EngineState,
  locale: Locale,
): ApplyResult {
  let success = true;
  if (choice.chance !== undefined) {
    const rng = createRng(`${seed}:s${season}:t${turn}:${choice.id}`);
    success = rng.chance(choice.chance / 100);
  }
  const raw = success ? choice.effects : (choice.failEffects ?? choice.effects);
  return applyEffects(event.code, choice.id, localizeEffects(raw, locale), state, season, locale, {
    success,
    failText: success || !choice.failText ? undefined : tx(choice.failText, locale),
  });
}

/**
 * Общая механика применения эффектов (обычный выбор и мини-игра).
 * Тексты приходят уже переведёнными — движок про языки ничего не знает,
 * кроме кода карточки знаний, которую надо достать на нужном языке.
 */
export function applyEffects(
  eventCode: string,
  choiceId: string,
  effects: Effects,
  state: EngineState,
  season: number,
  locale: Locale,
  meta: { success: boolean; failText?: string } = { success: true },
): ApplyResult {
  const statDeltas: Partial<Stats> = {};
  const stats: Stats = { ...state.stats };

  if (effects.stats) {
    for (const [key, delta] of Object.entries(effects.stats)) {
      if (delta === undefined || delta === 0) continue;
      const k = key as keyof Stats;
      if (k === "money") {
        stats.money = Math.round(stats.money + delta);
        statDeltas.money = delta;
      } else {
        const before = stats[k];
        stats[k] = clamp(before + delta);
        const real = stats[k] - before;
        if (real !== 0) statDeltas[k] = real;
      }
    }
  }

  const flags: Flags = { ...state.flags, ...effects.flags };

  let debts: Debt[] = state.debts.map((d) => ({ ...d }));
  let tookDebt: { amount: number; rate: number } | undefined;
  if (effects.debt) {
    debts.push({ amount: effects.debt.amount, rate: effects.debt.rate, sinceSeason: season });
    tookDebt = effects.debt;
  }
  if (effects.payDebt && effects.payDebt > 0) {
    let toPay = Math.min(effects.payDebt, stats.money);
    if (toPay > 0) {
      stats.money -= toPay;
      statDeltas.money = (statDeltas.money ?? 0) - toPay;
      // гасим с самых дорогих — сама механика учит правилу debt_first
      debts = debts
        .slice()
        .sort((a, b) => b.rate - a.rate)
        .map((d) => {
          if (toPay <= 0) return d;
          const pay = Math.min(d.amount, toPay);
          toPay -= pay;
          return { ...d, amount: d.amount - pay };
        })
        .filter((d) => d.amount > 0);
    }
  }

  const unlockedCard = effects.card ? getCard(effects.card, locale) : undefined;

  return {
    stats,
    flags,
    debts,
    diaryLine: effects.diary ?? null,
    outcome: {
      eventCode,
      choiceId,
      success: meta.success,
      failText: meta.failText,
      statDeltas,
      tookDebt,
      unlockedCard,
    },
  };
}
