import type { Locale } from "@/i18n/routing";

import { tx, type Localized } from "./localized";
import type { Flags, Stats } from "./types";

/**
 * Шаблонный эпилог-дневник сезона. Собирается из строк дневника + настроения
 * финала. Когда подключится AI (/ai/epilogue, фаза 6 бэкенда) — это фоллбэк,
 * который обязан оставаться: эпилог должен появиться всегда.
 *
 * Контракт-дубликат с packages/content/src/epilogues.ts: правки — синхронно,
 * иначе гость и залогиненный игрок увидят разные тексты.
 */

const OPENERS: Record<number, Localized> = {
  1: {
    ru: "Последнее лето дома пролетело, как вода в арыке.",
    en: "The last summer at home rushed past like water in an irrigation ditch.",
    ky: "Үйдөгү акыркы жай арыктагы суудай зып этип өттү.",
  },
  2: {
    ru: "Эти годы пролетели как маршрутка по Чуй: шумно и быстро.",
    en: "These years flew by like a minibus down Chui Avenue: loud and fast.",
    ky: "Бул жылдар Чүй проспектисиндеги маршруткадай учуп өттү: ызы-чуу жана тез.",
  },
  3: {
    ru: "Первая работа научила большему, чем все учебники разом.",
    en: "The first job taught me more than all the textbooks put together.",
    ky: "Биринчи жумуш бардык окуу китептеринен көбүрөөк үйрөттү.",
  },
  4: {
    ru: "Взрослая жизнь оказалась не событием, а привычкой.",
    en: "Adult life turned out to be a habit rather than an event.",
    ky: "Чоң жашоо окуя эмес, адат экен.",
  },
  5: {
    ru: "К этому берегу я шёл всю дорогу — и вот он.",
    en: "I walked the whole road towards this shore — and here it is.",
    ky: "Ушул жээкке карай бүт жол жүрдүм — мына, жеттим.",
  },
};

const OPENER_FALLBACK: Localized = {
  ru: "Ещё один этап позади.",
  en: "One more stage behind me.",
  ky: "Дагы бир кезең артта калды.",
};

const CLOSERS: Record<"bright" | "tired" | "indebted" | "plain", Localized> = {
  bright: {
    ru: "Что дальше — не знаю, но иду туда с улыбкой. Кудай буюрса.",
    en: "What comes next I don't know, but I'm walking towards it with a smile. God willing.",
    ky: "Мындан ары эмне болорун билбейм, бирок ошол жакка жылмайып баратам. Кудай буюрса.",
  },
  tired: {
    ru: "Устал так, что даже чай не лечит. Но утро всё равно наступит — проверено.",
    en: "So tired that even tea doesn't help. But morning comes anyway — I've checked.",
    ky: "Чай да айыктыра албагандай чарчадым. Бирок таң баары бир атат — текшерилген.",
  },
  indebted: {
    ru: "Долги давят, но голова на месте, руки тоже. Прорвёмся.",
    en: "The debts press down, but my head is on straight and so are my hands. We'll get through.",
    ky: "Карыз басып турат, бирок баш ордунда, кол да ордунда. Өтөбүз.",
  },
  plain: {
    ru: "Не всё вышло как хотел — но всё, что вышло, теперь моё. Кудай буюрса.",
    en: "Not everything went the way I wanted — but everything that did is mine now. God willing.",
    ky: "Баары каалагандай болгон жок — бирок болгонунун баары эми меники. Кудай буюрса.",
  },
};

function moodCloser(stats: Stats): Localized {
  if (stats.mood >= 70 && stats.energy >= 50) return CLOSERS.bright;
  if (stats.mood <= 30 || stats.energy <= 25) return CLOSERS.tired;
  if (stats.money < 0) return CLOSERS.indebted;
  return CLOSERS.plain;
}

export function composeEpilogue(
  seasonNumber: number,
  diary: readonly string[],
  stats: Stats,
  locale: Locale,
): string {
  const opener = tx(OPENERS[seasonNumber] ?? OPENER_FALLBACK, locale);
  // только две последние записи: три превращали эпилог в простыню на пол-экрана
  const middle = diary.slice(-2).join(" ");
  return [opener, middle, tx(moodCloser(stats), locale)].filter(Boolean).join(" ");
}

