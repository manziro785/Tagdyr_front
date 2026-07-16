"use client";

import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Clock,
  Coins,
  Flag,
  Heart,
  PiggyBank,
  Quote,
  Smile,
  Target,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { getSeasonGoal } from "@/entities/game/content/goals";
import { getSeason, sceneForRun } from "@/entities/game/content/seasons";
import { GameFrame } from "@/widgets/game-shell/GameFrame";
import { MAX_SEASON } from "@/entities/game/model/finance";
import type { RunState } from "@/entities/game/model/run-store";
import type { Stats } from "@/entities/game/model/types";
import { CtaButton } from "@/entities/game/ui/CtaButton";
import { GameAvatar } from "@/entities/game/ui/GameAvatar";
import { formatMoney } from "@/entities/game/ui/stats";

const STAT_META: Record<
  Exclude<keyof Stats, "money">,
  { label: string; icon: "zap" | "smile" | "heart"; color: string; tint: string }
> = {
  energy: { label: "Энергия", icon: "zap", color: "var(--color-tg-terracotta)", tint: "var(--color-tg-terra-tint)" },
  mood: { label: "Настроение", icon: "smile", color: "var(--color-tg-sage)", tint: "var(--color-tg-sage-tint)" },
  relationships: { label: "Отношения", icon: "heart", color: "var(--color-tg-rose)", tint: "var(--color-tg-rose-tint)" },
};

const FLAG_LABELS: Record<string, string> = {
  higherEd: "Поступил в универ",
  hasJob: "Есть работа",
  hasBusiness: "Своё дело",
  wentAbroad: "Уехал за границу",
  backToVillage: "Вернулся к корням",
  familyFirst: "Опора семьи",
  savedEmergencyFund: "Подушка безопасности",
  craftsman: "Ремесло в руках",
  married: "Своя семья",
  hasHome: "Своё жильё",
  masterDegree: "Магистратура",
  academicPath: "Академический путь",
  communityPath: "Свой для людей",
};

