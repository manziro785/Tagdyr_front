"use client";

import {
  Home,
  Minus,
  PartyPopper,
  PiggyBank,
  ShoppingBag,
  ShoppingBasket,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { Effects } from "@/entities/game/model/types";
import { CtaButton } from "@/entities/game/ui/CtaButton";
import { formatMoney } from "@/entities/game/ui/stats";
import { cn } from "@/lib/utils";

/**
 * Мини-игра «Бюджет месяца»: первая зарплата 12 000 раскладывается по конвертам
 * купюрами по 1000. На всё не хватает — недоложенное в «нужные» конверты бьёт
 * по статам, аренда без денег превращается в долг. Урок — последствием.
 */

const SALARY = 12_000;
const BILL = 1_000;

interface Envelope {
  id: "rent" | "food" | "toi" | "savings" | "wants";
  need: number | null;
  icon: LucideIcon;
  color: string;
  tint: string;
}

// подписи и подсказки конвертов живут в словаре (budget.envelopes / budget.hints)
const ENVELOPES: Envelope[] = [
  { id: "rent", need: 4000, icon: Home, color: "var(--color-tg-terra-deep)", tint: "var(--color-tg-terra-tint)" },
  { id: "food", need: 3000, icon: ShoppingBasket, color: "var(--color-tg-sage-deep)", tint: "var(--color-tg-sage-tint)" },
  { id: "toi", need: 2000, icon: PartyPopper, color: "var(--color-tg-rose-deep)", tint: "var(--color-tg-rose-tint)" },
  { id: "savings", need: null, icon: PiggyBank, color: "var(--color-tg-amber-deep)", tint: "var(--color-tg-amber-tint)" },
  { id: "wants", need: null, icon: ShoppingBag, color: "var(--color-tg-brown-2)", tint: "var(--color-tg-line-soft)" },
];

type Alloc = Record<Envelope["id"], number>;

/** diary приходит переведённым: движок про локали ничего не знает. */
function buildEffects(
  a: Alloc,
  diary: Record<"shortRent" | "saver" | "spender" | "balanced", string>,
): { effects: Effects; choiceId: string } {
  const rentShort = Math.max(0, 4000 - a.rent);
  const foodShort = Math.max(0, 3000 - a.food);
  const toiShort = Math.max(0, 2000 - a.toi);

  const effects: Effects = {
    stats: {
      money: a.savings,
      energy: foodShort > 0 ? -Math.min(12, Math.round(foodShort / 300)) : 2,
      mood:
        Math.min(8, Math.round(a.wants / 500)) -
        (foodShort > 0 ? 3 : 0) -
        (rentShort > 0 ? 5 : 0),
      relationships: toiShort > 0 ? -Math.min(10, Math.round(toiShort / 250)) : 8,
    },
    flags: {
      ...(a.savings >= 2000 ? { savedEmergencyFund: true } : {}),
      ...(rentShort > 0 ? { debtTrouble: true } : {}),
    },
    ...(rentShort > 0 ? { debt: { amount: rentShort, rate: 0.14 } } : {}),
    card: "budget_envelopes",
    diary:
      rentShort > 0
        ? diary.shortRent
        : a.savings >= 3000
          ? diary.saver
          : a.wants >= 3000
            ? diary.spender
            : diary.balanced,
  };
  const choiceId = `budget:${a.rent / BILL}-${a.food / BILL}-${a.toi / BILL}-${a.savings / BILL}-${a.wants / BILL}`;
  return { effects, choiceId };
}

export function BudgetGame({
  onDone,
}: {
  onDone: (choiceId: string, effects: Effects) => void;
}) {
  const t = useTranslations("budget");
  const tc = useTranslations("common");
  const [alloc, setAlloc] = useState<Alloc>({ rent: 0, food: 0, toi: 0, savings: 0, wants: 0 });
  const allocated = Object.values(alloc).reduce((s, v) => s + v, 0);
  const pool = SALARY - allocated;

  const add = (id: Envelope["id"]) => {
    if (pool < BILL) return;
    setAlloc((a) => ({ ...a, [id]: a[id] + BILL }));
  };
  const remove = (id: Envelope["id"]) => {
    setAlloc((a) => ({ ...a, [id]: Math.max(0, a[id] - BILL) }));
  };

  const submit = () => {
    const { effects, choiceId } = buildEffects(alloc, {
      shortRent: t("diary.shortRent"),
      saver: t("diary.saver"),
      spender: t("diary.spender"),
      balanced: t("diary.balanced"),
    });
    onDone(choiceId, effects);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-3 duration-500">
      <div className="relative rounded-[18px] border border-white/70 bg-[rgba(252,247,238,0.85)] p-4 shadow-[0_10px_28px_rgba(80,45,18,0.16)] backdrop-blur-lg">
        <p className="mb-1.5 inline-flex items-center gap-1.5 font-display text-[11px] font-bold tracking-[0.6px] text-tg-amber-deep uppercase">
          <Sparkles size={12} className="fill-current stroke-none" /> {t("kicker")}
        </p>
        <p className="text-[14px] leading-[1.5] font-medium text-tg-brown-2">
          {t("intro")}
        </p>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-tg-amber-tint px-4 py-2.5">
          <span className="text-[12px] font-extrabold tracking-wide text-tg-amber-deep uppercase">
            {t("inHand")}
          </span>
          <span className="font-display text-[22px] font-bold text-tg-brown">
            {formatMoney(pool)}{" "}
            <span className="text-[14px] text-tg-muted">{tc("currency")}</span>
          </span>
        </div>
        {/* купюры: визуальный пул */}
        <div className="mt-2 flex h-6 items-center gap-1">
          {Array.from({ length: SALARY / BILL }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-5 flex-1 rounded-[4px] border border-[#C5851F]/40 bg-[linear-gradient(180deg,#F4D99C,#ECC069)] transition-all duration-200",
                i >= pool / BILL && "scale-y-50 opacity-15",
              )}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {ENVELOPES.map((env) => {
          const val = alloc[env.id];
          const short = env.need !== null && val < env.need;
          return (
            <div
              key={env.id}
              className={cn(
                "flex items-center gap-3 rounded-2xl border-[1.5px] bg-tg-card px-3.5 py-2.5 transition-colors",
                short ? "border-dashed border-tg-line" : "border-tg-line-soft",
                env.need !== null && !short && "border-solid",
              )}
              style={env.need !== null && !short ? { borderColor: env.color } : undefined}
            >
              <button
                type="button"
                onClick={() => add(env.id)}
                disabled={pool < BILL}
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left disabled:cursor-default"
              >
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-[10px]"
                  style={{ background: env.tint, color: env.color }}
                >
                  <env.icon size={17} strokeWidth={2.2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-extrabold text-tg-brown">
                    {t(`envelopes.${env.id}`)}
                  </span>
                  <span className={cn("block text-[11px] font-bold", short ? "text-[#B5503C]" : "text-tg-muted")}>
                    {env.need !== null
                      ? short
                        ? t("missing", {
                            hint: t(`hints.${env.id}`),
                            amount: `${formatMoney(env.need - val)} ${tc("currency")}`,
                          })
                        : t("closed")
                      : t(`hints.${env.id}`)}
                  </span>
                </span>
                <span className="font-display text-[17px] font-bold whitespace-nowrap text-tg-brown">
                  {formatMoney(val)}{" "}
                  <span className="text-[12px] text-tg-muted">{tc("currency")}</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => remove(env.id)}
                disabled={val === 0}
                aria-label={t("removeLabel", { envelope: t(`envelopes.${env.id}`) })}
                className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-tg-line bg-white/60 text-tg-brown-2 disabled:opacity-30"
              >
                <Minus size={14} strokeWidth={2.6} />
              </button>
            </div>
          );
        })}
      </div>

      <CtaButton onClick={submit} disabled={pool > 0}>
        {pool > 0
          ? t("placeMore", { amount: `${formatMoney(pool)} ${tc("currency")}` })
          : t("done")}
      </CtaButton>
    </div>
  );
}
