import type { SeasonMeta } from "./types";
import type { Stats } from "./types";

/**
 * Шаблонный эпилог-дневник сезона. Собирается из строк дневника + настроения
 * финала. Когда подключится AI (/ai/epilogue, фаза 6 бэкенда) — это фоллбэк,
 * который обязан оставаться: эпилог должен появиться всегда.
 */

const OPENERS: Record<number, string> = {
  1: "Последнее лето дома пролетело, как вода в арыке.",
  2: "Эти годы пролетели как маршрутка по Чуй: шумно и быстро.",
  3: "Первая работа научила большему, чем все учебники разом.",
  4: "Взрослая жизнь оказалась не событием, а привычкой.",
  5: "К этому берегу я шёл всю дорогу — и вот он.",
};

function moodCloser(stats: Stats): string {
  if (stats.mood >= 70 && stats.energy >= 50) {
    return "Что дальше — не знаю, но иду туда с улыбкой. Кудай буюрса.";
  }
  if (stats.mood <= 30 || stats.energy <= 25) {
    return "Устал так, что даже чай не лечит. Но утро всё равно наступит — проверено.";
  }
  if (stats.money < 0) {
    return "Долги давят, но голова на месте, руки тоже. Прорвёмся.";
  }
  return "Не всё вышло как хотел — но всё, что вышло, теперь моё. Кудай буюрса.";
}

export function composeEpilogue(
  season: SeasonMeta,
  diary: readonly string[],
  stats: Stats,
): string {
  const opener = OPENERS[season.number] ?? "Ещё один этап позади.";
  // 2–3 самые характерные записи, чтобы эпилог читался, а не листался
  const middle = diary.slice(-3).join(" ");
  return [opener, middle, moodCloser(stats)].filter(Boolean).join(" ");
}

/**
 * «Письмо себе в 17» — финальный эпилог жизни. Шаблон по флагам и статам;
 * когда появится /ai/letter — станет фоллбэком.
 */
export function composeLetter(
  flags: Record<string, boolean | number>,
  stats: Stats,
  endingTitle: string,
): string {
  const lines: string[] = ["Привет. Это ты — только на десять лет старше."];

  if (flags.hasBusiness === true) {
    lines.push("Да, у нас своё дело. Да, страшно было каждый день. Начинай раньше.");
  }
  if (flags.wentAbroad === true && flags.returnedHome !== true) {
    lines.push("Мы уехали. Деньги там есть, а вот горы — только на заставке телефона.");
  }
  if (flags.backToVillage === true) {
    lines.push("Спойлер: мы вернулись домой. И это не поражение — это точка на карте, где дышится.");
  }
  if (flags.familyFirst === true) {
    lines.push("Все тои, на которых ты не пожадничал, вернулись сторицей. Мама была права.");
  }
  if (stats.energy <= 25) {
    lines.push("Одна просьба: спи. Серьёзно. Геройство без сна — это просто медленная авария.");
  }
  if (stats.money < 0 || flags.debtTrouble === true) {
    lines.push("И читай договоры до цифр, а не до подписи. Проценты не спят — теперь мы это знаем.");
  }
  if (lines.length < 3) {
    lines.push("Больших секретов нет: делай маленькие выборы чуть смелее — из них всё и складывается.");
  }
  lines.push(`Подпись: ${endingTitle}. Кудай буюрса — увидимся в зеркале.`);
  return lines.join(" ");
}