/** Межсезонье: эпилог, сводка, взросление, «пока ты жил — долг рос», тизер. */
export function InterseasonView({
  run,
  onContinue,
  continuing,
}: {
  run: RunState;
  onContinue: () => void;
  continuing: boolean;
}) {
  const close = run.seasonClose;
  if (!close) return null;

  const season = getSeason(run.season);
  const isFinal = run.season >= MAX_SEASON || close.next === null;
  const nextSeason = close.next ? getSeason(close.next.seasonNumber) : null;

  const statRows = (
    Object.keys(STAT_META) as (keyof typeof STAT_META)[]
  ).flatMap((key) => {
    const delta = close.statDeltas[key];
    if (!delta) return [];
    return [{ key, delta, meta: STAT_META[key] }];
  });
  const moneyDelta = close.statDeltas.money ?? 0;
  const newFlagLabels = close.newFlags
    .map((f) => FLAG_LABELS[f])
    .filter((l): l is string => Boolean(l));

  const debt = close.timeSkip.debts.find((d) => d.after > d.before);
  const savings = close.timeSkip.savings;
  const goal = getSeasonGoal(run.season);
  const goalMet = goal ? goal.check(run.stats, run.debts) : null;

  return (
    <GameFrame scene={sceneForRun(season, run.baseSeed)}>
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] animate-in fade-in flex-col bg-[radial-gradient(120%_55%_at_50%_-6%,#F8E4C5_0%,rgba(248,228,197,0)_60%),linear-gradient(180deg,#F3E4CC_0%,#EFD9BC_55%,#E9CFAE_100%)] duration-700 lg:min-h-0 lg:max-w-none lg:bg-none">
      <div className="lg:flex lg:items-end lg:justify-between lg:pt-3 lg:pb-4">
      <div className="px-[22px] pt-6 lg:p-0">
        <span className="inline-flex items-center gap-[5px] font-display text-[11px] font-bold tracking-[0.7px] text-tg-terra-deep uppercase">
          <Clock size={13} strokeWidth={2.2} /> Конец сезона {run.season}
        </span>
        <h2 className="mt-1 font-display text-[25px] font-bold tracking-[-0.5px] text-tg-brown lg:text-[32px] lg:[text-shadow:0_1px_10px_rgba(250,240,224,0.6)]">
          {season.title} — этап позади
        </h2>
      </div>

      {/* взросление */}
      <div className="flex items-center justify-center gap-4 px-[22px] pt-4 pb-1.5 lg:p-0">
        <div className="flex flex-col items-center gap-[7px]">
          <GameAvatar
            size={64}
            age={run.age}
            mood={run.stats.mood}
            breathe={false}
            characterId={run.characterId}
          />
          <span className="text-[11px] font-bold text-tg-muted">{run.age}</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-[10px] font-extrabold text-tg-terra-deep opacity-85">
          <ArrowRight size={22} strokeWidth={2.4} />
          <span>
            {close.timeSkip.years > 0
              ? `${close.timeSkip.years} ${close.timeSkip.years === 1 ? "год" : close.timeSkip.years < 5 ? "года" : "лет"}`
              : "миг"}
          </span>
        </div>
        <div className="flex flex-col items-center gap-[7px]">
          <GameAvatar
            size={78}
            age={close.next?.age ?? run.age + close.timeSkip.years}
            mood={run.stats.mood}
            characterId={run.characterId}
          />
          <span className="text-[11px] font-bold text-tg-brown">
            {close.next?.age ?? run.age + close.timeSkip.years}
          </span>
        </div>
      </div>
      </div>

      <div className="flex flex-1 flex-col gap-[13px] px-5 pt-3 pb-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-7 lg:p-0">
      <div className="contents lg:flex lg:flex-col lg:gap-[13px] lg:rounded-[28px] lg:border lg:border-white/70 lg:bg-[rgba(251,245,234,0.8)] lg:p-6 lg:shadow-[0_18px_50px_rgba(74,42,16,0.14)] lg:backdrop-blur-md">
        {/* эпилог-дневник */}
        <div className="relative rounded-[18px] border border-tg-line-soft bg-tg-card-2 p-4 shadow-[0_6px_18px_rgba(110,70,30,0.06)]">
          <Quote size={24} className="mb-1.5 fill-tg-amber stroke-none opacity-50" />
          <p className="m-0 text-sm leading-[1.6] font-medium text-pretty text-tg-brown-2">
            {close.epilogue}
          </p>
        </div>

        {/* итог цели сезона */}
        {goal && (
          <div
            className={
              "flex items-center gap-3 rounded-[18px] border p-3.5 " +
              (goalMet
                ? "border-tg-sage/40 bg-tg-sage-tint"
                : "border-tg-line-soft bg-tg-card")
            }
          >
            <span
              className={
                "flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/60 " +
                (goalMet ? "text-tg-sage-deep" : "text-tg-muted")
              }
            >
              <Target size={18} strokeWidth={2.2} />
            </span>
            <p
              className={
                "m-0 text-[13px] leading-snug font-bold " +
                (goalMet ? "text-tg-sage-deep" : "text-tg-muted")
              }
            >
              {goalMet
                ? `Цель сезона выполнена: ${goal.text.toLowerCase()}. ${goal.hint}.`
                : `Цель «${goal.text.toLowerCase()}» не сложилась. ${goal.hint} — в следующей жизни попробуй иначе.`}
            </p>
          </div>
        )}

      </div>

      <div className="contents lg:flex lg:flex-col lg:gap-[13px] lg:rounded-[28px] lg:border lg:border-white/70 lg:bg-[rgba(251,245,234,0.8)] lg:p-6 lg:shadow-[0_18px_50px_rgba(74,42,16,0.14)] lg:backdrop-blur-md">
        {/* сводка изменений */}
        {(statRows.length > 0 || moneyDelta !== 0 || newFlagLabels.length > 0) && (
          <>
            <span className="font-display text-[15px] font-semibold text-tg-brown">
              Что изменилось
            </span>
            <div className="flex flex-col gap-[7px]">
              {moneyDelta !== 0 && (
                <SummaryRow
                  label="Деньги"
                  color="var(--color-tg-amber-deep)"
                  tint="var(--color-tg-amber-tint)"
                  icon="coins"
                  delta={`${moneyDelta > 0 ? "+" : "−"}${formatMoney(Math.abs(moneyDelta))} с`}
                  dir={moneyDelta > 0 ? "up" : "down"}
                />
              )}
              {statRows.map(({ key, delta, meta }) => (
                <SummaryRow
                  key={key}
                  label={meta.label}
                  color={meta.color}
                  tint={meta.tint}
                  icon={meta.icon}
                  delta={`${delta > 0 ? "+" : "−"}${Math.abs(Math.round(delta))}`}
                  dir={delta > 0 ? "up" : "down"}
                />
              ))}
              {newFlagLabels.map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-[11px] rounded-[13px] border border-tg-line-soft bg-tg-card px-[13px] py-2.5"
                >
                  <span className="flex size-7 items-center justify-center rounded-[9px] bg-tg-amber-tint text-tg-amber-deep">
                    <Flag size={15} strokeWidth={2.2} />
                  </span>
                  <span className="flex-1 text-[13.5px] font-bold text-tg-brown">{label}</span>
                  <span className="rounded-full bg-tg-amber-tint px-[9px] py-1 text-[11px] font-extrabold text-tg-amber-deep">
                    новый флаг
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* эмоциональный момент: долг рос, пока ты жил */}
        {debt && (
          <div className="rounded-[18px] border border-[#E7BDB0] bg-[linear-gradient(180deg,#F6E0D6,#F1D2C5)] p-4">
            <div className="mb-2.5 flex items-center gap-[7px] font-display text-[13px] font-bold text-[#B5503C]">
              <TrendingUp size={16} strokeWidth={2.4} /> Пока ты жил — долг рос
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="font-display text-[17px] font-bold text-tg-brown-2">
                  {formatMoney(debt.before)} с
                </span>
                <span className="text-[10.5px] font-bold text-tg-muted">
                  было · {Math.round(debt.rate * 100)}% годовых
                </span>
              </div>
              <ArrowRight size={20} strokeWidth={2.4} className="shrink-0 text-[#B5503C]" />
              <div className="ml-auto flex flex-col gap-0.5 text-right">
                <span className="font-display text-[23px] font-bold text-[#B5503C]">
                  {formatMoney(debt.after)} с
                </span>
                <span className="text-[10.5px] font-bold text-tg-muted">
                  через {close.timeSkip.years} {close.timeSkip.years === 1 ? "год" : close.timeSkip.years < 5 ? "года" : "лет"}
                </span>
              </div>
            </div>
            {debt.perYear.length > 1 && (
              <div className="mt-3 flex items-end gap-1">
                {[debt.before, ...debt.perYear].map((v, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-t-[4px] bg-[linear-gradient(180deg,#C96F4A,#B5503C)]"
                    style={{ height: `${10 + (v / debt.after) * 30}px`, opacity: 0.55 + (i / debt.perYear.length) * 0.45 }}
                    title={`${formatMoney(v)} с`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* накопления подросли */}
        {savings && savings.after > savings.before && (
          <div className="flex items-center gap-3 rounded-[18px] border border-tg-sage/40 bg-tg-sage-tint p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/60 text-tg-sage-deep">
              <PiggyBank size={18} strokeWidth={2.2} />
            </span>
            <p className="m-0 text-[13px] leading-snug font-bold text-tg-sage-deep">
              А накопления тихо работали: {formatMoney(savings.before)} с →{" "}
              {formatMoney(savings.after)} с под {Math.round(savings.rate * 100)}%.
            </p>
          </div>
        )}

        {/* тизер следующего этапа */}
        {nextSeason && (
          <div className="flex items-center gap-3 rounded-2xl border border-tg-line-soft bg-tg-card px-[15px] py-[13px]">
            <div className="min-w-0 flex-1">
              <div className="font-display text-[10px] font-bold tracking-[0.7px] text-tg-amber-deep uppercase">
                Дальше · сезон {nextSeason.number}
              </div>
              <div className="mt-0.5 text-[13.5px] font-bold text-tg-brown">{season.teaser}</div>
            </div>
            <ArrowRight size={20} strokeWidth={2.4} className="text-tg-amber-deep" />
          </div>
        )}

      </div>

        <CtaButton
          onClick={onContinue}
          disabled={continuing}
          className="mt-auto lg:col-span-2 lg:mx-auto lg:mt-2 lg:max-w-[400px]"
        >
          {continuing
            ? "Минутку…"
            : isFinal
              ? "Узнать свою судьбу"
              : "Прожить дальше"}
          <ArrowRight size={18} strokeWidth={2.6} />
        </CtaButton>
      </div>
    </div>
    </GameFrame>
  );
}

function SummaryRow({
  label,
  color,
  tint,
  icon,
  delta,
  dir,
}: {
  label: string;
  color: string;
  tint: string;
  icon: "coins" | "zap" | "smile" | "heart";
  delta: string;
  dir: "up" | "down";
}) {
  return (
    <div className="flex items-center gap-[11px] rounded-[13px] border border-tg-line-soft bg-tg-card px-[13px] py-2.5">
      <span
        className="flex size-7 items-center justify-center rounded-[9px]"
        style={{ background: tint, color }}
      >
        <StatIcon name={icon} />
      </span>
      <span className="flex-1 text-[13.5px] font-bold text-tg-brown">{label}</span>
      <span
        className={
          "inline-flex items-center gap-0.5 text-[13px] font-extrabold " +
          (dir === "up" ? "text-tg-sage-deep" : "text-[#B5503C]")
        }
      >
        {dir === "up" ? (
          <ArrowUp size={13} strokeWidth={2.6} />
        ) : (
          <ArrowDown size={13} strokeWidth={2.6} />
        )}
        {delta}
      </span>
    </div>
  );
}

const ICONS: Record<"coins" | "zap" | "smile" | "heart", LucideIcon> = {
  coins: Coins,
  zap: Zap,
  smile: Smile,
  heart: Heart,
};

function StatIcon({ name }: { name: keyof typeof ICONS }) {
  const Icon = ICONS[name];
  return (
    <Icon size={15} strokeWidth={2.2} fill={name === "heart" ? "currentColor" : "none"} />
  );
}
