"use client";

import { GitCompareArrows, Sparkles } from "lucide-react";
import { useState } from "react";

import { useCompare, useLives } from "@/entities/game/api";
import type { CompareLife } from "@/entities/game/api/types";
import { getCharacter } from "@/entities/game/content/characters";
import { getEnding } from "@/entities/game/content/endings";
import { ALL_EVENTS } from "@/entities/game/content/events";
import { GameAvatar } from "@/entities/game/ui/GameAvatar";
import { formatMoney, moneyPct } from "@/entities/game/ui/stats";
import { BottomNav } from "@/widgets/game-nav/BottomNav";
import { cn } from "@/lib/utils";

function decisionText(eventCode: string, choiceId: string): string | null {
  const event = ALL_EVENTS.find((e) => e.code === eventCode);
  const choice = event?.choices.find((c) => c.id === choiceId);
  return choice ? choice.text : null;
}

function keyDifferences(
  a: CompareLife,
  b: CompareLife,
): { question: string; a: string; b: string }[] {
  const decisionsOf = (life: CompareLife) =>
    new Map(
      life.seasons.flatMap((s) =>
        s.keyDecisions.map((d) => [d.code, d.choice] as const),
      ),
    );
  const da = decisionsOf(a);
  const db = decisionsOf(b);

  const out: { question: string; a: string; b: string }[] = [];
  for (const [code, choiceA] of da) {
    const choiceB = db.get(code);
    if (!choiceB || choiceA === choiceB) continue;
    const event = ALL_EVENTS.find((e) => e.code === code);
    const textA = decisionText(code, choiceA);
    const textB = decisionText(code, choiceB);
    if (event && textA && textB)
      out.push({ question: event.kicker, a: textA, b: textB });
  }
  return out.slice(0, 4);
}

