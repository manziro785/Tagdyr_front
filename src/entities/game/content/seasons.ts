import type { Locale } from "@/i18n/routing";

import { tx, type Localized } from "../model/localized";
import type { SceneName, SeasonMeta } from "../model/types";
import { hashSeed } from "../model/rng";

/**
 * Пять этапов жизни. Возраст стартует с 17; переходы между сезонами добавляют
 * годы по SEASON_YEAR_GAPS (1, 1, 3, 5) — та же таблица, что на сервере.
 *
 * Названия и тизеры — на трёх языках. Механика (turns) берётся отдельной
 * функцией seasonTurns(), чтобы движок хода не зависел от языка.
 */
const SEASONS: readonly SeasonMeta<Localized>[] = [
  {
    number: 1,
    title: { ru: "Выпускник", en: "Graduate", ky: "Бүтүрүүчү" },
    ageAtStart: 17,
    place: { ru: "Родной айыл", en: "Home village", ky: "Туулган айыл" },
    scene: "valley",
    turns: 6,
    teaser: {
      ru: "Бишкек, универ и первая своя жизнь",
      en: "Bishkek, university and a life of your own",
      ky: "Бишкек, университет жана өз алдынча жашоо",
    },
  },
  {
    number: 2,
    title: { ru: "Студенчество", en: "Student years", ky: "Студенттик кез" },
    ageAtStart: 18,
    place: { ru: "Бишкек · универ", en: "Bishkek · university", ky: "Бишкек · университет" },
    scene: "campus",
    turns: 6,
    teaser: {
      ru: "Первая настоящая работа и первая настоящая зарплата",
      en: "Your first real job and your first real paycheck",
      ky: "Биринчи чыныгы жумуш жана биринчи чыныгы айлык",
    },
  },
  {
    number: 3,
    title: { ru: "Первая работа", en: "First job", ky: "Биринчи жумуш" },
    ageAtStart: 19,
    place: {
      ru: "Бишкек · Дордой и офисы",
      en: "Bishkek · Dordoi and offices",
      ky: "Бишкек · Дордой жана офистер",
    },
    scene: "bazaar",
    turns: 6,
    teaser: {
      ru: "Взрослые ставки: семья, жильё, своё дело",
      en: "Grown-up stakes: family, housing, a business of your own",
      ky: "Чоң кишинин коюмдары: үй-бүлө, турак жай, өз иши",
    },
  },
  {
    number: 4,
    title: { ru: "Зрелость", en: "Maturity", ky: "Жетилүү" },
    ageAtStart: 22,
    place: {
      ru: "Бишкек · свой угол",
      en: "Bishkek · a place of your own",
      ky: "Бишкек · өз бурчуң",
    },
    scene: "city",
    turns: 6,
    teaser: {
      ru: "Время отдавать долги — и раздавать советы",
      en: "Time to pay off debts — and to hand out advice",
      ky: "Карыз төлөй турган — жана кеңеш бере турган убак",
    },
  },
  {
    number: 5,
    title: { ru: "Своя дорога", en: "Your own road", ky: "Өз жолуң" },
    ageAtStart: 27,
    place: {
      ru: "Иссык-Куль · и весь Кыргызстан",
      en: "Issyk-Kul · and all of Kyrgyzstan",
      ky: "Ысык-Көл · жана бүт Кыргызстан",
    },
    scene: "issykkul",
    turns: 6,
    teaser: null,
  },
];

function raw(n: number): SeasonMeta<Localized> {
  const meta = SEASONS[n - 1];
  if (!meta) throw new Error(`Unknown season ${n}`);
  return meta;
}

function localize(meta: SeasonMeta<Localized>, locale: Locale): SeasonMeta {
  return {
    ...meta,
    title: tx(meta.title, locale),
    place: tx(meta.place, locale),
    teaser: meta.teaser ? tx(meta.teaser, locale) : null,
  };
}

/** Мета сезона для экрана. Механике язык не нужен — там seasonTurns(). */
export function getSeason(n: number, locale: Locale): SeasonMeta {
  return localize(raw(n), locale);
}

export function getSeasons(locale: Locale): SeasonMeta[] {
  return SEASONS.map((s) => localize(s, locale));
}

/** Сколько ходов в сезоне — чистая механика, без языка. */
export function seasonTurns(n: number): number {
  return raw(n).turns;
}

/**
 * Вариации фона по сезонам: базовая сцена + альтернативы той же темы.
 * Выбор детерминирован сидом жизни — «один сид, одна история» сохраняется,
 * но у разных жизней разные пейзажи.
 */
const SCENE_VARIANTS: Record<SceneName, SceneName[]> = {
  valley: ["valley", "jailoo"],
  campus: ["campus", "city"],
  bazaar: ["bazaar", "city-evening"],
  city: ["city", "city-evening"],
  issykkul: ["issykkul", "jailoo"],
  jailoo: ["jailoo"],
  "city-evening": ["city-evening"],
};

export function sceneForRun(
  season: Pick<SeasonMeta, "number" | "scene">,
  seed: string,
): SceneName {
  const pool = SCENE_VARIANTS[season.scene];
  return pool[hashSeed(`${seed}:scene:${season.number}`) % pool.length]!;
}

/** Название стадии для подписи возраста: «18 · юность». */
const AGE_STAGES: { until: number; label: Localized }[] = [
  { until: 19, label: { ru: "юность", en: "youth", ky: "өспүрүм" } },
  { until: 23, label: { ru: "молодость", en: "young adult", ky: "жаштык" } },
  { until: 28, label: { ru: "зрелость", en: "prime years", ky: "жетилүү" } },
];

const AGE_STAGE_LAST: Localized = {
  ru: "своя дорога",
  en: "own road",
  ky: "өз жолу",
};

export function ageStage(age: number, locale: Locale): string {
  const stage = AGE_STAGES.find((s) => age < s.until);
  return tx(stage?.label ?? AGE_STAGE_LAST, locale);
}
