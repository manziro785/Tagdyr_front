import { api } from "@/shared/ui/api/axiosInstance";

import type {
  CardsCollection,
  CharactersRoster,
  CompareResponse,
  CompleteSeasonRequest,
  CompleteSeasonResponse,
  CreateLifeRequest,
  EndingsCollection,
  FinishLifeResponse,
  GameApi,
  LifeDetail,
  LifeSummary,
} from "./types";

/** Реализация GameApi поверх Hono-бэкенда (режим "user"). */
export const serverApi: GameApi = {
  async listLives() {
    const { data } = await api.get<LifeSummary[]>("/lives");
    return data;
  },

  async createLife(req: CreateLifeRequest) {
    const { data } = await api.post<LifeDetail>("/lives", req);
    return data;
  },

  async getLife(id: string) {
    const { data } = await api.get<LifeDetail>(`/lives/${id}`);
    return data;
  },

  async archiveLife(id: string) {
    await api.delete(`/lives/${id}`);
  },

  async completeSeason(lifeId, seasonNumber, body) {
    const { data } = await api.post<CompleteSeasonResponse>(
      `/lives/${lifeId}/seasons/${seasonNumber}/complete`,
      body satisfies CompleteSeasonRequest,
      // ключ идемпотентности: seed сезона уникален, но заголовок надёжнее при ретраях
      { headers: { "Idempotency-Key": `${body.seed}:s${seasonNumber}` } },
    );
    return data;
  },

  async finishLife(lifeId) {
    const { data } = await api.post<FinishLifeResponse>(`/lives/${lifeId}/finish`);
    return data;
  },

  async compare(aId, bId) {
    const { data } = await api.get<CompareResponse>("/lives/compare", {
      params: { a: aId, b: bId },
    });
    return data;
  },

  async getEndings() {
    const { data } = await api.get<EndingsCollection>("/me/endings");
    return data;
  },

  async getCards() {
    const { data } = await api.get<CardsCollection>("/me/knowledge-cards");
    return data;
  },

  async getCharacters() {
    const { data } = await api.get<CharactersRoster>("/me/characters");
    return data;
  },
};