/**
 * «Письмо себе в 17» — финальный эпилог жизни. Шаблон по флагам и статам;
 * когда появится /ai/letter — станет фоллбэком.
 */
const LETTER = {
  open: {
    ru: "Привет. Это ты — только на десять лет старше.",
    en: "Hey. It's you — just ten years older.",
    ky: "Салам. Бул сенсиң — болгону он жаш улуураак.",
  },
  business: {
    ru: "Да, у нас своё дело. Да, страшно было каждый день. Начинай раньше.",
    en: "Yes, we have our own business. Yes, it was frightening every single day. Start earlier.",
    ky: "Ооба, өз ишибиз бар. Ооба, күн сайын коркунучтуу болчу. Эртерээк башта.",
  },
  abroad: {
    ru: "Мы уехали. Деньги там есть, а вот горы — только на заставке телефона.",
    en: "We left. There's money out there, but the mountains are only on the phone wallpaper.",
    ky: "Биз кеттик. Ал жакта акча бар, тоолор болсо телефондун сүрөтүндө гана.",
  },
  village: {
    ru: "Спойлер: мы вернулись домой. И это не поражение — это точка на карте, где дышится.",
    en: "Spoiler: we came home. And it isn't a defeat — it's the spot on the map where you can breathe.",
    ky: "Спойлер: биз үйгө кайттык. Бул жеңилүү эмес — картадагы эркин дем ала турган чекит.",
  },
  family: {
    ru: "Все тои, на которых ты не пожадничал, вернулись сторицей. Мама была права.",
    en: "Every toi where you weren't stingy came back a hundredfold. Mom was right.",
    ky: "Сараңдык кылбаган тойлоруңдун баары эселеп кайтты. Апам туура айткан.",
  },
  sleep: {
    ru: "Одна просьба: спи. Серьёзно. Геройство без сна — это просто медленная авария.",
    en: "One request: sleep. Seriously. Heroics without sleep is just a slow crash.",
    ky: "Бир өтүнүч: уктап ал. Чын. Уйкусуз баатырдык — жай жүрүп жаткан кырсык.",
  },
  debts: {
    ru: "И читай договоры до цифр, а не до подписи. Проценты не спят — теперь мы это знаем.",
    en: "And read contracts down to the numbers, not down to the signature. Interest never sleeps — we know that now.",
    ky: "Келишимди кол коюуга чейин эмес, сандарга чейин окуп чык. Пайыз уктабайт — муну эми билебиз.",
  },
  generic: {
    ru: "Больших секретов нет: делай маленькие выборы чуть смелее — из них всё и складывается.",
    en: "There are no big secrets: make the small choices a little braver — everything is built out of them.",
    ky: "Чоң сыр жок: майда тандоолорду бир аз батыл жаса — баары ошолордон курулат.",
  },
} satisfies Record<string, Localized>;

const SIGNATURE: Record<Locale, (title: string) => string> = {
  ru: (title) => `Подпись: ${title}. Кудай буюрса — увидимся в зеркале.`,
  en: (title) => `Signed: ${title}. God willing — see you in the mirror.`,
  ky: (title) => `Кол койгон: ${title}. Кудай буюрса — күзгүдөн көрүшөбүз.`,
};

export function composeLetter(
  flags: Flags,
  stats: Stats,
  endingTitle: string,
  locale: Locale,
): string {
  const lines: string[] = [tx(LETTER.open, locale)];

  if (flags.hasBusiness === true) lines.push(tx(LETTER.business, locale));
  if (flags.wentAbroad === true && flags.returnedHome !== true) {
    lines.push(tx(LETTER.abroad, locale));
  }
  if (flags.backToVillage === true) lines.push(tx(LETTER.village, locale));
  if (flags.familyFirst === true) lines.push(tx(LETTER.family, locale));
  if (stats.energy <= 25) lines.push(tx(LETTER.sleep, locale));
  if (stats.money < 0 || flags.debtTrouble === true) lines.push(tx(LETTER.debts, locale));
  if (lines.length < 3) lines.push(tx(LETTER.generic, locale));

  lines.push(SIGNATURE[locale](endingTitle));
  return lines.join(" ");
}
