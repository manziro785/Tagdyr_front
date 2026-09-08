import type { Locale } from "@/i18n/routing";

import { tx, type Localized } from "../model/localized";
import type { Ending } from "../model/types";

/**
 * Галерея концовок — копия packages/content/endings бэкенда (контракт по кодам).
 * Код разрешается движком (resolveEnding) из финального состояния.
 *
 * Тексты — на трёх языках; наружу отдаём уже выбранный язык.
 */
const ENDINGS: readonly Ending<Localized>[] = [
  {
    id: "ending_entrepreneur",
    code: "entrepreneur",
    title: { ru: "Предприниматель", en: "Entrepreneur", ky: "Ишкер" },
    archetype: { ru: "Дело", en: "Business", ky: "Иш" },
    description: {
      ru: "Начал с контейнера на Дордое — закончил своим делом. Теперь родня занимает у тебя, и ты даёшь без процентов.",
      en: "Started with a container at Dordoi and ended up with a business of your own. Now the relatives borrow from you — and you lend without interest.",
      ky: "Дордойдогу контейнерден баштап, өз ишиңе жеттиң. Эми тууганлар сенден карыз алат, сен пайызсыз бересиң.",
    },
    bonus: 8,
  },
  {
    id: "ending_support",
    code: "support",
    title: { ru: "Опора", en: "The Anchor", ky: "Таяныч" },
    archetype: { ru: "Семья", en: "Family", ky: "Үй-бүлө" },
    description: {
      ru: "Ты тот, кому звонят первым — и в беде, и на той. Не самый богатый, зато за твоим дасторконом всегда людно.",
      en: "You're the one they call first — in trouble and at a toi. Not the richest, but there's always a crowd around your dastorkon.",
      ky: "Сен биринчи чалына турган адамсың — кайгыда да, тойдо да. Эң бай эмессиң, бирок дасторконуң дайыма толо.",
    },
    bonus: 8,
  },
  {
    id: "ending_scholar",
    code: "scholar",
    title: { ru: "Учёный", en: "The Scholar", ky: "Окумуштуу" },
    archetype: { ru: "Знание", en: "Knowledge", ky: "Билим" },
    description: {
      ru: "Пока другие считали выручку, ты считал формулы. Магистратура, конференции — и студенты, которые зовут тебя «агай».",
      en: "While others counted revenue, you counted formulas. A master's degree, conferences — and students who call you “agai”.",
      ky: "Башкалар түшкөн акчаны санаганда, сен формулаларды эсептедиң. Магистратура, конференциялар — жана сени «агай» деп чакырган студенттер.",
    },
    bonus: 7,
  },
  {
    id: "ending_wanderer",
    code: "wanderer",
    title: { ru: "Кочевник", en: "The Nomad", ky: "Көчмөн" },
    archetype: { ru: "Дорога", en: "The Road", ky: "Жол" },
    description: {
      ru: "Москва, Алматы, дальше — больше. Переводы домой приходят исправно, а вот сам ты — всё реже. Горы снятся по ночам.",
      en: "Moscow, Almaty, and further still. The transfers home arrive like clockwork; you yourself arrive less and less. The mountains visit you at night.",
      ky: "Москва, Алматы, андан ары — көбүрөөк. Үйгө которуулар так келет, өзүң болсо барган сайын сейрек. Тоолор түшүңө кирет.",
    },
    bonus: 5,
  },
  {
    id: "ending_mountain_soul",
    code: "mountain_soul",
    title: { ru: "Душа гор", en: "Mountain Soul", ky: "Тоо жаны" },
    archetype: { ru: "Корни", en: "Roots", ky: "Тамыр" },
    description: {
      ru: "Город попробовал — не зашло. Вернулся, поставил юрту для туристов, и утро начинается с гор, а не с маршрутки.",
      en: "You tried the city — it didn't take. You came back, put up a yurt for tourists, and now your morning starts with mountains instead of a minibus.",
      ky: "Шаарды сынап көрдүң — жакпады. Кайтып келип, туристтерге боз үй тиктиң, эми эртең мененкиң маршруткадан эмес, тоодон башталат.",
    },
    bonus: 6,
  },
  {
    id: "ending_golden_hands",
    code: "golden_hands",
    title: { ru: "Золотые руки", en: "Golden Hands", ky: "Алтын кол" },
    archetype: { ru: "Ремесло", en: "Craft", ky: "Кесип" },
    description: {
      ru: "Твои руки помнят каждый болт Бишкека. Мастера с таким именем в очередь не ставят — к нему записываются.",
      en: "Your hands remember every bolt in Bishkek. A master with that name doesn't wait in line — people book an appointment.",
      ky: "Колдоруң Бишкектеги ар бир бурама болтту эстейт. Мындай атагы бар устаны кезекке турушпайт — ага жазылышат.",
    },
    bonus: 6,
  },
  {
    id: "ending_local_star",
    code: "local_star",
    title: { ru: "Своя звезда", en: "Local Star", ky: "Өз жылдызың" },
    archetype: { ru: "Люди", en: "People", ky: "Эл" },
    description: {
      ru: "Не богат, не знаменит — но во дворе без тебя не начинается ни один той. Быть любимым — тоже капитал.",
      en: "Not rich, not famous — but no toi in the neighbourhood starts without you. Being loved is capital too.",
      ky: "Бай да эмессиң, атактуу да эмессиң — бирок короодо сенсиз бир да той башталбайт. Сүйүктүү болуу да капитал.",
    },
    bonus: 5,
  },
  {
    id: "ending_steady",
    code: "steady",
    title: { ru: "Крепкий середняк", en: "Steady Middle", ky: "Бекем ортоңку" },
    archetype: { ru: "Стабильность", en: "Stability", ky: "Туруктуулук" },
    description: {
      ru: "Без взлётов и падений: работа, дом, копейка на чёрный день. Кто-то скажет «скучно» — ты скажешь «спокойно».",
      en: "No highs, no crashes: a job, a home, a little put aside for a rainy day. Some will call it boring — you call it calm.",
      ky: "Көтөрүлүүсүз, кулоосуз: жумуш, үй, кара күнгө чогултулган тыйын. Кимдир бирөө «кызыксыз» дейт — сен «тынч» дейсиң.",
    },
    bonus: 4,
  },
  {
    id: "ending_burnout",
    code: "burnout",
    title: { ru: "Выгоревший", en: "Burned Out", ky: "Күйүп бүткөн" },
    archetype: { ru: "Урок", en: "A Lesson", ky: "Сабак" },
    description: {
      ru: "Всё успевал, всем помогал, себя — забыл. Батарейка села на самом интересном месте. В следующей жизни — беречь энергию.",
      en: "You made every deadline, helped everyone, and forgot yourself. The battery died at the most interesting part. Next life: guard your energy.",
      ky: "Баарына жетиштиң, баарына жардам бердиң, өзүңдү унуттуң. Батарейка эң кызык жеринде отуруп калды. Кийинки жашоодо — күчүңдү аяш керек.",
    },
    bonus: 2,
  },
  {
    id: "ending_debt_trap",
    code: "debt_trap",
    title: { ru: "Долговая яма", en: "The Debt Pit", ky: "Карыз чуңкуру" },
    archetype: { ru: "Урок", en: "A Lesson", ky: "Сабак" },
    description: {
      ru: "Проценты росли, пока ты спал. 20 000 стали 60 000, и половина зарплаты уходит «на вчера». Сложный процент работает и против тебя.",
      en: "The interest grew while you slept. 20,000 became 60,000, and half your salary now goes to “yesterday”. Compound interest works against you too.",
      ky: "Сен уктап жатканда пайыз өстү. 20 000 60 000 болду, айлыктын жарымы «кечээкиге» кетет. Татаал пайыз сага каршы да иштейт.",
    },
    bonus: 2,
  },
];

function localize(ending: Ending<Localized>, locale: Locale): Ending {
  return {
    ...ending,
    title: tx(ending.title, locale),
    archetype: tx(ending.archetype, locale),
    description: tx(ending.description, locale),
  };
}

/** Вся галерея концовок на одном языке. */
export function getEndings(locale: Locale): Ending[] {
  return ENDINGS.map((e) => localize(e, locale));
}

export function getEnding(code: string, locale: Locale): Ending | undefined {
  const ending = ENDINGS.find((e) => e.code === code);
  return ending && localize(ending, locale);
}
