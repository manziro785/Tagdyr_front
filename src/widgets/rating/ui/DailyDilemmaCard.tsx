"use client";

import { Check, HelpCircle, Users } from "lucide-react";

import { useAnswerDilemma, useDilemmaToday } from "@/entities/meta/api";
import { cn } from "@/lib/utils";

/**
 * Дилемма дня: один вопрос на сутки (UTC), один ответ на игрока.
 * Распределение сервер отдаёт только ответившим — до голоса это была бы
 * подсказка «как принято отвечать», поэтому проценты появляются после клика.
 */
export function DailyDilemmaCard() {
  const { data, isLoading, isError } = useDilemmaToday();
  const answer = useAnswerDilemma();

  const answered = data?.myChoice ?? null;
  const pending = answer.isPending;

  return (
    <section className="flex flex-col gap-3 rounded-[22px] border border-tg-line-soft bg-tg-card p-4 shadow-[0_1px_2px_rgba(120,80,40,0.04)] lg:rounded-[28px] lg:border-white/70 lg:bg-[rgba(251,245,234,0.78)] lg:p-6 lg:shadow-[0_18px_50px_rgba(74,42,16,0.14)] lg:backdrop-blur-md">
      <div className="flex items-baseline justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 font-display text-[15px] font-semibold text-tg-brown lg:text-[19px]">
          <HelpCircle size={15} strokeWidth={2.3} className="text-tg-terra-deep" />
          Дилемма дня
        </span>
        {data && data.totalVotes > 0 && (
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-tg-muted">
            <Users size={12} strokeWidth={2.4} /> {data.totalVotes}
          </span>
        )}
      </div>

      {isLoading && (
        <p className="m-0 text-[13px] font-semibold text-tg-muted">Загружаю вопрос дня…</p>
      )}

      {isError && (
        <p className="m-0 text-[13px] font-bold text-[#B5503C]">
          Не удалось получить дилемму. Обнови страницу.
        </p>
      )}

      {data && (
        <>
          <p className="m-0 font-display text-[15.5px] leading-[1.45] font-bold text-balance text-tg-brown lg:text-[17px]">
            {data.prompt}
          </p>

          <div className="flex flex-col gap-2">
            {data.options.map((text, index) => {
              const mine = answered === index;
              const stat = data.distribution?.[index];
              return (
                <button
                  key={index}
                  type="button"
                  disabled={answered !== null || pending}
                  onClick={() => answer.mutate(index)}
                  className={cn(
                    "relative flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-2xl border p-3 text-left transition-colors",
                    mine
                      ? "border-tg-amber bg-tg-card-2 shadow-[0_4px_14px_rgba(214,160,60,0.22)]"
                      : "border-tg-line-soft bg-tg-card-2",
                    answered === null && !pending && "hover:border-tg-amber/70",
                    answered !== null && "cursor-default",
                  )}
                >
                  {/* заливка-бар: доля выбравших этот вариант */}
                  {stat && (
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 bg-tg-amber-tint transition-[width] duration-700"
                      style={{ width: `${stat.percent}%` }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative flex size-5 shrink-0 items-center justify-center rounded-full border-2 text-white",
                      mine ? "border-tg-amber-deep bg-tg-amber-deep" : "border-tg-line",
                    )}
                  >
                    {mine && <Check size={12} strokeWidth={3.4} />}
                  </span>
                  <span className="relative min-w-0 flex-1 text-[13.5px] leading-[1.4] font-semibold text-tg-brown-2">
                    {text}
                  </span>
                  {stat && (
                    <span className="relative shrink-0 font-display text-[14px] font-bold text-tg-amber-deep">
                      {stat.percent}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="m-0 text-[11.5px] font-semibold text-tg-muted">
            {answered !== null
              ? "Голос учтён. Новый вопрос — завтра."
              : "Выбери вариант — покажу, как ответили остальные."}
          </p>

          {answer.isError && (
            <p className="m-0 text-[12px] font-bold text-[#B5503C]">
              Голос не прошёл. Попробуй ещё раз.
            </p>
          )}
        </>
      )}
    </section>
  );
}
