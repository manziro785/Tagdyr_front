import type { LifeStatus, Stats } from "@/entities/game/model/types";

/**
 * DTO меты (дилемма дня, лидерборд, share) — ручное зеркало
 * @tagdyr/schemas/src/meta.ts. Контракт: менять только синхронно с бэкендом.
 */

// ── дилемма дня ─────────────────────────────────────────────────────────────

export interface DilemmaOptionStat {
  index: number;
  text: string;
  /** Доля выбравших, 0..100. */
  percent: number;
  votes: number;
}

export interface DilemmaToday {
  id: string;
  /** UTC, YYYY-MM-DD — по ней видно, что наступил новый день. */
  date: string;
  prompt: string;
  options: string[];
  /** Индекс выбранного варианта, null — ещё не отвечал. */
  myChoice: number | null;
  totalVotes: number;
  /** Сервер отдаёт распределение только ответившим (иначе это подсказка). */
  distribution: DilemmaOptionStat[] | null;
}

// ── лидерборд ───────────────────────────────────────────────────────────────

export type LeaderboardWindow = "week" | "month" | "all";

export interface LeaderboardEntry {
  rank: number;
  lifeId: string;
  displayName: string;
  characterId: string;
  lifeIndex: number;
  isMe: boolean;
}

export interface LeaderboardMe {
  lifeId: string;
  rank: number;
  lifeIndex: number;
  /** Процент участников, которых обошёл игрок (0..100). */
  percentile: number;
}

export interface Leaderboard {
  season: number;
  window: LeaderboardWindow;
  totalPlayers: number;
  entries: LeaderboardEntry[];
  /** Лучший результат игрока в сезоне; null — ещё не играл. */
  me: LeaderboardMe | null;
  /** Курсор следующей страницы; null — страниц больше нет. */
  nextCursor: string | null;
}

export interface LeaderboardParams {
  season: number;
  window: LeaderboardWindow;
  limit?: number;
  cursor?: string;
}

// ── share ───────────────────────────────────────────────────────────────────

/** Публичный срез жизни: ни email, ни флагов, ни дневника. */
export interface SharePayload {
  lifeId: string;
  displayName: string;
  characterId: string;
  status: LifeStatus;
  seasonsPlayed: number;
  age: number;
  stats: Stats;
  lifeIndex: number;
  endingId: string | null;
  endingTitle: string | null;
  createdAt: string;
}

export interface ShareLink {
  token: string;
  payload: SharePayload;
}
