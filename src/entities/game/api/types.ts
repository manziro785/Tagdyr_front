import type { TimeSkip } from "../model/finance";
import type {
  Debt,
  Ending,
  Flags,
  KeyDecision,
  ChoiceLogEntry,
  KnowledgeCard,
  LifeStatus,
  Stats,
  Character,
} from "../model/types";

/**
 * DTO API — ручное зеркало @tagdyr/schemas бэкенда (пакет не публикуется).
 * Контракт: менять только синхронно с packages/schemas/src/api.ts.
 */

// ── auth ────────────────────────────────────────────────────────────────────

export interface Me {
  id: string;
  email: string | null;
  displayName: string;
  avatarUrl: string | null;
  locale: "ru" | "ky";
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse extends TokenPair {
  user: Me;
}

/** POST /auth/google — ID-токен из Google Identity Services. */
export interface GoogleAuthRequest {
  idToken: string;
}

// ── lives ───────────────────────────────────────────────────────────────────

export interface LifeSummary {
  id: string;
  slotIndex: number;
  characterId: string;
  status: LifeStatus;
  currentSeason: number;
  age: number;
  stats: Stats;
  updatedAt: string;
}

export interface LifeSnapshot {
  id: string;
  lifeId: string;
  seasonNumber: number;
  age: number;
  stats: Stats;
  flags: Flags;
  debts: Debt[];
  keyDecisions: KeyDecision[];
  diary: string[];
  seasonOutcome: string;
  epilogue: string | null;
  seed: string;
  createdAt: string;
}

export interface LifeDetail extends LifeSummary {
  flags: Flags;
  debts: Debt[];
  seed: string;
  lastSnapshot: LifeSnapshot | null;
}

export interface CreateLifeRequest {
  slotIndex: number;
  characterId: string;
  seed: string;
}

// ── complete season ─────────────────────────────────────────────────────────

export interface SeasonEndState {
  stats: Stats;
  flags: Flags;
  debts: Debt[];
}

export interface CompleteSeasonRequest {
  seed: string;
  endState: SeasonEndState;
  keyDecisions: KeyDecision[];
  diary: string[];
  unlockedCards: string[];
  unlockedEndingHint: string | null;
  choiceLog: ChoiceLogEntry[];
}

export interface NextSeasonStartState {
  seasonNumber: number;
  age: number;
  stats: Stats;
  flags: Flags;
  debts: Debt[];
}

export interface SeasonResult {
  id: string;
  seasonNumber: number;
  lifeIndex: number;
}

export interface CompleteSeasonResponse {
  snapshot: LifeSnapshot;
  nextSeasonStartState: NextSeasonStartState | null;
  timeSkip: TimeSkip;
  seasonResult: SeasonResult;
}

// ── finish + коллекции ──────────────────────────────────────────────────────

export interface FinishLifeResponse {
  ending: Ending;
  lifeIndex: number;
  newEnding: boolean;
  unlockedCharacterIds: string[];
}

export interface EndingsCollection {
  total: number;
  unlocked: number;
  items: (Ending & { unlockedAt: string | null })[];
}

export interface CardsCollection {
  total: number;
  unlocked: number;
  items: (KnowledgeCard & { unlockedAt: string | null })[];
}

/**
 * Ростер с сервера содержит только игровые поля (characterSchema бэкенда);
 * витрина place/trait/accent живёт в локальном контенте — брать через
 * getCharacter(item.id). Гостевой localApi отдаёт надмножество — совместимо.
 */
export interface CharactersRoster {
  items: (Omit<Character, "place" | "trait" | "accent"> & {
    unlocked: boolean;
  })[];
}

// ── compare ─────────────────────────────────────────────────────────────────

export interface CompareSeason {
  seasonNumber: number;
  age: number;
  stats: Stats;
  diary: string[];
  keyDecisions: KeyDecision[];
  seasonOutcome: string;
  lifeIndex: number | null;
}

export interface CompareLife {
  id: string;
  characterId: string;
  status: LifeStatus;
  currentSeason: number;
  currentStats: Stats;
  endingCode: string | null;
  seasons: CompareSeason[];
}

export interface CompareResponse {
  a: CompareLife;
  b: CompareLife;
}

// ── интерфейс адаптера ──────────────────────────────────────────────────────

/**
 * Единый интерфейс игрового API. Две реализации: serverApi (axios → Hono)
 * и localApi (гостевой режим, localStorage + клиентские порты движка).
 */
export interface GameApi {
  listLives(): Promise<LifeSummary[]>;
  createLife(req: CreateLifeRequest): Promise<LifeDetail>;
  getLife(id: string): Promise<LifeDetail>;
  archiveLife(id: string): Promise<void>;
  completeSeason(
    lifeId: string,
    seasonNumber: number,
    body: CompleteSeasonRequest,
  ): Promise<CompleteSeasonResponse>;
  finishLife(lifeId: string): Promise<FinishLifeResponse>;
  compare(aId: string, bId: string): Promise<CompareResponse>;
  getEndings(): Promise<EndingsCollection>;
  getCards(): Promise<CardsCollection>;
  getCharacters(): Promise<CharactersRoster>;
}