function LifeColumn({ life, side }: { life: CompareLife; side: "a" | "b" }) {
  const ch = getCharacter(life.characterId);
  const ending = life.endingCode ? getEnding(life.endingCode) : null;
  const lastIndex = [...life.seasons]
    .reverse()
    .find((s) => s.lifeIndex !== null)?.lifeIndex;
  const age = life.seasons[life.seasons.length - 1]?.age;

  const bars = [
    {
      label: "Деньги",
      pct: moneyPct(life.currentStats.money),
      color: "var(--color-tg-amber)",
      value: `${formatMoney(life.currentStats.money)} с`,
    },
    {
      label: "Энергия",
      pct: life.currentStats.energy,
      color: "var(--color-tg-terracotta)",
      value: `${Math.round(life.currentStats.energy)}%`,
    },
    {
      label: "Настроение",
      pct: life.currentStats.mood,
      color: "var(--color-tg-sage)",
      value: `${Math.round(life.currentStats.mood)}%`,
    },
    {
      label: "Отношения",
      pct: life.currentStats.relationships,
      color: "var(--color-tg-rose)",
      value: `${Math.round(life.currentStats.relationships)}%`,
    },
  ];

  return (
    <div className="flex flex-1 flex-col items-stretch gap-2.5 rounded-2xl border border-tg-line-soft bg-tg-card-2 p-3.5 shadow-[0_4px_14px_rgba(110,70,30,0.06)]">
      <div className="flex flex-col items-center gap-1.5">
        <span className="rounded-full bg-tg-line-soft px-2 py-0.5 font-mono text-[10px] font-bold text-tg-muted uppercase">
          жизнь {side === "a" ? "А" : "Б"}
        </span>
        <GameAvatar
          size={56}
          age={age ?? 17}
          mood={life.currentStats.mood}
          breathe={false}
          characterId={life.characterId}
        />
        <span className="font-display text-[15px] font-bold text-tg-brown">
          {ch?.name}
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[10.5px] font-extrabold",
            ending
              ? "bg-tg-amber-tint text-tg-amber-deep"
              : "bg-tg-line-soft text-tg-muted",
          )}
        >
          {ending
            ? `«${ending.title}»`
            : `сезон ${life.currentSeason} · в пути`}
        </span>
        {lastIndex != null && (
          <span className="text-[11px] font-bold text-tg-muted">
            индекс жизни {lastIndex.toFixed(1)}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        {bars.map((b) => (
          <div key={b.label}>
            <div className="mb-0.5 flex justify-between text-[10.5px] font-bold text-tg-muted">
              <span>{b.label}</span>
              <span>{b.value}</span>
            </div>
            <span className="block h-[6px] overflow-hidden rounded bg-tg-track">
              <i
                className="block h-full rounded"
                style={{ width: `${b.pct}%`, background: b.color }}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CompareScreen() {
  const { data: lives } = useLives();
  const [aId, setAId] = useState<string | null>(null);
  const [bId, setBId] = useState<string | null>(null);
  const { data: cmp, isLoading } = useCompare(aId, bId);

  const candidates = (lives ?? []).filter((l) => l.status !== "archived");
  const playHref =
    candidates.length > 0 ? `/play/${candidates[0]!.id}` : "/lives";
  const diffs = cmp ? keyDifferences(cmp.a, cmp.b) : [];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-[radial-gradient(120%_58%_at_50%_-12%,#FCF2E0_0%,rgba(252,242,224,0)_58%),linear-gradient(180deg,#F5EAD7_0%,#F0E2CB_60%,#ECDDC2_100%)] lg:min-h-0 lg:max-w-[860px] lg:bg-none">
      <header className="px-5 pt-5 lg:px-0 lg:pt-3">
        <h1 className="m-0 inline-flex items-center gap-2 font-display text-[26px] font-bold tracking-[-0.5px] text-tg-brown lg:text-[32px]">
          <GitCompareArrows
            size={22}
            strokeWidth={2.2}
            className="text-tg-amber-deep"
          />
          Две судьбы
        </h1>
        <p className="mt-0.5 text-[13px] font-semibold text-tg-muted lg:text-[14px]">
          Один старт — разные дороги. Выбери две жизни.
        </p>
      </header>

      <div className="flex flex-1 flex-col gap-4 px-5 pt-4 pb-6 lg:rounded-[28px] lg:border lg:border-white/70 lg:bg-[rgba(251,245,234,0.78)] lg:p-6 lg:shadow-[0_18px_50px_rgba(74,42,16,0.14)] lg:backdrop-blur-md">
        {candidates.length < 2 ? (
          <div className="rounded-2xl border border-dashed border-tg-line bg-[rgba(251,244,232,0.5)] p-5 text-center text-[13.5px] font-bold text-tg-muted">
            Для сравнения нужны хотя бы две жизни. Проживи ещё одну — интересно
            же, как могло сложиться иначе.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {(["a", "b"] as const).map((side) => {
              const value = side === "a" ? aId : bId;
              const other = side === "a" ? bId : aId;
              return (
                <div key={side} className="flex items-center gap-2">
                  <span className="w-5 shrink-0 text-center font-mono text-[12px] font-bold text-tg-muted uppercase">
                    {side === "a" ? "А" : "Б"}
                  </span>
                  <div className="flex flex-1 flex-wrap gap-1.5">
                    {candidates.map((l) => {
                      const ch = getCharacter(l.characterId);
                      const active = value === l.id;
                      const disabled = other === l.id;
                      return (
                        <button
                          key={l.id}
                          type="button"
                          disabled={disabled}
                          onClick={() =>
                            side === "a" ? setAId(l.id) : setBId(l.id)
                          }
                          className={cn(
                            "cursor-pointer rounded-full border px-3 py-1.5 text-[12px] font-extrabold transition-colors",
                            active
                              ? "border-tg-amber bg-tg-amber-tint text-tg-amber-deep"
                              : "border-tg-line bg-tg-card text-tg-brown-2",
                            disabled && "cursor-not-allowed opacity-40",
                          )}
                        >
                          {ch?.name}, {l.age}
                          {l.status === "finished" ? " ✓" : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {isLoading && aId && bId && (
          <div className="p-6 text-center text-sm font-bold text-tg-muted">
            Сравниваю судьбы…
          </div>
        )}

        {cmp && (
          <>
            <div className="flex gap-2.5">
              <LifeColumn life={cmp.a} side="a" />
              <LifeColumn life={cmp.b} side="b" />
            </div>

            {diffs.length > 0 && (
              <section>
                <span className="mb-2 inline-flex items-center gap-1.5 font-display text-[15px] font-semibold text-tg-brown">
                  <Sparkles
                    size={14}
                    className="fill-tg-amber-deep stroke-none"
                  />{" "}
                  Где дороги разошлись
                </span>
                <div className="flex flex-col gap-2">
                  {diffs.map((d, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-tg-line-soft bg-tg-card-2 p-3.5"
                    >
                      <p className="m-0 font-display text-[10.5px] font-bold tracking-[0.5px] text-tg-amber-deep uppercase">
                        {d.question}
                      </p>
                      <div className="mt-1.5 flex flex-col gap-1 text-[12.5px] leading-snug font-semibold lg:flex-row lg:gap-6 lg:[&>p]:flex-1">
                        <p className="m-0 text-tg-brown">
                          <span className="font-mono text-[10px] text-tg-muted">
                            А
                          </span>{" "}
                          {d.a}
                        </p>
                        <p className="m-0 text-tg-brown-2">
                          <span className="font-mono text-[10px] text-tg-muted">
                            Б
                          </span>{" "}
                          {d.b}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <BottomNav playHref={playHref} />
    </div>
  );
}
