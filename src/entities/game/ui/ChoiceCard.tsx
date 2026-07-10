import { AlertTriangle, ArrowDown, ArrowUp, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import type { EventChoice, Stats } from "../model/types";
import { formatMoney } from "./stats";

const STAT_LABEL: Record<keyof Stats, string> = {
  money: "",
  energy: "Энергия",
  mood: "Настроение",
  relationships: "Отношения",
};

interface DeltaChip {
  text: string;
  dir: "up" | "down";
}

/** Плашки последствий выбора — из effects, без раскрытия точных цифр статов. */
export function choiceDeltas(choice: EventChoice): DeltaChip[] {
  const chips: DeltaChip[] = [];
  const s = choice.effects.stats;
  if (s?.money) {
    chips.push({
      text: `${s.money > 0 ? "+" : "−"}${formatMoney(Math.abs(s.money))} с`,
      dir: s.money > 0 ? "up" : "down",
    });
  }
  for (const key of ["energy", "mood", "relationships"] as const) {
    const v = s?.[key];
    if (v) chips.push({ text: STAT_LABEL[key], dir: v > 0 ? "up" : "down" });
  }
  if (choice.effects.debt) {
    chips.push({
      text: `долг ${formatMoney(choice.effects.debt.amount)} с`,
      dir: "down",
    });
  }
  return chips;
}

export function ChoiceCard({
  choice,
  disabled,
  onSelect,
}: {
  choice: EventChoice;
  disabled?: boolean;
  onSelect: () => void;
}) {
  const deltas = choiceDeltas(choice);
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-2xl border-[1.5px] px-[15px] py-3 text-left font-sans transition-all duration-100",
        "border-tg-line bg-tg-card shadow-[0_1px_2px_rgba(120,80,40,0.05)] hover:-translate-y-px hover:shadow-[0_5px_14px_rgba(120,80,40,0.1)] active:translate-y-0 active:scale-[0.99]",
        choice.primary &&
          "border-[#E0AE55] bg-[linear-gradient(180deg,#F4D99C_0%,#ECC069_100%)] shadow-[0_4px_12px_rgba(214,160,60,0.22)]",
        disabled && "cursor-not-allowed opacity-50 hover:translate-y-0 hover:shadow-none",
      )}
    >
      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            "text-[14.5px] leading-[1.25] font-extrabold text-tg-brown",
            choice.primary && "text-[#5A3F1C]",
          )}
        >
          {choice.text}
        </span>
        {deltas.length > 0 && (
          <span className="mt-[5px] flex flex-wrap gap-[7px]">
            {deltas.map((d, i) => (
              <span
                key={i}
                className={cn(
                  "inline-flex items-center gap-0.5 text-[11.5px] font-bold",
                  d.dir === "up" ? "text-tg-sage-deep" : "text-[#B5503C]",
                )}
              >
                {d.dir === "up" ? (
                  <ArrowUp size={11} strokeWidth={2.6} />
                ) : (
                  <ArrowDown size={11} strokeWidth={2.6} />
                )}
                {d.text}
              </span>
            ))}
          </span>
        )}
      </span>
      {disabled ? (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-tg-line-soft px-[9px] py-[5px] text-[11.5px] font-extrabold text-tg-muted">
          <Lock size={12} strokeWidth={2.3} /> не хватает
        </span>
      ) : (
        choice.chance !== undefined && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#F1D6CE] px-[9px] py-[5px] text-[11.5px] font-extrabold text-[#B5503C]">
            <AlertTriangle size={12} strokeWidth={2.3} /> Шанс {choice.chance}%
          </span>
        )
      )}
    </button>
  );
}
