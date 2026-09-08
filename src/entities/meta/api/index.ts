"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useLocale } from "next-intl";

import { useAuthStore } from "@/entities/session/model/auth-store";

import { metaApi } from "./meta-api";
import type { DilemmaToday, LeaderboardWindow } from "./types";

export type {
  DilemmaToday,
  Leaderboard,
  LeaderboardEntry,
  LeaderboardWindow,
  SharePayload,
  ShareLink,
} from "./types";

const keys = {
  // текст дилеммы приходит с сервера переведённым — язык обязан быть в ключе
  dilemma: (locale: string) => ["meta", "dilemma", "today", locale] as const,
  leaderboard: (season: number, window: LeaderboardWindow) =>
    ["meta", "leaderboard", season, window] as const,
};

/** Мета живёт только у вошедших: у гостя нет токена, а 401 выкинул бы его на логин. */
function useIsUser(): boolean {
  return useAuthStore((s) => s.mode) === "user";
}

export function useDilemmaToday() {
  const enabled = useIsUser();
  const locale = useLocale();
  return useQuery({
    queryKey: keys.dilemma(locale),
    queryFn: () => metaApi.getTodayDilemma(),
    enabled,
  });
}

export function useAnswerDilemma() {
  const qc = useQueryClient();
  const locale = useLocale();
  return useMutation({
    mutationFn: (choiceIndex: number) => metaApi.answerTodayDilemma(choiceIndex),
    // ответ мутации — та же дилемма со свежим распределением: кладём в кэш
    // напрямую, чтобы проценты появились без второго запроса
    onSuccess: (data: DilemmaToday) => qc.setQueryData(keys.dilemma(locale), data),
  });
}

/**
 * NEW PATTERN: useInfiniteQuery — react-query сам хранит массив страниц и
 * курсор следующей. getNextPageParam получает последнюю страницу и возвращает
 * значение, которое прилетит в queryFn как pageParam; undefined = страниц нет.
 */
export function useLeaderboard(season: number, window: LeaderboardWindow) {
  const enabled = useIsUser();
  return useInfiniteQuery({
    queryKey: keys.leaderboard(season, window),
    queryFn: ({ pageParam }) =>
      metaApi.getLeaderboard({ season, window, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    enabled,
  });
}

/** Ссылка создаётся по клику, а не при рендере — поэтому мутация, а не запрос. */
export function useShareLink() {
  return useMutation({
    mutationFn: (lifeId: string) => metaApi.getShareLink(lifeId),
  });
}
