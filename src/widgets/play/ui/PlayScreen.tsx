"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { useCompleteSeason, useFinishLife, useLife } from "@/entities/game/api";
import { useAiEpilogue } from "@/features/ai-epilogue/model/use-ai-epilogue";
import { composeEpilogue } from "@/entities/game/model/epilogue";
import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  seasonSeed,
  useRunsStore,
  type SeasonClose,
} from "@/entities/game/model/run-store";
import type { Flags, Stats } from "@/entities/game/model/types";
import { CtaButton } from "@/entities/game/ui/CtaButton";
import { FinaleView } from "./FinaleView";
import { InterseasonView } from "./InterseasonView";
import { TurnView } from "./TurnView";

function statDiff(before: Stats, after: Stats): Partial<Stats> {
  const diff: Partial<Stats> = {};
  for (const key of Object.keys(after) as (keyof Stats)[]) {
    const d = Math.round((after[key] - before[key]) * 100) / 100;
    if (d !== 0) diff[key] = d;
  }
  return diff;
}

function newTrueFlags(before: Flags, after: Flags): string[] {
  return Object.keys(after).filter((k) => after[k] === true && before[k] !== true);
}

function CenteredNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-tg-cream px-8 text-center">
      {children}
    </div>
  );
}

/**
 * Оркестратор жизни: восстанавливает ран, гоняет фазы ход → межсезонье → финал,
 * дёргает complete/finish через активный API (сервер или гостевой localStorage).
 */
export function PlayScreen({ lifeId }: { lifeId: string }) {
  const t = useTranslations("play");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { data: life, isLoading, isError, refetch } = useLife(lifeId);
  const run = useRunsStore((s) => s.runs[lifeId]);
  const startRun = useRunsStore((s) => s.startRun);
  const closeSeason = useRunsStore((s) => s.closeSeason);
  const beginNextSeason = useRunsStore((s) => s.beginNextSeason);
  const setFinale = useRunsStore((s) => s.setFinale);

  const completeSeason = useCompleteSeason();
  const finishLife = useFinishLife();
  const finishRequested = useRef(false);

  // шаблонный эпилог уже в сторе; у залогиненных его заменит текст от модели
  useAiEpilogue(lifeId, run);

  // восстановление рана: сервер хранит состояние на начало сезона (§1 ТЗ),
  // потерянный localStorage означает «сезон начинается заново»
  useEffect(() => {
    if (!life || run || life.status !== "active") return;
    startRun({
      lifeId,
      characterId: life.characterId,
      seed: life.seed,
      season: life.currentSeason,
      age: life.age,
      stats: life.stats,
      flags: life.flags,
      debts: life.debts,
    });
  }, [life, run, lifeId, startRun]);

  // завершённая жизнь без финала в ране (другое устройство) → идемпотентный finish
  useEffect(() => {
    if (!life || life.status !== "finished") return;
    if (run?.finale || finishRequested.current) return;
    finishRequested.current = true;
    finishLife.mutate(lifeId, {
      onSuccess: (res) => {
        if (!run) {
          startRun({
            lifeId,
            characterId: life.characterId,
            seed: life.seed,
            season: life.currentSeason,
            age: life.age,
            stats: life.stats,
            flags: life.flags,
            debts: life.debts,
          });
        }
        setFinale(lifeId, res);
      },
      onError: () => {
        finishRequested.current = false;
      },
    });
  }, [life, run, lifeId, finishLife, setFinale, startRun]);

  // конец сезона → complete (идемпотентен по seed сезона, ретрай безопасен)
  useEffect(() => {
    if (!run || run.phase !== "season-end" || run.seasonClose) return;
    if (completeSeason.isPending || completeSeason.isError) return;
    completeSeason.mutate(
      {
        lifeId,
        seasonNumber: run.season,
        body: {
          seed: seasonSeed(run),
          endState: { stats: run.stats, flags: run.flags, debts: run.debts },
          keyDecisions: run.keyDecisions,
          diary: run.diary,
          unlockedCards: run.unlockedCards,
          unlockedEndingHint: null,
          choiceLog: run.choiceLog,
        },
      },
      {
        onSuccess: (res) => {
          const close: SeasonClose = {
            epilogue: composeEpilogue(run.season, run.diary, run.stats, locale),
            timeSkip: res.timeSkip,
            next: res.nextSeasonStartState,
            lifeIndex: res.seasonResult.lifeIndex,
            statDeltas: statDiff(run.seasonStartStats, run.stats),
            newFlags: newTrueFlags(run.seasonStartFlags, run.flags),
          };
          closeSeason(lifeId, close);
        },
      },
    );
  }, [run, lifeId, completeSeason, closeSeason, locale]);

  const onContinue = () => {
    if (!run?.seasonClose) return;
    if (run.seasonClose.next) {
      beginNextSeason(lifeId);
    } else if (!finishLife.isPending) {
      finishLife.mutate(lifeId, { onSuccess: (res) => setFinale(lifeId, res) });
    }
  };

  if (isLoading) {
    return (
      <CenteredNote>
        <span className="font-display text-xl font-bold text-tg-muted">
          {t("loading")}
        </span>
      </CenteredNote>
    );
  }
  if (isError || !life) {
    return (
      <CenteredNote>
        <p className="font-display text-lg font-bold text-tg-brown">{t("notFound")}</p>
        <p className="text-sm font-semibold text-tg-muted">
          {t("notFoundHint")}
        </p>
        <CtaButton onClick={() => router.push("/lives")} className="max-w-60">
          {t("toLives")}
        </CtaButton>
      </CenteredNote>
    );
  }

  if (run?.phase === "finale" && run.finale) return <FinaleView run={run} />;

  if (run?.phase === "interseason" && run.seasonClose) {
    return <InterseasonView run={run} onContinue={onContinue} continuing={finishLife.isPending} />;
  }

  if (run?.phase === "season-end") {
    return (
      <CenteredNote>
        {completeSeason.isError ? (
          <>
            <p className="font-display text-lg font-bold text-tg-brown">
              {t("saveFailed")}
            </p>
            <p className="text-sm font-semibold text-tg-muted">
              {t("saveFailedHint")}
            </p>
            <CtaButton onClick={() => completeSeason.reset()} className="max-w-60">
              {t("retry")}
            </CtaButton>
          </>
        ) : (
          <>
            <span className="animate-pulse font-display text-xl font-bold text-tg-brown-2">
              {t("yearsFly")}
            </span>
            <span className="text-sm font-semibold text-tg-muted">
              {t("yearsFlyHint")}
            </span>
          </>
        )}
      </CenteredNote>
    );
  }

  if (!run) {
    return (
      <CenteredNote>
        <span className="font-display text-xl font-bold text-tg-muted">
          {t("preparingScene")}
        </span>
        {finishLife.isError && (
          <CtaButton onClick={() => refetch()} className="max-w-60">
            {t("refresh")}
          </CtaButton>
        )}
      </CenteredNote>
    );
  }

  return <TurnView run={run} />;
}
