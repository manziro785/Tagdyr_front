import { routing, type Locale } from "@/i18n/routing";

import type { Effects, EventChoice, GameEvent } from "./types";

/**
 * Тексты игрового контента (события, карточки, концовки) лежат сразу на всех
 * языках: `{ ru: "…", en: "…", ky: "…" }`. Строка выбирается в момент показа
 * через `tx()`.
 *
 * Почему не messages/*.json, как интерфейс: строки дневника рождаются в
 * zustand-сторе и в движке — там нет React и нет доступа к useTranslations.
 * Плюс перевод удобнее править, когда три языка одной реплики стоят рядом.
 */
export type Localized = Record<Locale, string>;

/** Строка контента на нужном языке; пустой перевод падает на дефолтную локаль. */
export function tx(value: Localized, locale: Locale): string {
  return value[locale] || value[routing.defaultLocale];
}

/**
 * Эффекты выбора с уже выбранным языком дневниковой строки.
 *
 * Переводимые поля вынимаем деструктуризацией, а не переписываем спредом:
 * иначе в типе результата остался бы старый `Localized`.
 */
export function localizeEffects(effects: Effects<Localized>, locale: Locale): Effects {
  const { diary, ...rest } = effects;
  return diary ? { ...rest, diary: tx(diary, locale) } : rest;
}

function localizeChoice(choice: EventChoice<Localized>, locale: Locale): EventChoice {
  const { text, effects, failEffects, failText, ...rest } = choice;
  return {
    ...rest,
    text: tx(text, locale),
    effects: localizeEffects(effects, locale),
    ...(failEffects ? { failEffects: localizeEffects(failEffects, locale) } : {}),
    ...(failText ? { failText: tx(failText, locale) } : {}),
  };
}

/** Событие целиком на одном языке — то, что рисует TurnView. */
export function localizeEvent(event: GameEvent<Localized>, locale: Locale): GameEvent {
  const { kicker, text, choices, ...rest } = event;
  return {
    ...rest,
    kicker: tx(kicker, locale),
    text: tx(text, locale),
    choices: choices.map((c) => localizeChoice(c, locale)),
  };
}
