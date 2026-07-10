import { Coins, Heart, Smile, Zap, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Stats } from "../model/types";

export function formatMoney(value: number): string {
  const sign = value < 0 ? "−" : "";
  return sign + Math.abs(Math.round(value)).toLocaleString("ru-RU").replace(/ /g, " ");
}

/** Заполнение денежного бара: лог-шкала до 200 000 с (визуальная, не игровая). */
export function moneyPct(money: number): number {
  if (money <= 0) return 0;
  return Math.min(100, (Math.log10(money + 1) / Math.log10(200_001)) * 100);
}

export interface StatView {
  key: keyof Stats;
  label: string;
  icon: LucideIcon;
  value: string;
  pct: number;
  color: string;
  filled?: boolean;
}

export function statViews(stats: Stats): StatView[] {
  return [
    {
      key: "money",
      label: "Деньги",
      icon: Coins,
      value: formatMoney(stats.money),
      pct: moneyPct(stats.money),
      color: "var(--color-tg-amber)",
    },
    {
      key: "energy",
      label: "Энергия",
      icon: Zap,
      value: `${Math.round(stats.energy)}%`,
      pct: stats.energy,
      color: "var(--color-tg-terracotta)",
    },
    {
      key: "mood",
      label: "Настроение",
      icon: Smile,
      value: `${Math.round(stats.mood)}%`,
      pct: stats.mood,
      color: "var(--color-tg-sage)",
    },
    {
      key: "relationships",
      label: "Отношения",
      icon: Heart,
      value: `${Math.round(stats.relationships)}%`,
      pct: stats.relationships,
      color: "var(--color-tg-rose)",
      filled: true,
    },
  ];
}

/** Ряд из четырёх мини-статов (вариант C дизайна). */
export function StatsRow({ stats, className }: { stats: Stats; className?: string }) {
  return (
    <div className={cn("grid grid-cols-4 gap-2", className)}>
      {statViews(stats).map((s) => (
        <div key={s.key} className="flex flex-col items-center gap-[5px]">
          <s.icon
            size={16}
            strokeWidth={2.2}
            style={{ color: s.color }}
            fill={s.filled ? "currentColor" : "none"}
          />
          <span className="font-display text-[15px] leading-none font-bold text-tg-brown">
            {s.value}
          </span>
          <span className="h-[5px] w-full overflow-hidden rounded bg-tg-track">
            <i
              className="block h-full rounded transition-[width] duration-500"
              style={{ width: `${s.pct}%`, background: s.color }}
            />
          </span>
          <span className="text-[9.5px] font-bold tracking-[0.1px] text-tg-muted">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
