import { defineRouting } from "next-intl/routing";

/**
 * Языки игры. Английский — дефолтный: он живёт без префикса (`/lives`),
 * русский и кыргызский получают свой сегмент (`/ru/lives`, `/ky/lives`).
 *
 * localeDetection выключен намеренно: «дефолт — английский» должно значить
 * именно английский на голом адресе, а не «язык браузера». Язык меняется
 * только осознанно — переключателем, и остаётся в URL.
 *
 * ВНИМАНИЕ: раньше без префикса жил русский. Старые ссылки вида /lives теперь
 * ведут на английскую версию — это ожидаемо, содержимое то же.
 */
export const routing = defineRouting({
  locales: ["en", "ru", "ky"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

/**
 * Показывать ли переключатель языка в интерфейсе.
 *
 * Включён: переведён не только интерфейс, но и контент игры — события,
 * карточки знаний, концовки, эпилоги и дилемма дня с сервера.
 */
export const LOCALE_SWITCHER_VISIBLE = true;

/** Подписи для переключателя языка — на самом языке, а не в переводе. */
export const LOCALE_LABELS: Record<Locale, { short: string; full: string }> = {
  en: { short: "EN", full: "English" },
  ru: { short: "RU", full: "Русский" },
  ky: { short: "KG", full: "Кыргызча" },
};
