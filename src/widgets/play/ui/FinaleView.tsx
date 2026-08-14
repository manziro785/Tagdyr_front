"use client";

import { GitCompareArrows, Mail, Plus, Sparkles, Trophy, UserPlus } from "lucide-react";

import { getCharacter } from "@/entities/game/content/characters";
import { composeLetter } from "@/entities/game/model/epilogue";
import type { RunState } from "@/entities/game/model/run-store";
import { CtaButton } from "@/entities/game/ui/CtaButton";
import { GameAvatar } from "@/entities/game/ui/GameAvatar";
import { SceneBackground } from "@/entities/game/ui/SceneBackground";
import { ShareLifeButton } from "@/features/share/ui/ShareLifeButton";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

/** Финал жизни: архетип концовки, индекс, «письмо себе в 17», разблокировки. */
export function FinaleView({ run }: { run: RunState }) {
  const t = useTranslations("finale");
  const router = useRouter();
  const finale = run.finale;
  if (!finale) return null;

  const character = getCharacter(run.characterId);
  const letter = composeLetter(run.flags, run.stats, finale.ending.title);
  const unlockedNames = finale.unlockedCharacterIds
    .map((id) => getCharacter(id)?.name)
    .filter(Boolean);

  return (
    <div className="relative mx-auto flex min-h-dvh w-full flex-col overflow-hidden">
      <SceneBackground scene="issykkul" dim />

      <div className="relative z-[1] mx-auto flex min-h-dvh w-full max-w-[430px] animate-in fade-in flex-col gap-4 px-5 py-8 duration-1000 lg:max-w-[600px]">
        <div className="flex flex-col items-center gap-2 pt-2 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/20 px-3.5 py-[7px] font-display text-[11px] font-bold tracking-[1px] text-[#F7E6C6] uppercase backdrop-blur-sm">
            <Sparkles size={12} className="fill-current stroke-none" /> {t("lived")}
          </span>
          <GameAvatar size={110} age={run.age} mood={run.stats.mood} characterId={run.characterId} />
          <h1 className="m-0 font-display text-[32px] leading-tight font-bold tracking-[-0.6px] text-[#FFFCF6] [text-shadow:0_2px_20px_rgba(46,30,18,0.55)]">
            {finale.ending.title}
          </h1>
          <p className="m-0 text-[13px] font-bold text-[#F7E6C6]/90">
            {t("subtitle", {
              name: character?.name ?? "",
              age: run.age,
              archetype: finale.ending.archetype,
            })}
            {finale.newEnding && t("firstTime")}
          </p>
        </div>

        <div className="rounded-[20px] border border-white/60 bg-[rgba(251,245,234,0.92)] p-4 shadow-[0_22px_54px_rgba(30,18,8,0.35)] backdrop-blur-md">
          <p className="m-0 text-sm leading-[1.6] font-medium text-tg-brown-2">
            {finale.ending.description}
          </p>
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-tg-amber-tint px-4 py-3">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-extrabold tracking-wide text-tg-amber-deep uppercase">
              <Trophy size={14} strokeWidth={2.4} /> {t("lifeIndex")}
            </span>
            <span className="font-display text-[26px] leading-none font-bold text-tg-brown">
              {finale.lifeIndex.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="rounded-[20px] border border-white/50 bg-[rgba(251,245,234,0.88)] p-4 backdrop-blur-md">
          <p className="mb-1.5 inline-flex items-center gap-1.5 font-display text-[11px] font-bold tracking-[0.6px] text-tg-terra-deep uppercase">
            <Mail size={13} strokeWidth={2.4} /> {t("letter")}
          </p>
          <p className="m-0 text-[13.5px] leading-[1.65] font-medium text-pretty text-tg-brown-2 italic">
            {letter}
          </p>
        </div>

        {unlockedNames.length > 0 && (
          <div className="flex items-center gap-3 rounded-2xl border border-tg-amber/60 bg-[rgba(247,230,198,0.92)] p-3.5 backdrop-blur-md">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/70 text-tg-amber-deep">
              <UserPlus size={17} strokeWidth={2.2} />
            </span>
            <p className="m-0 text-[13px] font-bold text-tg-brown">
              {t("unlocked", { names: unlockedNames.join(", ") })}
            </p>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2.5 pt-2">
          <CtaButton onClick={() => router.push("/lives")}>
            <Plus size={18} strokeWidth={2.6} /> {t("oneMore")}
          </CtaButton>
          <ShareLifeButton lifeId={run.lifeId} title={finale.ending.title} />
          <Link
            href="/compare"
            className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] border border-white/50 bg-white/20 p-[13px] font-display text-[15px] font-bold text-[#FFFCF6] backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <GitCompareArrows size={17} strokeWidth={2.2} /> {t("compare")}
          </Link>
        </div>
      </div>
    </div>
  );
}
