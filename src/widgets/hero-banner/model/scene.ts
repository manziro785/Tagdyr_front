import type { LucideIcon } from "lucide-react";
import { Coins, Heart, Smile, Zap } from "lucide-react";

/**
 * Демо-сцена в макете телефона на лендинге. Цифры и цвета — здесь, тексты —
 * в словаре (phone.demo / stats): витрина должна говорить на языке посетителя.
 */

export type SceneStat = {
  key: "money" | "energy" | "mood" | "rel";
  /** Ключ подписи в словаре stats. */
  labelKey: "money" | "energy" | "mood" | "relationships";
  icon: LucideIcon;
  value: string;
  pct: number;
  color: string;
  tint: string;
  filled?: boolean;
};

export type SceneDelta = {
  /** Готовая подпись (сумма) или ключ стата — что-то одно. */
  text?: string;
  labelKey?: "money" | "energy" | "mood" | "relationships";
  dir: "up" | "down";
};

export type SceneChoice = {
  textKey: "choiceGift" | "choiceHelp" | "choiceSkip";
  primary?: boolean;
  chance?: number;
  deltas: SceneDelta[];
};

export const SCENE = {
  age: 18,
  stats: [
    {
      key: "money",
      labelKey: "money",
      icon: Coins,
      value: "5 000",
      pct: 45,
      color: "var(--color-tg-amber)",
      tint: "var(--color-tg-amber-tint)",
    },
    {
      key: "energy",
      labelKey: "energy",
      icon: Zap,
      value: "80%",
      pct: 80,
      color: "var(--color-tg-terracotta)",
      tint: "var(--color-tg-terra-tint)",
    },
    {
      key: "mood",
      labelKey: "mood",
      icon: Smile,
      value: "75%",
      pct: 75,
      color: "var(--color-tg-sage)",
      tint: "var(--color-tg-sage-tint)",
    },
    {
      key: "rel",
      labelKey: "relationships",
      icon: Heart,
      value: "60%",
      pct: 60,
      color: "var(--color-tg-rose)",
      tint: "var(--color-tg-rose-tint)",
      filled: true,
    },
  ] satisfies SceneStat[],
  choices: [
    {
      textKey: "choiceGift",
      primary: true,
      deltas: [
        { text: "deltaGift", dir: "down" },
        { labelKey: "relationships", dir: "up" },
      ],
    },
    {
      textKey: "choiceHelp",
      chance: 65,
      deltas: [
        { text: "deltaHelp", dir: "down" },
        { labelKey: "energy", dir: "down" },
        { labelKey: "relationships", dir: "up" },
      ],
    },
    {
      textKey: "choiceSkip",
      deltas: [
        { labelKey: "money", dir: "up" },
        { labelKey: "relationships", dir: "down" },
      ],
    },
  ] satisfies SceneChoice[],
} as const;
