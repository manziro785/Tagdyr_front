"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/entities/session/model/auth-store";

import { localApi } from "./local-api";
import { serverApi } from "./server-api";
import type {
  CompleteSeasonRequest,
  CreateLifeRequest,
  GameApi,
} from "./types";

export type { GameApi } from "./types";

/** Активная реализация API по режиму сессии. Гость по умолчанию — игра работает без сервера. */
export function useGameApi(): { gameApi: GameApi; mode: "user" | "guest" } {
  const mode = useAuthStore((s) => s.mode);
  return mode === "user"
    ? { gameApi: serverApi, mode: "user" }
    : { gameApi: localApi, mode: "guest" };
}

/** Ключи кэша разведены по режиму — гостевые и серверные данные не смешиваются. */
const keys = {
  lives: (mode: string) => [mode, "lives"] as const,
  life: (mode: string, id: string) => [mode, "lives", id] as const,
  endings: (mode: string) => [mode, "endings"] as const,
  cards: (mode: string) => [mode, "cards"] as const,
  characters: (mode: string) => [mode, "characters"] as const,
  compare: (mode: string, a: string, b: string) => [mode, "compare", a, b] as const,
};

export function useLives() {
  const { gameApi, mode } = useGameApi();
  return useQuery({ queryKey: keys.lives(mode), queryFn: () => gameApi.listLives() });
}

export function useLife(id: string | null) {
  const { gameApi, mode } = useGameApi();
  return useQuery({
    queryKey: keys.life(mode, id ?? "none"),
    queryFn: () => gameApi.getLife(id!),
    enabled: Boolean(id),
  });
}

export function useCreateLife() {
  const { gameApi, mode } = useGameApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: CreateLifeRequest) => gameApi.createLife(req),
    onSuccess: () => void qc.invalidateQueries({ queryKey: keys.lives(mode) }),
  });
}

export function useArchiveLife() {
  const { gameApi, mode } = useGameApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => gameApi.archiveLife(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: keys.lives(mode) }),
  });
}

export function useCompleteSeason() {
  const { gameApi, mode } = useGameApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { lifeId: string; seasonNumber: number; body: CompleteSeasonRequest }) =>
      gameApi.completeSeason(args.lifeId, args.seasonNumber, args.body),
    onSuccess: (_res, args) => {
      void qc.invalidateQueries({ queryKey: keys.lives(mode) });
      void qc.invalidateQueries({ queryKey: keys.life(mode, args.lifeId) });
      void qc.invalidateQueries({ queryKey: keys.cards(mode) });
    },
  });
}

export function useFinishLife() {
  const { gameApi, mode } = useGameApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (lifeId: string) => gameApi.finishLife(lifeId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.lives(mode) });
      void qc.invalidateQueries({ queryKey: keys.endings(mode) });
      void qc.invalidateQueries({ queryKey: keys.characters(mode) });
    },
  });
}

export function useEndingsCollection() {
  const { gameApi, mode } = useGameApi();
  return useQuery({ queryKey: keys.endings(mode), queryFn: () => gameApi.getEndings() });
}

export function useCardsCollection() {
  const { gameApi, mode } = useGameApi();
  return useQuery({ queryKey: keys.cards(mode), queryFn: () => gameApi.getCards() });
}

export function useCharactersRoster() {
  const { gameApi, mode } = useGameApi();
  return useQuery({ queryKey: keys.characters(mode), queryFn: () => gameApi.getCharacters() });
}

export function useCompare(a: string | null, b: string | null) {
  const { gameApi, mode } = useGameApi();
  return useQuery({
    queryKey: keys.compare(mode, a ?? "none", b ?? "none"),
    queryFn: () => gameApi.compare(a!, b!),
    enabled: Boolean(a && b),
  });
}
