import type { LucideIcon } from "lucide-react";
import { Coins, Heart, Smile, Zap } from "lucide-react";

export type SceneStat = {
  key: "money" | "energy" | "mood" | "rel";
  label: string;
  icon: LucideIcon;
  value: string;
  unit?: string;
  pct: number;
  color: string;
  tint: string;
  filled?: boolean;
};

export type SceneDelta = { text: string; dir: "up" | "down" };

export type SceneChoice = {
  text: string;
  primary?: boolean;
  chance?: number;
  deltas: SceneDelta[];
};

export const SCENE = {
  name: "Азамат",
  age: 18,
  stage: "Молодость",
  place: "Двор в Бишкеке",
  stats: [
    {
      key: "money",
      label: "Деньги",
      icon: Coins,
      value: "5 000",
      unit: "с",
      pct: 45,
      color: "var(--color-tg-amber)",
      tint: "var(--color-tg-amber-tint)",
    },
    {
      key: "energy",
      label: "Энергия",
      icon: Zap,
      value: "80%",
      pct: 80,
      color: "var(--color-tg-terracotta)",
      tint: "var(--color-tg-terra-tint)",
    },
    {
      key: "mood",
      label: "Настроение",
      icon: Smile,
      value: "75%",
      pct: 75,
      color: "var(--color-tg-sage)",
      tint: "var(--color-tg-sage-tint)",
    },
    {
      key: "rel",
      label: "Отношения",
      icon: Heart,
      value: "60%",
      pct: 60,
      color: "var(--color-tg-rose)",
      tint: "var(--color-tg-rose-tint)",
      filled: true,
    },
  ] satisfies SceneStat[],
  event: {
    kicker: "Двор · той у родни",
    text: "Старший двоюродный женится — вся родня скидывается на подарок. Мама шепчет: «С пустыми руками неудобно, минимум 2 000…». А стипендия только-только пришла. Кудай буюрса, и тебе так сыграют.",
  },
  choices: [
    {
      text: "Скинуться на подарок — 2 000 сом",
      primary: true,
      deltas: [
        { text: "−2 000 с", dir: "down" },
        { text: "Отношения", dir: "up" },
      ],
    },
    {
      text: "Дать 500 и помочь с тоем руками",
      chance: 65,
      deltas: [
        { text: "−500 с", dir: "down" },
        { text: "Энергия", dir: "down" },
        { text: "Отношения", dir: "up" },
      ],
    },
    {
      text: "Не ходить, сберечь деньги",
      deltas: [
        { text: "Деньги", dir: "up" },
        { text: "Отношения", dir: "down" },
      ],
    },
  ] satisfies SceneChoice[],
} as const;
