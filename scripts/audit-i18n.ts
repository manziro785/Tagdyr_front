/**
 * Аудит качества переводов: ищет строки, совпадающие между языками (признак
 * «скопировал и не перевёл»), кириллицу в английских текстах и пустые значения.
 *
 * simulate.ts проверяет структуру (все ключи на месте, строки не пустые), а это —
 * содержимое: ключ может быть на месте, но лежать в нём английский оригинал.
 *
 * Запуск: node ../tagdyr-backend/node_modules/tsx/dist/cli.mjs scripts/audit-i18n.ts
 */
import { ALL_EVENTS } from "../src/entities/game/content/events";
import * as cards from "../src/entities/game/content/cards";
import * as characters from "../src/entities/game/content/characters";
import * as endings from "../src/entities/game/content/endings";
import * as seasons from "../src/entities/game/content/seasons";
import * as goals from "../src/entities/game/content/goals";
import * as epilogue from "../src/entities/game/model/epilogue";
import enMessages from "../messages/en.json";
import ruMessages from "../messages/ru.json";
import kyMessages from "../messages/ky.json";

type Localized = { en: string; ru: string; ky: string };

const isLocalized = (v: unknown): v is Localized =>
  !!v &&
  typeof v === "object" &&
  !Array.isArray(v) &&
  ["en", "ru", "ky"].every((k) => typeof (v as Record<string, unknown>)[k] === "string");

const CYRILLIC = /[а-яёА-ЯЁ]/;
/** Строки без букв (числа, «100», эмодзи) законно одинаковы во всех языках. */
const hasLetters = (s: string) => /\p{L}{2,}/u.test(s);

/**
 * Совпадения, проверенные глазами и признанные нормой:
 * — эндонимы («Русский» одинаков во всех языках по определению);
 * — имя игры, имена-примеры и строки из одних плейсхолдеров;
 * — заимствования, которые кыргызский использует в русской форме
 *   («Рейтинг», «Профиль», «Бюджет», «Карьера», «Почта», «архетип»).
 * Всё, чего тут нет, — повод посмотреть руками.
 */
const REVIEWED = new Set([
  "messages.common.appName",
  "messages.common.loading",
  "messages.locale.ru",
  "messages.locale.ky",
  "messages.locale.en",
  "messages.nav.rating",
  "messages.nav.profile",
  "messages.rating.title",
  "messages.profile.title",
  "messages.profile.categories.career",
  "messages.phone.tabs.budget",
  "messages.phone.tabs.profile",
  "messages.phone.demo.name",
  "messages.pages.rating.title",
  "messages.pages.profile.title",
  "messages.auth.fields.email",
  "messages.auth.fields.emailPlaceholder",
  "messages.auth.fields.namePlaceholder",
  "messages.finale.subtitle",
  "messages.sharePage.metaTitle",
  "messages.sharePage.nameAge",
  "messages.sharePage.byline",
  "messages.about.back",
]);

type Finding = { path: string; kind: string; detail: string };
const findings: Finding[] = [];
const add = (path: string, kind: string, detail: string) => {
  if (!REVIEWED.has(path)) findings.push({ path, kind, detail });
};

function inspect({ en, ru, ky }: Localized, path: string): void {
  for (const [name, val] of Object.entries({ en, ru, ky })) {
    if (val.trim() === "") add(path, `пустой ${name}`, "");
  }
  if (!hasLetters(en) && !hasLetters(ru) && !hasLetters(ky)) return;

  if (en === ru) add(path, "en === ru", en);
  if (en === ky) add(path, "en === ky", en);
  if (ru === ky) add(path, "ru === ky", ru);
  if (CYRILLIC.test(en)) add(path, "кириллица в en", en);
}

function walk(value: unknown, path: string): void {
  if (isLocalized(value)) {
    inspect(value, path);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => walk(v, `${path}[${i}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}.${k}` : k);
  }
}

const modules: Array<[string, Record<string, unknown>]> = [
  ["events", { ALL_EVENTS }],
  ["cards", cards],
  ["characters", characters],
  ["endings", endings],
  ["seasons", seasons],
  ["goals", goals],
  ["epilogue", epilogue],
];

for (const [name, mod] of modules) {
  for (const [exportName, value] of Object.entries(mod)) {
    if (typeof value === "function") continue;
    walk(value, `${name}.${exportName}`);
  }
}

const flat = (o: unknown, prefix = ""): Array<[string, string]> => {
  if (typeof o === "string") return [[prefix, o]];
  if (!o || typeof o !== "object") return [];
  return Object.entries(o).flatMap(([k, v]) => flat(v, prefix ? `${prefix}.${k}` : k));
};
const ruMap = new Map(flat(ruMessages));
const kyMap = new Map(flat(kyMessages));
for (const [key, en] of flat(enMessages)) {
  inspect({ en, ru: ruMap.get(key) ?? "", ky: kyMap.get(key) ?? "" }, `messages.${key}`);
}

const byKind = new Map<string, Finding[]>();
for (const f of findings) {
  byKind.set(f.kind, [...(byKind.get(f.kind) ?? []), f]);
}
console.log(`Находок: ${findings.length}\n`);
for (const [kind, list] of [...byKind].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`### ${kind} — ${list.length}`);
  for (const f of list) console.log(`  ${f.path}\n    «${f.detail.slice(0, 140)}»`);
  console.log("");
}
process.exit(findings.length > 0 ? 1 : 0);
