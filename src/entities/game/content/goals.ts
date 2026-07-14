import type { Debt, Stats } from "../model/types";

/**
 * Цель сезона — чисто клиентская «морковка» поверх движка: не влияет на
 * механику и контракты с бэкендом, только задаёт игроку направление и
 * отмечается в межсезонье. Проверяется по состоянию на конец сезона.
 */
export interface SeasonGoal {
  /** Короткая формулировка для чипа в игре. */
  text: string;
  /** Пояснение — чем цель полезна по жизни. */
  hint: string;
  check: (stats: Stats, debts: Debt[]) => boolean;
}

const GOALS: Record<number, SeasonGoal> = {
  1: {
    text: "Выйти из юности без долгов",
    hint: "Долг под проценты в 17 лет растёт быстрее, чем ты",
    check: (_stats, debts) => debts.length === 0,
  },
  2: {
    text: "Собрать подушку: 20 000 с",
    hint: "Три месяца расходов на чёрный день — и любой кризис мягче",
    check: (stats) => stats.money >= 20_000,
  },
  3: {
    text: "Сберечь отношения: 55+",
    hint: "Карьера карьерой, а на той зовут людей, не должности",
    check: (stats) => stats.relationships >= 55,
  },
  4: {
    text: "Не выгореть: энергия 45+",
    hint: "Взрослая жизнь — марафон; на нуле не добежишь",
    check: (stats) => stats.energy >= 45,
  },
  5: {
    text: "Прийти к покою: настроение 55+",
    hint: "К зрелости важнее не сколько накопил, а как живётся",
    check: (stats) => stats.mood >= 55,
  },
};

export function getSeasonGoal(season: number): SeasonGoal | null {
  return GOALS[season] ?? null;
}
