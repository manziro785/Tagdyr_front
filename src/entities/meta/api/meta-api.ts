import { api } from "@/shared/ui/api/axiosInstance";

import type {
  DilemmaToday,
  Leaderboard,
  LeaderboardParams,
  ShareLink,
} from "./types";

/**
 * Мета-роуты фазы 5. В отличие от игрового GameApi гостевой реализации нет:
 * дилемма и рейтинг — про общее поле игроков, без аккаунта они бессмысленны.
 * Экран сам решает, звать ли эти запросы (см. хуки: enabled по режиму сессии).
 */
export const metaApi = {
  async getTodayDilemma(): Promise<DilemmaToday> {
    const { data } = await api.get<DilemmaToday>("/dilemma/today");
    return data;
  },

  async answerTodayDilemma(choiceIndex: number): Promise<DilemmaToday> {
    const { data } = await api.post<DilemmaToday>("/dilemma/today/answer", {
      choiceIndex,
    });
    return data;
  },

  async getLeaderboard(params: LeaderboardParams): Promise<Leaderboard> {
    const { data } = await api.get<Leaderboard>("/leaderboard", { params });
    return data;
  },

  /** Токен стабильный: повторный вызов вернёт ту же ссылку. */
  async getShareLink(lifeId: string): Promise<ShareLink> {
    const { data } = await api.get<ShareLink>(`/lives/${lifeId}/share`);
    return data;
  },
};
