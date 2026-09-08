import type { Locale } from "@/i18n/routing";

import { getCharacter, getCharacters } from "../content/characters";
import { getEnding, getEndings } from "../content/endings";
import { getCards } from "../content/cards";
import {
  applyTimeSkip,
  computeLifeIndex,
  recoverAfterYears,
  resolveEnding,
  yearsBetweenSeasons,
  MAX_SEASON,
} from "../model/finance";
import type { Debt, Flags, Stats } from "../model/types";
import type {
  CompareLife,
  CompleteSeasonResponse,
  GameApi,
  LifeDetail,
  LifeSnapshot,
  LifeSummary,
} from "./types";

/**
 * Гостевой режим: тот же контракт GameApi, но данные живут в localStorage,
 * а серверная математика (скип времени, индекс, концовка) выполняется
 * клиентскими портами из model/finance. Игра полностью играбельна без бэкенда.
 *
 * Тексты контента (концовки, карточки, ростер) отдаются на языке страницы —
 * поэтому это фабрика, а не готовый объект: локаль приходит из useGameApi().
 * Сообщения ошибок технические и наружу не показываются: экраны рисуют свои
 * переведённые состояния по isError.
 */

const DB_KEY = "tagdyr-guest-db";

interface StoredLife {
  id: string;
  slotIndex: number;
  characterId: string;
  status: "active" | "finished" | "archived";
  currentSeason: number;
  age: number;
  stats: Stats;
  flags: Flags;
  debts: Debt[];
  seed: string;
  updatedAt: string;
  snapshots: LifeSnapshot[];
  /** Индексы сезонов (заполняются на complete). */
  lifeIndexBySeason: Record<number, number>;
  endingCode: string | null;
}

interface GuestDb {
  lives: StoredLife[];
  endings: Record<string, string>; // code → unlockedAt (ISO)
  cards: Record<string, string>;
  characters: Record<string, string>; // characterId → unlockedAt
}

function loadDb(): GuestDb {
  if (typeof window === "undefined") {
    return { lives: [], endings: {}, cards: {}, characters: {} };
  }
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw) as GuestDb;
  } catch {
    // повреждённые данные — начинаем заново, гостевой режим не критичен
  }
  return { lives: [], endings: {}, cards: {}, characters: {} };
}

