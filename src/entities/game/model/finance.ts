import type { Debt, Stats } from "./types";

/**
 * Финансовая математика — клиентский порт packages/engine (time-skip, life-index,
 * resolve-ending). Используется в гостевом режиме; в серверном те же числа
 * приходят из API. Константы обязаны совпадать с DEFAULT_CONFIG бэкенда.
 */

export const SAVINGS_RATE = 0.08;
export const DEFAULT_DEBT_RATE = 0.14;
/** S1→S2, S2→S3, S3→S4, S4→S5 (лет). */
export const SEASON_YEAR_GAPS: readonly number[] = [1, 1, 3, 5];
export const MAX_SEASON = 5;

const INDEX_WEIGHTS = {
  money: 0.35,
  energy: 0.15,
  mood: 0.2,
  relationships: 0.2,
  cardBonus: 0.5,
};
const MONEY_REFERENCE = 1_000_000;

export function yearsBetweenSeasons(completedSeason: number): number {
  return SEASON_YEAR_GAPS[completedSeason - 1] ?? 0;
}

export interface Projection {
  before: number;
  rate: number;
  after: number;
  perYear: number[];
}

export interface TimeSkip {
  years: number;
  savings: Projection | null;
  debts: Projection[];
}

function compoundPerYear(principal: number, rate: number, years: number): number[] {
  const out: number[] = [];
  let value = principal;
  for (let i = 0; i < years; i += 1) {
    value = value * (1 + rate);
    out.push(Math.round(value));
  }
  return out;
}

export interface TimeSkipResult {
  savingsAfter: number;
  debtsAfter: Debt[];
  timeSkip: TimeSkip;
}

export function applyTimeSkip(
  completedSeason: number,
  savings: number,
  debts: Debt[],
): TimeSkipResult {
  const years = yearsBetweenSeasons(completedSeason);

  let savingsProjection: Projection | null = null;
  let savingsAfter = Math.round(savings);
  if (savings > 0 && years > 0) {
    const perYear = compoundPerYear(savings, SAVINGS_RATE, years);
    savingsAfter = perYear[perYear.length - 1] ?? Math.round(savings);
    savingsProjection = { before: Math.round(savings), rate: SAVINGS_RATE, after: savingsAfter, perYear };
  }

  const debtProjections: Projection[] = [];
  const debtsAfter: Debt[] = debts.map((debt) => {
    const rate = debt.rate > 0 ? debt.rate : DEFAULT_DEBT_RATE;
    if (years === 0 || debt.amount <= 0) {
      const amount = Math.round(debt.amount);
      debtProjections.push({ before: amount, rate, after: amount, perYear: [] });
      return { ...debt, amount, rate };
    }
    const perYear = compoundPerYear(debt.amount, rate, years);
    const after = perYear[perYear.length - 1] ?? debt.amount;
    debtProjections.push({ before: Math.round(debt.amount), rate, after, perYear });
    return { ...debt, amount: after, rate };
  });

  return {
    savingsAfter,
    debtsAfter,
    timeSkip: { years, savings: savingsProjection, debts: debtProjections },
  };
}

/** Восстановление за год скипа: годы между этапами лечат усталость и настроение. */
export const RECOVERY_PER_YEAR = { energy: 4, mood: 3 } as const;

/** Регенерация энергии/настроения за годы между сезонами (порт recoverAfterYears). */
export function recoverAfterYears(
  stats: { energy: number; mood: number },
  years: number,
): { energy: number; mood: number } {
  if (years <= 0) return { energy: stats.energy, mood: stats.mood };
  return {
    energy: Math.min(100, stats.energy + years * RECOVERY_PER_YEAR.energy),
    mood: Math.min(100, stats.mood + years * RECOVERY_PER_YEAR.mood),
  };
}

// ── индекс жизни ─────────────────────────────────────────────────────────────

export function normalizeMoney(money: number): number {
  if (money <= 0) return 0;
  const ratio = Math.log10(money + 1) / Math.log10(MONEY_REFERENCE + 1);
  return Math.max(0, Math.min(100, ratio * 100));
}

export function computeLifeIndex(
  stats: Stats,
  cardsCount: number,
  endingBonus = 0,
): number {
  const index =
    INDEX_WEIGHTS.money * normalizeMoney(stats.money) +
    INDEX_WEIGHTS.energy * stats.energy +
    INDEX_WEIGHTS.mood * stats.mood +
    INDEX_WEIGHTS.relationships * stats.relationships +
    INDEX_WEIGHTS.cardBonus * cardsCount +
    endingBonus;
  return Math.round(index * 100) / 100;
}

// ── разрешение концовки (порт resolve-ending.ts) ─────────────────────────────

export function resolveEnding(stats: Stats, flags: Record<string, boolean | number>, debts: Debt[]): string {
  const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0);
  const has = (key: string) => flags[key] === true;

  // яма — когда долг заметно больше того, что есть: умеренный кредит — не приговор
  if (totalDebt > Math.max(30_000, stats.money * 1.5)) return "debt_trap";
  if (stats.energy <= 20 || stats.mood <= 20) return "burnout";
  if (has("hasBusiness")) return "entrepreneur";
  if (has("masterDegree") || (has("higherEd") && has("academicPath"))) return "scholar";
  if (has("wentAbroad") && !has("returnedHome")) return "wanderer";
  if (has("backToVillage")) return "mountain_soul";
  if (has("craftsman")) return "golden_hands";
  if (stats.relationships >= 70 && has("familyFirst")) return "support";
  if (stats.mood >= 75 && stats.relationships >= 60) return "local_star";
  return "steady";
}
