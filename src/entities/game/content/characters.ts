import type { Character } from "../model/types";

/**
 * Ростер. id/code/startStats — контракт с бэкендом (packages/content):
 * createLife валидирует characterId на сервере. place/trait/accent — витрина.
 */
export const CHARACTERS: readonly Character[] = [
  {
    id: "char_aibek",
    code: "aibek",
    name: "Айбек",
    age: 17,
    description:
      "Парень из небольшого города, мечтает вырваться и встать на ноги.",
    startStats: { money: 5000, energy: 80, mood: 60, relationships: 50 },
    unlockCondition: null,
    isUnlockable: false,
    place: "Двор, Бишкек",
    trait: "Упрямый",
    accent: "terracotta",
  },
  {
    id: "char_aizhan",
    code: "aizhan",
    name: "Айжан",
    age: 17,
    description:
      "Дочь учителей, отличница. Выбирает между долгом перед семьёй и своей мечтой.",
    startStats: { money: 3000, energy: 70, mood: 70, relationships: 65 },
    unlockCondition: null,
    isUnlockable: false,
    place: "Село, Нарын",
    trait: "Смышлёная",
    accent: "sage",
  },
  {
    id: "char_marat",
    code: "marat",
    name: "Марат",
    age: 17,
    description:
      "Вырос в достатке, но без опоры внутри. Деньги есть — смысла пока нет.",
    startStats: { money: 20000, energy: 60, mood: 50, relationships: 40 },
    unlockCondition: "ending:support",
    isUnlockable: true,
    place: "Центр, Бишкек",
    trait: "Ищущий",
    accent: "rose",
  },
];

export function getCharacter(id: string): Character | undefined {
  return CHARACTERS.find((c) => c.id === id);
}
