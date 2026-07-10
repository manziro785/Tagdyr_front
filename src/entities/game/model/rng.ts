/**
 * Детерминированный seeded RNG — точный порт packages/engine/src/rng.ts бэкенда
 * (cyrb53-хэш + mulberry32). Один seed → одна последовательность на клиенте
 * и сервере; это фундамент реплей-античита, менять только синхронно.
 */

export function hashSeed(seed: string): number {
  let h1 = 0xdeadbeef ^ seed.length;
  let h2 = 0x41c6ce57 ^ seed.length;
  for (let i = 0; i < seed.length; i += 1) {
    const ch = seed.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h1 ^ h2) >>> 0;
}

export interface Rng {
  next(): number;
  int(min: number, max: number): number;
  pick<T>(items: readonly T[]): T;
  chance(p: number): boolean;
  getState(): number;
}

export function createRng(seed: string | number): Rng {
  let state = (typeof seed === "number" ? seed : hashSeed(seed)) >>> 0;

  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  return {
    next,
    int(min, max) {
      if (max < min) throw new Error(`int(${min}, ${max}): max < min`);
      return min + Math.floor(next() * (max - min + 1));
    },
    pick(items) {
      if (items.length === 0) throw new Error("pick() from empty array");
      return items[Math.floor(next() * items.length)] as (typeof items)[number];
    },
    chance(p) {
      return next() < p;
    },
    getState() {
      return state;
    },
  };
}

/** Случайный seed для новой жизни (не криптографический — и не нужно). */
export function randomSeed(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
