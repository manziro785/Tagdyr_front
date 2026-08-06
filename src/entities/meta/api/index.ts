"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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
  dilemma: () => ["meta", "dilemma", "today"] as const,
  leaderboard: (season: number, window: LeaderboardWindow) =>
    ["meta", "leaderboard", season, window] as const,
};

/** Мета живёт только у вошедших: у гостя нет токена, а 401 выкинул бы его на логин. */
function useIsUser(): boolean {
  return useAuthStore((s) => s.mode) === "user";
}

export function useDilemmaToday() {
  const enabled = useIsUser();
  return useQuery({
    queryKey: keys.dilemma(),
    queryFn: () => metaApi.getTodayDilemma(),
    enabled,
  });
}

export function useAnswerDilemma() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (choiceIndex: number) => metaApi.answerTodayDilemma(choiceIndex),
    // ответ мутации — та же дилемма со свежим распределением: кладём в кэш
    // напрямую, чтобы проценты появились без второго запроса
    onSuccess: (data: DilemmaToday) => qc.setQueryData(keys.dilemma(), data),
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
