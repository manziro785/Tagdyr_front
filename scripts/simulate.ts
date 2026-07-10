/**
 * Смоук-симуляция игры: прогоняет полные жизни по детерминированным сидам
 * через движок и контент, проверяя целостность (валидные ссылки на карточки,
 * уникальные коды, достижимость концовок, ограниченность статов).
 *
 * Запуск: node ../tagdyr-backend/node_modules/tsx/dist/cli.mjs scripts/simulate.ts
 */
import { ALL_EVENTS } from "../src/entities/game/content/events";
import { CHARACTERS } from "../src/entities/game/content/characters";
import { ENDINGS, getEnding } from "../src/entities/game/content/endings";
import { getCard } from "../src/entities/game/content/cards";
import { SEASONS } from "../src/entities/game/content/seasons";
import { applyChoice, choiceAvailable, currentEvent } from "../src/entities/game/model/engine";
import {
  applyTimeSkip,
  computeLifeIndex,
  recoverAfterYears,
  resolveEnding,
  yearsBetweenSeasons,
  MAX_SEASON,
} from "../src/entities/game/model/finance";
import { createRng } from "../src/entities/game/model/rng";
import type { Debt, Flags, Stats } from "../src/entities/game/model/types";

let failures = 0;
function check(cond: boolean, msg: string): void {
  if (!cond) {
    failures += 1;
    console.error(`  ✗ ${msg}`);
  }
}

// ── 1. Целостность контента ───────────────────────────────────────────────
console.log("Контент:");
const codes = new Set<string>();
for (const e of ALL_EVENTS) {
  check(!codes.has(e.code), `дубль кода события ${e.code}`);
  codes.add(e.code);
  check(e.choices.length >= 1 && e.choices.length <= 4, `${e.code}: ${e.choices.length} выборов`);
  const choiceIds = new Set<string>();
  for (const c of e.choices) {
    check(!choiceIds.has(c.id), `${e.code}: дубль выбора ${c.id}`);
    choiceIds.add(c.id);
    for (const eff of [c.effects, c.failEffects]) {
      if (eff?.card) check(getCard(eff.card) !== undefined, `${e.code}/${c.id}: нет карточки ${eff.card}`);
    }
    if (c.chance !== undefined) check(c.chance > 0 && c.chance < 100, `${e.code}/${c.id}: странный шанс ${c.chance}`);
  }
}
for (const s of SEASONS) {
  const pool = ALL_EVENTS.filter((e) => e.season === s.number);
  const unconditional = pool.filter((e) => !e.requires);
  check(pool.length >= s.turns - 2, `сезон ${s.number}: пул ${pool.length} < turns-2`);
  check(unconditional.length >= 4, `сезон ${s.number}: только ${unconditional.length} безусловных событий`);
}
console.log(`  событий: ${ALL_EVENTS.length}, сезонов: ${SEASONS.length}, концовок: ${ENDINGS.length}`);

// ── 2. Симуляция полных жизней ────────────────────────────────────────────
type Profile = "random" | "sensible";
const cardsSeen = new Set<string>();

