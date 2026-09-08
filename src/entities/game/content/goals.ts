import type { Locale } from "@/i18n/routing";

import { tx, type Localized } from "../model/localized";
import type { Debt, Stats } from "../model/types";

/**
 * Цель сезона — чисто клиентская «морковка» поверх движка: не влияет на
 * механику и контракты с бэкендом, только задаёт игроку направление и
 * отмечается в межсезонье. Проверяется по состоянию на конец сезона.
 */
export interface SeasonGoal<T = string> {
  /** Короткая формулировка для чипа в игре. */
  text: T;
  /** Пояснение — чем цель полезна по жизни. */
  hint: T;
  check: (stats: Stats, debts: Debt[]) => boolean;
}

const GOALS: Record<number, SeasonGoal<Localized>> = {
  1: {
    text: {
      ru: "Выйти из юности без долгов",
      en: "Leave your teens debt-free",
      ky: "Өспүрүм кезден карызсыз чыгуу",
    },
    hint: {
      ru: "Долг под проценты в 17 лет растёт быстрее, чем ты",
      en: "A loan taken at 17 grows faster than you do",
      ky: "17 жашта алынган пайыздуу карыз сенден ыкчам өсөт",
    },
    check: (_stats, debts) => debts.length === 0,
  },
  2: {
    text: {
      ru: "Собрать подушку: 20 000 с",
      en: "Build a cushion: 20,000 som",
      ky: "Жаздык топтоо: 20 000 сом",
    },
    hint: {
      ru: "Три месяца расходов на чёрный день — и любой кризис мягче",
      en: "Three months of expenses for a rainy day makes any crisis softer",
      ky: "Кара күнгө үч айлык чыгым — кандай кризис болбосун жумшартат",
    },
    check: (stats) => stats.money >= 20_000,
  },
  3: {
    text: {
      ru: "Сберечь отношения: 55+",
      en: "Keep relationships at 55+",
      ky: "Мамилени сактоо: 55+",
    },
    hint: {
      ru: "Карьера карьерой, а на той зовут людей, не должности",
      en: "Career is career, but it's people who get invited to a toi, not job titles",
      ky: "Карьера — карьера, бирок тойго кызматты эмес, адамды чакырышат",
    },
    check: (stats) => stats.relationships >= 55,
  },
  4: {
    text: {
      ru: "Не выгореть: энергия 45+",
      en: "Don't burn out: energy 45+",
      ky: "Күйүп кетпөө: күч-кубат 45+",
    },
    hint: {
      ru: "Взрослая жизнь — марафон; на нуле не добежишь",
      en: "Adult life is a marathon; you won't finish on empty",
      ky: "Чоң жашоо — марафон; нөлдө чуркап жетпейсиң",
    },
    check: (stats) => stats.energy >= 45,
  },
  5: {
    text: {
      ru: "Прийти к покою: настроение 55+",
      en: "Arrive at peace: mood 55+",
      ky: "Тынчтыкка жетүү: маанай 55+",
    },
    hint: {
      ru: "К зрелости важнее не сколько накопил, а как живётся",
      en: "By this age what matters isn't how much you saved but how you live",
      ky: "Бул курактта канча топтогонуң эмес, кандай жашаганың маанилүү",
    },
    check: (stats) => stats.mood >= 55,
  },
};

export function getSeasonGoal(season: number, locale: Locale): SeasonGoal | null {
  const goal = GOALS[season];
  if (!goal) return null;
  return { ...goal, text: tx(goal.text, locale), hint: tx(goal.hint, locale) };
}
