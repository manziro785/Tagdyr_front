import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";
import en from "../../messages/en.json";

type Messages = typeof en;
type Dict = Record<string, unknown>;

/**
 * Недостающие ключи добираем из английского словаря (он дефолтный и полный).
 * Если в переводе забыли ключ, игрок увидит английскую строку, а не «lives.title»
 * — и это заметно на глаз, в отличие от пустого места.
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
      ? en
      : (withFallback(
          en as Dict,
          (await import(`../../messages/${locale}.json`)).default as Dict,
        ) as Messages);

  return { locale, messages };
});
