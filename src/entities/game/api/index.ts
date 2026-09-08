"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useMemo } from "react";

import { useAuthStore } from "@/entities/session/model/auth-store";
import type { Locale } from "@/i18n/routing";

import { createLocalApi } from "./local-api";
import { serverApi } from "./server-api";
import type {
  CompleteSeasonRequest,
  CreateLifeRequest,
  GameApi,
} from "./types";

export type { GameApi } from "./types";

/**
 * Активная реализация API по режиму сессии. Гость по умолчанию — игра работает
 * без сервера. Серверный API получает язык заголовком Accept-Language
 * (см. axiosInstance), гостевому локаль нужна явно: он сам достаёт контент.
 *
 * scope = режим + язык: тексты концовок и карточек приходят переведёнными,
 * поэтому кэш react-query нельзя переиспользовать между языками.
 */
export function useGameApi(): { gameApi: GameApi; mode: "user" | "guest"; scope: string } {
  const mode = useAuthStore((s) => s.mode);
  const locale = useLocale() as Locale;
  return useMemo(
    () =>
      mode === "user"
        ? { gameApi: serverApi, mode: "user" as const, scope: `user:${locale}` }
        : { gameApi: createLocalApi(locale), mode: "guest" as const, scope: `guest:${locale}` },
    [mode, locale],
  );
}

/** Ключи кэша разведены по режиму и языку — данные не смешиваются. */
const keys = {
  lives: (scope: string) => [scope, "lives"] as const,
  life: (scope: string, id: string) => [scope, "lives", id] as const,
  endings: (scope: string) => [scope, "endings"] as const,
  cards: (scope: string) => [scope, "cards"] as const,
  characters: (scope: string) => [scope, "characters"] as const,
  compare: (scope: string, a: string, b: string) => [scope, "compare", a, b] as const,
};

export function useLives() {
  const { gameApi, scope } = useGameApi();
  return useQuery({ queryKey: keys.lives(scope), queryFn: () => gameApi.listLives() });
}

export function useLife(id: string | null) {
  const { gameApi, scope } = useGameApi();
  return useQuery({
    queryKey: keys.life(scope, id ?? "none"),
    queryFn: () => gameApi.getLife(id!),
    enabled: Boolean(id),
  });
}

export function useCreateLife() {
  const { gameApi, scope } = useGameApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: CreateLifeRequest) => gameApi.createLife(req),
    onSuccess: () => void qc.invalidateQueries({ queryKey: keys.lives(scope) }),
  });
}

export function useArchiveLife() {
  const { gameApi, scope } = useGameApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => gameApi.archiveLife(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: keys.lives(scope) }),
  });
}

export function useCompleteSeason() {
  const { gameApi, scope } = useGameApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { lifeId: string; seasonNumber: number; body: CompleteSeasonRequest }) =>
      gameApi.completeSeason(args.lifeId, args.seasonNumber, args.body),
    onSuccess: (_res, args) => {
      void qc.invalidateQueries({ queryKey: keys.lives(scope) });
      void qc.invalidateQueries({ queryKey: keys.life(scope, args.lifeId) });
      void qc.invalidateQueries({ queryKey: keys.cards(scope) });
    },
  });
}

export function useFinishLife() {
  const { gameApi, scope } = useGameApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (lifeId: string) => gameApi.finishLife(lifeId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.lives(scope) });
      void qc.invalidateQueries({ queryKey: keys.endings(scope) });
      void qc.invalidateQueries({ queryKey: keys.characters(scope) });
    },
  });
}

export function useEndingsCollection() {
  const { gameApi, scope } = useGameApi();
  return useQuery({ queryKey: keys.endings(scope), queryFn: () => gameApi.getEndings() });
}

export function useCardsCollection() {
  const { gameApi, scope } = useGameApi();
  return useQuery({ queryKey: keys.cards(scope), queryFn: () => gameApi.getCards() });
}

export function useCharactersRoster() {
  const { gameApi, scope } = useGameApi();
  return useQuery({ queryKey: keys.characters(scope), queryFn: () => gameApi.getCharacters() });
}

export function useCompare(a: string | null, b: string | null) {
  const { gameApi, scope } = useGameApi();
  return useQuery({
    queryKey: keys.compare(scope, a ?? "none", b ?? "none"),
    queryFn: () => gameApi.compare(a!, b!),
    enabled: Boolean(a && b),
  });
}
