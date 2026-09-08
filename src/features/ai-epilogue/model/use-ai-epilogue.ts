"use client";

import { useLocale } from "next-intl";
import { useEffect, useRef } from "react";

import { streamSeasonEpilogue } from "@/entities/game/api/ai-api";
import { useGameApi } from "@/entities/game/api";
import { useRunsStore, type RunState } from "@/entities/game/model/run-store";

/**
 * Дописывает эпилог межсезонья текстом от сервера.
 *
 * Шаблон уже лежит в сторе к моменту вызова (его кладёт PlayScreen сразу после
 * complete), поэтому игрок никогда не видит пустоту: стрим лишь заменяет текст,
 * а на любой осечке шаблон возвращается на место.
 *
 * Только для залогиненных: /ai/* за авторизацией, у гостя нет ни токена, ни
 * снапшота на сервере — он остаётся на локальном composeEpilogue.
 */
export function useAiEpilogue(lifeId: string, run: RunState | undefined): void {
  const { mode } = useGameApi();
  const locale = useLocale();
  const setEpilogue = useRunsStore((s) => s.setEpilogue);

  // ключ последней запрошенной генерации — чтобы не звать сервер на каждый рендер
  const requested = useRef<string | null>(null);

  const phase = run?.phase;
  const season = run?.season;
  const hasClose = Boolean(run?.seasonClose);

  useEffect(() => {
    if (mode !== "user" || phase !== "interseason" || !hasClose || season === undefined) return;

    const key = `${lifeId}:${season}:${locale}`;
    if (requested.current === key) return;
    requested.current = key;

    // текст, к которому возвращаемся, если сервер не доедет
    const template = useRunsStore.getState().runs[lifeId]?.seasonClose?.epilogue ?? "";
    const controller = new AbortController();
    let accumulated = "";

    streamSeasonEpilogue(
      { lifeId, seasonNumber: season, signal: controller.signal },
      {
        onDelta: (text) => {
          accumulated += text;
          setEpilogue(lifeId, accumulated);
        },
        onReset: () => {
          accumulated = "";
          setEpilogue(lifeId, template);
        },
        onDone: (text) => {
          if (text) setEpilogue(lifeId, text);
        },
      },
    ).catch((err: unknown) => {
      if (controller.signal.aborted) return;
      // не глотаем: иначе непонятно, почему игрок всегда видит шаблон
      console.error("[ai] эпилог не пришёл, остаётся шаблон:", err);
      // обрыв на середине оставил бы огрызок — возвращаем целый текст
      setEpilogue(lifeId, template);
      requested.current = null; // следующий заход в межсезонье попробует снова
    });

    return () => controller.abort();
  }, [mode, phase, hasClose, season, lifeId, locale, setEpilogue]);
}
