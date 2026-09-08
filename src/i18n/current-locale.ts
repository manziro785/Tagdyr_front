import { hasLocale } from "next-intl";

import { routing, type Locale } from "./routing";

/**
 * Локаль текущей страницы для кода вне React (axios-интерсепторы, редиректы
 * через window.location). Источник — атрибут <html lang>, который проставляет
 * layout сегмента [locale]: он приходит уже в серверной разметке, поэтому не
 * может разойтись с тем, что видит игрок.
 */
export function currentLocale(): Locale {
  const lang = typeof document === "undefined" ? "" : document.documentElement.lang;
  return hasLocale(routing.locales, lang) ? lang : routing.defaultLocale;
}
