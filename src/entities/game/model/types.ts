/**
 * Доменные типы игры. Зеркалируют zod-схемы бэкенда (@tagdyr/schemas) —
 * пакеты не публикуются, поэтому типы продублированы вручную и помечены
 * как контракт: менять только синхронно с бэкендом.
 *
 * Типы контента параметризованы типом текста `T`: в файлах контента лежит
 * `Localized` (все языки сразу), а в UI приезжает уже выбранная `string`.
 * Дефолт `T = string` — поэтому компоненты пишут просто `GameEvent`.
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
export interface Effects<T = string> {
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
  diary?: T;
}

export interface EventChoice<T = string> {
  /** Стабильный код выбора — уходит в keyDecisions / choiceLog. */
  id: string;
  text: T;
  /** Выделить как «главный» вариант (янтарная кнопка). */
  primary?: boolean;
  /** Шанс успеха в процентах; провал применяет failEffects. */
  chance?: number;
  effects: Effects<T>;
  failEffects?: Effects<T>;
  /** Текст при провале риска (показывается в тосте результата). */
  failText?: T;
  /** Выбор доступен только при условии (иначе серый с замком). */
  requires?: Condition;
}

export interface GameEvent<T = string> {
  code: string;
  season: number;
  /** Подпись места/темы: «Двор · той у родни». */
  kicker: T;
  text: T;
  choices: EventChoice<T>[];
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

export interface Character<T = string> {
  id: string;
  code: string;
  name: T;
  age: number;
  description: T;
  startStats: Stats;
  unlockCondition: string | null;
  isUnlockable: boolean;
  /** Клиентская витрина (нет на сервере): откуда родом и черта характера. */
  place: T;
  trait: T;
  accent: "amber" | "sage" | "terracotta" | "rose";
}

export type KnowledgeCardCategory =
  | "finance"
  | "relationships"
  | "health"
  | "career"
  | "life";

export interface KnowledgeCard<T = string> {
  id: string;
  code: string;
  title: T;
  category: KnowledgeCardCategory;
  body: T;
  season: number;
}

export interface Ending<T = string> {
  id: string;
  code: string;
  title: T;
  archetype: T;
  description: T;
  bonus: number;
}

// ── сезоны ───────────────────────────────────────────────────────────────────

/** Все фоновые сцены (базовые сезонные + вариации для разнообразия). */
export type SceneName =
  | "valley"
  | "campus"
  | "bazaar"
  | "city"
  | "issykkul"
  | "jailoo"
  | "city-evening";

export interface SeasonMeta<T = string> {
  number: number;
  /** «Выпускник», «Студенчество»… */
  title: T;
  /** Возраст на старте сезона. */
  ageAtStart: number;
  /** Локация для шапки: «Село в Нарыне». */
  place: T;
  /** Ключ фоновой сцены. */
  scene: SceneName;
  /** Сколько ходов в сезоне. */
  turns: number;
  /** Тизер следующего этапа (показывается в межсезонье предыдущего); пусто у финального. */
  teaser: T | null;
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
