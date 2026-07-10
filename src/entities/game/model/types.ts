/**
 * Доменные типы игры. Зеркалируют zod-схемы бэкенда (@tagdyr/schemas) —
 * пакеты не публикуются, поэтому типы продублированы вручную и помечены
 * как контракт: менять только синхронно с бэкендом.
 */

// ── базовое состояние жизни ──────────────────────────────────────────────────

export interface Stats {
  /** Сомы. Может уходить в минус концептуально, но UI держит >= 0 через долги. */
  money: number;
  /** 0..100 */
  energy: number;
  /** 0..100 */
  mood: number;
  /** 0..100 */
  relationships: number;
}

export type Flags = Record<string, boolean | number>;

export interface Debt {
  amount: number;
  /** Годовая ставка: 0.14 = 14%. */
  rate: number;
  sinceSeason: number;
}

export type LifeStatus = "active" | "finished" | "archived";

export interface KeyDecision {
  code: string;
  choice: string;
}

export interface ChoiceLogEntry {
  turn: number;
  eventCode: string;
  choice: string | number;
}

// ── контент: события ─────────────────────────────────────────────────────────

/** Условие доступности события/выбора. Все поля объединяются по «И». */
export interface Condition {
  /** flags[flag] === true */
  flag?: string;
  /** flags[flag] не выставлен или false */
  notFlag?: string;
  minMoney?: number;
  maxMoney?: number;
  /** true — есть непогашенные долги; false — долгов нет. */
  hasDebt?: boolean;
  minStat?: Partial<Pick<Stats, "energy" | "mood" | "relationships">>;
  characterId?: string;
}

/** Эффекты выбора. Все поля опциональны и применяются вместе. */
export interface Effects {
  /** Дельты статов (money — в сомах, остальное — пункты 0..100). */
  stats?: Partial<Stats>;
  /** Выставить флаги. */
  flags?: Flags;
  /** Взять долг (добавляется к текущим). */
  debt?: { amount: number; rate: number };
  /** Погасить долги на сумму (списывает с самых дорогих). */
  payDebt?: number;
  /** Код карточки знаний, которая открывается. */
  card?: string;
  /** Строка в дневник сезона (от первого лица, прошедшее время). */
  diary?: string;
}

export interface EventChoice {
  /** Стабильный код выбора — уходит в keyDecisions / choiceLog. */
  id: string;
  text: string;
  /** Выделить как «главный» вариант (янтарная кнопка). */
  primary?: boolean;
  /** Шанс успеха в процентах; провал применяет failEffects. */
  chance?: number;
  effects: Effects;
  failEffects?: Effects;
  /** Текст при провале риска (показывается в тосте результата). */
  failText?: string;
  /** Выбор доступен только при условии (иначе серый с замком). */
  requires?: Condition;
}

export interface GameEvent {
  code: string;
  season: number;
  /** Подпись места/темы: «Двор · той у родни». */
  kicker: string;
  text: string;
  choices: EventChoice[];
  /** Условие попадания в пул. */
  requires?: Condition;
  /** Вес при случайном выборе из пула (default 1). */
  weight?: number;
  /** Ключевая развилка — попадает в keyDecisions снапшота. */
  key?: boolean;
  /** Спец-экран вместо карточки (мини-игра). */
  special?: "budget";
}

// ── контент: персонажи, карточки, концовки ──────────────────────────────────

export interface Character {
  id: string;
  code: string;
  name: string;
  age: number;
  description: string;
  startStats: Stats;
  unlockCondition: string | null;
  isUnlockable: boolean;
  /** Клиентская витрина (нет на сервере): откуда родом и черта характера. */
  place: string;
  trait: string;
  accent: "amber" | "sage" | "terracotta" | "rose";
}

export type KnowledgeCardCategory =
  | "finance"
  | "relationships"
  | "health"
  | "career"
  | "life";

export interface KnowledgeCard {
  id: string;
  code: string;
  title: string;
  category: KnowledgeCardCategory;
  body: string;
  season: number;
}

export interface Ending {
  id: string;
  code: string;
  title: string;
  archetype: string;
  description: string;
  bonus: number;
}

// ── сезоны ───────────────────────────────────────────────────────────────────

export interface SeasonMeta {
  number: number;
  /** «Выпускник», «Студенчество»… */
  title: string;
  /** Возраст на старте сезона. */
  ageAtStart: number;
  /** Локация для шапки: «Село в Нарыне». */
  place: string;
  /** Ключ фоновой сцены. */
  scene: "valley" | "campus" | "bazaar" | "city" | "issykkul";
  /** Сколько ходов в сезоне. */
  turns: number;
  /** Тизер следующего этапа (показывается в межсезонье предыдущего). */
  teaser: string;
}

// ── результат хода ───────────────────────────────────────────────────────────

export interface TurnOutcome {
  eventCode: string;
  choiceId: string;
  /** false — риск не выгорел, применились failEffects. */
  success: boolean;
  failText?: string;
  /** Что реально изменилось (для плашек ±). */
  statDeltas: Partial<Stats>;
  tookDebt?: { amount: number; rate: number };
  unlockedCard?: KnowledgeCard;
}
