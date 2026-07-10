import type { SeasonMeta } from "../model/types";

/**
 * Пять этапов жизни. Возраст стартует с 17; переходы между сезонами добавляют
 * годы по SEASON_YEAR_GAPS (1, 1, 3, 5) — та же таблица, что на сервере.
 */
export const SEASONS: readonly SeasonMeta[] = [
  {
    number: 1,
    title: "Выпускник",
    ageAtStart: 17,
    place: "Родной айыл",
    scene: "valley",
    turns: 6,
    teaser: "Бишкек, универ и первая своя жизнь",
  },
  {
    number: 2,
    title: "Студенчество",
    ageAtStart: 18,
    place: "Бишкек · универ",
    scene: "campus",
    turns: 6,
    teaser: "Первая настоящая работа и первая настоящая зарплата",
  },
  {
    number: 3,
    title: "Первая работа",
    ageAtStart: 19,
    place: "Бишкек · Дордой и офисы",
    scene: "bazaar",
    turns: 6,
    teaser: "Взрослые ставки: семья, жильё, своё дело",
  },
  {
    number: 4,
    title: "Зрелость",
    ageAtStart: 22,
    place: "Бишкек · свой угол",
    scene: "city",
    turns: 6,
    teaser: "Время отдавать долги — и раздавать советы",
  },
  {
    number: 5,
    title: "Своя дорога",
    ageAtStart: 27,
    place: "Иссык-Куль · и весь Кыргызстан",
    scene: "issykkul",
    turns: 6,
    teaser: "",
  },
];

export function getSeason(n: number): SeasonMeta {
  const meta = SEASONS[n - 1];
  if (!meta) throw new Error(`Unknown season ${n}`);
  return meta;
}

/** Название стадии для подписи возраста: «18 · юность». */
export function ageStage(age: number): string {
  if (age < 19) return "юность";
  if (age < 23) return "молодость";
  if (age < 28) return "зрелость";
  return "своя дорога";
}