function saveDb(db: GuestDb): void {
  window.localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function toSummary(l: StoredLife): LifeSummary {
  return {
    id: l.id,
    slotIndex: l.slotIndex,
    characterId: l.characterId,
    status: l.status,
    currentSeason: l.currentSeason,
    age: l.age,
    stats: l.stats,
    updatedAt: l.updatedAt,
  };
}

function toDetail(l: StoredLife): LifeDetail {
  return {
    ...toSummary(l),
    flags: l.flags,
    debts: l.debts,
    seed: l.seed,
    lastSnapshot: l.snapshots[l.snapshots.length - 1] ?? null,
  };
}

function requireLife(db: GuestDb, id: string): StoredLife {
  const life = db.lives.find((l) => l.id === id);
  if (!life) throw new Error("Life not found (guest mode)");
  return life;
}

export function createLocalApi(locale: Locale): GameApi {
  return {
    async listLives() {
      return loadDb()
        .lives.filter((l) => l.status !== "archived")
        .sort((a, b) => a.slotIndex - b.slotIndex)
        .map(toSummary);
    },

    async createLife(req) {
      const db = loadDb();
      if (db.lives.some((l) => l.slotIndex === req.slotIndex && l.status !== "archived")) {
        throw new Error(`Slot ${req.slotIndex + 1} is already taken`);
      }
      const character = getCharacter(req.characterId, locale);
      if (!character) throw new Error("Unknown character");

      const life: StoredLife = {
        id: crypto.randomUUID(),
        slotIndex: req.slotIndex,
        characterId: character.id,
        status: "active",
        currentSeason: 1,
        age: character.age,
        stats: character.startStats,
        flags: {},
        debts: [],
        seed: req.seed,
        updatedAt: new Date().toISOString(),
        snapshots: [],
        lifeIndexBySeason: {},
        endingCode: null,
      };
      db.lives.push(life);
      saveDb(db);
      return toDetail(life);
    },

    async getLife(id) {
      return toDetail(requireLife(loadDb(), id));
    },

    async archiveLife(id) {
      const db = loadDb();
      const life = requireLife(db, id);
      life.status = "archived";
      saveDb(db);
    },

    async completeSeason(lifeId, seasonNumber, body): Promise<CompleteSeasonResponse> {
      const db = loadDb();
      const life = requireLife(db, lifeId);

      // идемпотентность по seed сезона — как на сервере
      const existing = life.snapshots.find((s) => s.seed === body.seed);
      if (existing) {
        const skip = applyTimeSkip(
          existing.seasonNumber,
          Math.max(0, existing.stats.money),
          existing.debts,
        );
        return {
          snapshot: existing,
          nextSeasonStartState: null,
          timeSkip: skip.timeSkip,
          seasonResult: {
            id: existing.id,
            seasonNumber: existing.seasonNumber,
            lifeIndex: life.lifeIndexBySeason[existing.seasonNumber] ?? 0,
          },
        };
      }
      if (life.status !== "active") throw new Error("Life is already finished");
      if (seasonNumber !== life.currentSeason) {
        throw new Error(`Season mismatch: expected ${life.currentSeason}`);
      }

      const snapshot: LifeSnapshot = {
        id: crypto.randomUUID(),
        lifeId,
        seasonNumber,
        age: life.age,
        stats: body.endState.stats,
        flags: body.endState.flags,
        debts: body.endState.debts,
        keyDecisions: body.keyDecisions,
        diary: body.diary,
        seasonOutcome: "",
        epilogue: null,
        seed: body.seed,
        createdAt: new Date().toISOString(),
      };
      life.snapshots.push(snapshot);

      // фиксация карточек знаний
      const now = new Date().toISOString();
      for (const code of body.unlockedCards) {
        db.cards[code] ??= now;
      }

      // скип времени + индекс — те же формулы, что на сервере
      const skip = applyTimeSkip(
        seasonNumber,
        Math.max(0, body.endState.stats.money),
        body.endState.debts,
      );
      const years = yearsBetweenSeasons(seasonNumber);
      const isFinal = seasonNumber >= MAX_SEASON;
      // как на сервере: деньги после скипа + «годы лечат» энергию и настроение
      const nextStats: Stats = {
        ...body.endState.stats,
        money: skip.savingsAfter,
        ...recoverAfterYears(body.endState.stats, years),
      };

      const lifeIndex = computeLifeIndex(body.endState.stats, Object.keys(db.cards).length);
      life.lifeIndexBySeason[seasonNumber] = lifeIndex;

      life.stats = nextStats;
      life.flags = body.endState.flags;
      life.debts = skip.debtsAfter;
      life.age += years;
      life.updatedAt = now;
      if (isFinal) {
        life.status = "finished";
      } else {
        life.currentSeason = seasonNumber + 1;
      }
      saveDb(db);

      return {
        snapshot,
        nextSeasonStartState: isFinal
          ? null
          : {
              seasonNumber: seasonNumber + 1,
              age: life.age,
              stats: nextStats,
              flags: body.endState.flags,
              debts: skip.debtsAfter,
            },
        timeSkip: skip.timeSkip,
        seasonResult: { id: snapshot.id, seasonNumber, lifeIndex },
      };
    },

    async finishLife(lifeId) {
      const db = loadDb();
      const life = requireLife(db, lifeId);
      if (life.status !== "finished") {
        throw new Error("Finish the last season first");
      }

      const code = resolveEnding(life.stats, life.flags, life.debts);
      const ending = getEnding(code, locale);
      if (!ending) throw new Error(`No content for ending "${code}"`);

      const lifeIndex = computeLifeIndex(
        life.stats,
        Object.keys(db.cards).length,
        ending.bonus,
      );
      life.lifeIndexBySeason[life.currentSeason] = lifeIndex;
      life.endingCode = code;

      const now = new Date().toISOString();
      const newEnding = !db.endings[code];
      db.endings[code] ??= now;

      const unlockedCharacterIds: string[] = [];
      for (const ch of getCharacters(locale)) {
        if (ch.unlockCondition === `ending:${code}` && !db.characters[ch.id]) {
          db.characters[ch.id] = now;
          unlockedCharacterIds.push(ch.id);
        }
      }
      saveDb(db);

      return { ending, lifeIndex, newEnding, unlockedCharacterIds };
    },

    async compare(aId, bId) {
      const db = loadDb();
      const toCompare = (id: string): CompareLife => {
        const life = requireLife(db, id);
        return {
          id: life.id,
          characterId: life.characterId,
          status: life.status,
          currentSeason: life.currentSeason,
          currentStats: life.stats,
          endingCode: life.endingCode,
          seasons: life.snapshots.map((s) => ({
            seasonNumber: s.seasonNumber,
            age: s.age,
            stats: s.stats,
            diary: s.diary,
            keyDecisions: s.keyDecisions,
            seasonOutcome: s.seasonOutcome,
            lifeIndex: life.lifeIndexBySeason[s.seasonNumber] ?? null,
          })),
        };
      };
      return { a: toCompare(aId), b: toCompare(bId) };
    },

    async getEndings() {
      const db = loadDb();
      const items = getEndings(locale).map((e) => ({
        ...e,
        unlockedAt: db.endings[e.code] ?? null,
      }));
      return {
        total: items.length,
        unlocked: items.filter((i) => i.unlockedAt).length,
        items,
      };
    },

    async getCards() {
      const db = loadDb();
      const items = getCards(locale).map((c) => ({
        ...c,
        unlockedAt: db.cards[c.code] ?? null,
      }));
      return {
        total: items.length,
        unlocked: items.filter((i) => i.unlockedAt).length,
        items,
      };
    },

    async getCharacters() {
      const db = loadDb();
      return {
        items: getCharacters(locale).map((ch) => ({
          ...ch,
          unlocked: !ch.isUnlockable || Boolean(db.characters[ch.id]),
        })),
      };
    },
  };
}
