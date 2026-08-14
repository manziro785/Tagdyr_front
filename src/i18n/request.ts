import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";
import ru from "../../messages/ru.json";

type Messages = typeof ru;
type Dict = Record<string, unknown>;

/**
 * Недостающие ключи добираем из русского словаря. Пока переводы не готовы,
 * кыргызская и английская версии показывают русский текст вместо пустых мест
 * или технических ключей — так можно катить перевод по частям.
 */
function withFallback(base: Dict, override: Dict): Dict {
  const out: Dict = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = out[key];
    out[key] =
      isPlainObject(current) && isPlainObject(value)
        ? withFallback(current, value)
        : value;
  }
  return out;
}

function isPlainObject(value: unknown): value is Dict {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages =
    locale === routing.defaultLocale
      ? ru
      : (withFallback(
          ru as Dict,
          (await import(`../../messages/${locale}.json`)).default as Dict,
        ) as Messages);

  return { locale, messages };
});