function simulateLives(profile: Profile, count: number): Map<string, number> {
  const endingCounts = new Map<string, number>();
  let minMoney = Infinity;
  let maxMoney = -Infinity;

  for (let i = 0; i < count; i += 1) {
    const character = CHARACTERS[i % CHARACTERS.length]!;
    const baseSeed = `sim-${profile}-${i}`;
    const picker = createRng(`picker-${profile}-${i}`);

    let stats: Stats = { ...character.startStats };
    let flags: Flags = {};
    let debts: Debt[] = [];
    let age = character.age;

    for (let season = 1; season <= MAX_SEASON; season += 1) {
      const seed = `${baseSeed}-s${season}`;
      const used: string[] = [];
      let turn = 0;
      let guard = 0;

      for (;;) {
        guard += 1;
        check(guard < 50, `seed ${baseSeed} s${season}: бесконечный сезон`);
        if (guard >= 50) break;

        const event = currentEvent(seed, season, turn, used, {
          characterId: character.id, stats, flags, debts,
        });
        if (!event) break;

        const available = event.choices.filter((c) =>
          choiceAvailable(c, { characterId: character.id, stats, flags, debts }),
        );
        check(available.length > 0, `${event.code}: нет доступных выборов (money=${stats.money})`);
        if (available.length === 0) break;

        // random — равновероятно; sensible — гасит долги и предпочитает primary ×4
        let pool = available;
        if (profile === "sensible") {
          const payoff = available.filter((c) => (c.effects.payDebt ?? 0) >= 20_000);
          if (payoff.length > 0) {
            pool = payoff;
          } else {
            pool = available.flatMap((c) => (c.primary ? [c, c, c, c] : [c]));
          }
        }
        const choice = pool[Math.floor(picker.next() * pool.length)]!;
        const res = applyChoice(seed, season, turn, event, choice, {
          characterId: character.id, stats, flags, debts,
        });
        stats = res.stats;
        flags = res.flags;
        debts = res.debts;
        if (res.outcome.unlockedCard) cardsSeen.add(res.outcome.unlockedCard.code);

        for (const k of ["energy", "mood", "relationships"] as const) {
          check(stats[k] >= 0 && stats[k] <= 100, `${event.code}: ${k}=${stats[k]} вне 0..100`);
        }
        used.push(event.code);
        turn += 1;
      }
      check(turn > 0, `seed ${baseSeed} s${season}: сезон без единого события`);

      // межсезонный скип — как на сервере
      const skip = applyTimeSkip(season, Math.max(0, stats.money), debts);
      const years = yearsBetweenSeasons(season);
      stats = { ...stats, money: skip.savingsAfter, ...recoverAfterYears(stats, years) };
      debts = skip.debtsAfter;
      age += years;
    }

    const endingCode = resolveEnding(stats, flags, debts);
    check(getEnding(endingCode) !== undefined, `концовка ${endingCode} без контента`);
    endingCounts.set(endingCode, (endingCounts.get(endingCode) ?? 0) + 1);

    const index = computeLifeIndex(stats, cardsSeen.size, getEnding(endingCode)?.bonus ?? 0);
    check(Number.isFinite(index) && index >= 0, `индекс ${index} невалиден`);
    // 17 + (1+1+3+5): после финального сезона годы не добавляются
    check(age === 27, `возраст финала ${age}, ожидался 27`);
    minMoney = Math.min(minMoney, stats.money);
    maxMoney = Math.max(maxMoney, stats.money);
  }

  console.log(`  [${profile}] деньги финала: от ${minMoney} до ${maxMoney}`);
  for (const [code, count] of [...endingCounts.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${code.padEnd(15)} ${count} (${Math.round((count / 300) * 100)}%)`);
  }
  return endingCounts;
}

console.log("Симуляция 300 жизней (случайные выборы):");
simulateLives("random", 300);
console.log("Симуляция 300 жизней (разумные выборы):");
const sensible = simulateLives("sensible", 300);
check(
  (sensible.get("debt_trap") ?? 0) / 300 < 0.35,
  "разумная игра слишком часто кончается долговой ямой",
);
console.log(`  карточек открыто симуляцией: ${cardsSeen.size} из 12`);

// детерминизм: один сид — один результат
{
  const runOnce = () => {
    let stats: Stats = { ...CHARACTERS[0]!.startStats };
    let flags: Flags = {};
    let debts: Debt[] = [];
    for (let season = 1; season <= MAX_SEASON; season += 1) {
      const used: string[] = [];
      let turn = 0;
      for (;;) {
        const ev = currentEvent(`det-s${season}`, season, turn, used, {
          characterId: CHARACTERS[0]!.id, stats, flags, debts,
        });
        if (!ev) break;
        const c = ev.choices.find((x) =>
          choiceAvailable(x, { characterId: CHARACTERS[0]!.id, stats, flags, debts }),
        )!;
        const res = applyChoice(`det-s${season}`, season, turn, ev, c, {
          characterId: CHARACTERS[0]!.id, stats, flags, debts,
        });
        stats = res.stats; flags = res.flags; debts = res.debts;
        used.push(ev.code); turn += 1;
      }
      const skip = applyTimeSkip(season, Math.max(0, stats.money), debts);
      stats = { ...stats, money: skip.savingsAfter };
      debts = skip.debtsAfter;
    }
    return JSON.stringify({ stats, flags, debts });
  };
  check(runOnce() === runOnce(), "детерминизм нарушен: один сид дал разные результаты");
  console.log("  детерминизм: один сид → один результат ✓");
}

if (failures > 0) {
  console.error(`\nПровалено проверок: ${failures}`);
  process.exit(1);
}
console.log("\nВсе проверки симуляции пройдены ✓");
