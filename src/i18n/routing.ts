import { defineRouting } from "next-intl/routing";

/**
 * Языки игры. Русский — исходный: на нём написан весь контент, поэтому он же
 * дефолтный и живёт без префикса в URL (`/lives`), а кыргызский и английский
 * получают свой сегмент (`/ky/lives`, `/en/lives`).
 *
 * localePrefix "as-needed" выбран ради совместимости: все существующие ссылки,
 * закладки и share-адреса продолжают работать без редиректов.
 */
export const routing = defineRouting({
  locales: ["ru", "ky", "en"],
  defaultLocale: "ru",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

/**
 * Показывать ли переключатель языка в интерфейсе.
 *
 * Пока false: интерфейс на en переведён полностью, а КОНТЕНТ игры (события,
 * карточки знаний, концовки) — нет, и кыргызский переведён примерно на
 * пятнадцать процентов. Кнопка «EN», за которой начинается русский текст
 * событий, выглядит хуже, чем честная одноязычная версия.
 *
 * Сами локали работают: /en и /ky открываются по прямой ссылке — так удобно
 * показывать прогресс перевода. Ставим true, когда контент переведён.
 */
export const LOCALE_SWITCHER_VISIBLE = false;

/** Подписи для переключателя языка — на самом языке, а не в переводе. */
export const LOCALE_LABELS: Record<Locale, { short: string; full: string }> = {
  ru: { short: "RU", full: "Русский" },
  ky: { short: "KG", full: "Кыргызча" },
  en: { short: "EN", full: "English" },
};
