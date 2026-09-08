import type { Locale } from "@/i18n/routing";

import { tx, type Localized } from "../model/localized";
import type { Character } from "../model/types";

/**
 * Ростер. id/code/startStats — контракт с бэкендом (packages/content):
 * createLife валидирует characterId на сервере. place/trait/accent — витрина.
 *
 * Имена и описания — на трёх языках; наружу отдаём уже выбранный язык.
 */
const CHARACTERS: readonly Character<Localized>[] = [
  {
    id: "char_aibek",
    code: "aibek",
    name: { ru: "Айбек", en: "Aibek", ky: "Айбек" },
    age: 17,
    description: {
      ru: "Парень из небольшого города, мечтает вырваться и встать на ноги.",
      en: "A guy from a small town who dreams of breaking out and standing on his own feet.",
      ky: "Кичинекей шаардан чыккан жигит, чоң жашоого чыгып, бутуна турууну эңсейт.",
    },
    startStats: { money: 5000, energy: 80, mood: 60, relationships: 50 },
    unlockCondition: null,
    isUnlockable: false,
    place: { ru: "Двор, Бишкек", en: "A courtyard, Bishkek", ky: "Короо, Бишкек" },
    trait: { ru: "Упрямый", en: "Stubborn", ky: "Өжөр" },
    accent: "terracotta",
  },
  {
    id: "char_aizhan",
    code: "aizhan",
    name: { ru: "Айжан", en: "Aizhan", ky: "Айжан" },
    age: 17,
    description: {
      ru: "Дочь учителей, отличница. Выбирает между долгом перед семьёй и своей мечтой.",
      en: "A teachers' daughter, top of her class. Torn between duty to her family and her own dream.",
      ky: "Мугалимдердин кызы, мыкты окуучу. Үй-бүлө алдындагы милдет менен өз кыялынын ортосунда турат.",
    },
    startStats: { money: 3000, energy: 70, mood: 70, relationships: 65 },
    unlockCondition: null,
    isUnlockable: false,
    place: { ru: "Село, Нарын", en: "A village, Naryn", ky: "Айыл, Нарын" },
    trait: { ru: "Смышлёная", en: "Sharp-minded", ky: "Тапкыч" },
    accent: "sage",
  },
  {
    id: "char_marat",
    code: "marat",
    name: { ru: "Марат", en: "Marat", ky: "Марат" },
    age: 17,
    description: {
      ru: "Вырос в достатке, но без опоры внутри. Деньги есть — смысла пока нет.",
      en: "Grew up with money but without an anchor inside. He has funds; meaning is still missing.",
      ky: "Молчулукта чоңойгон, бирок ичинде таянычы жок. Акча бар — маани азырынча жок.",
    },
    startStats: { money: 20000, energy: 60, mood: 50, relationships: 40 },
    unlockCondition: "ending:support",
    isUnlockable: true,
    place: { ru: "Центр, Бишкек", en: "City centre, Bishkek", ky: "Борбор, Бишкек" },
    trait: { ru: "Ищущий", en: "Searching", ky: "Изденген" },
    accent: "rose",
  },
];

function localize(character: Character<Localized>, locale: Locale): Character {
  return {
    ...character,
    name: tx(character.name, locale),
    description: tx(character.description, locale),
    place: tx(character.place, locale),
    trait: tx(character.trait, locale),
  };
}

/** Весь ростер на одном языке. */
export function getCharacters(locale: Locale): Character[] {
  return CHARACTERS.map((c) => localize(c, locale));
}

export function getCharacter(id: string, locale: Locale): Character | undefined {
  const character = CHARACTERS.find((c) => c.id === id);
  return character && localize(character, locale);
}
