import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  Coins,
  Quote,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";

import { ENDINGS } from "@/entities/game/content/endings";

/** Концовки, которые показываем на лендинге как «истории». */
const STORY_CODES = ["entrepreneur", "support", "mountain_soul"] as const;

const STEPS = [
  {
    icon: UserRound,
    color: "var(--color-tg-sage-deep)",
    tint: "var(--color-tg-sage-tint)",
    title: "Выбери, где начать",
    text: "Двор в Бишкеке, село в Нарыне или центр города. У каждого старта свои деньги, характер и свои соблазны.",
  },
  {
    icon: CalendarClock,
    color: "var(--color-tg-amber-deep)",
    tint: "var(--color-tg-amber-tint)",
    title: "Живи карточка за карточкой",
    text: "Пять сезонов — от 17 лет до зрелости. Той у родни, первая зарплата, долг под проценты: каждый выбор двигает деньги, энергию, настроение и отношения.",
  },
  {
    icon: Sparkles,
    color: "var(--color-tg-terra-deep)",
    tint: "var(--color-tg-terra-tint)",
    title: "Доживи до своей концовки",
    text: `${ENDINGS.length} судеб — от «Предпринимателя» до «Души гор». Между сезонами годы летят: накопления тихо растут, а долги не спят.`,
  },
] as const;

/**
 * Секции лендинга под героем: «Как играть» и «Истории» (якоря из шапки).
 * Истории — реальные концовки из контента игры, не выдуманные отзывы.
 */
export function LandingSections() {
  const stories = STORY_CODES.map((code) =>
    ENDINGS.find((e) => e.code === code),
  ).filter((e): e is (typeof ENDINGS)[number] => Boolean(e));

  return (
    <div className="bg-tg-cream font-sans text-tg-brown">
      {/* как играть */}
      <section id="how" className="mx-auto w-full max-w-6xl scroll-mt-8 px-6 py-16 lg:px-8 lg:py-20">
        <span className="font-display text-[12px] font-bold tracking-[1px] text-tg-amber-deep uppercase">
          Как играть
        </span>
        <h2 className="mt-2 mb-8 max-w-xl font-display text-[30px] leading-[1.12] font-bold tracking-[-0.6px] text-balance lg:text-[38px]">
          Три шага от выпускника до своей истории
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, color, tint, title, text }, i) => (
            <div
              key={title}
              className="flex flex-col gap-3 rounded-3xl border border-tg-line-soft bg-tg-card p-6 shadow-[0_6px_20px_rgba(110,70,30,0.05)]"
            >
              <div className="flex items-center justify-between">
                <span
                  className="flex size-11 items-center justify-center rounded-2xl"
                  style={{ background: tint, color }}
                >
                  <Icon size={22} strokeWidth={2.2} />
                </span>
                <span className="font-display text-[13px] font-bold text-tg-faint">
                  0{i + 1}
                </span>
              </div>
              <h3 className="m-0 font-display text-[18px] font-bold text-tg-brown">
                {title}
              </h3>
              <p className="m-0 text-[14px] leading-[1.6] font-medium text-tg-brown-2">
                {text}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] font-bold text-tg-muted">
          <span className="inline-flex items-center gap-1.5">
            <Coins size={14} strokeWidth={2.2} className="text-tg-amber-deep" />
            Финграмотность зашита в механику, не в нотации
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen size={14} strokeWidth={2.2} className="text-tg-sage-deep" />
            13 карточек знаний спрятаны в выборах
          </span>
        </div>
      </section>

      {/* истории */}
      <section id="stories" className="mx-auto w-full max-w-6xl scroll-mt-8 px-6 pb-16 lg:px-8 lg:pb-20">
        <span className="font-display text-[12px] font-bold tracking-[1px] text-tg-terra-deep uppercase">
          Истории
        </span>
        <h2 className="mt-2 mb-8 max-w-xl font-display text-[30px] leading-[1.12] font-bold tracking-[-0.6px] text-balance lg:text-[38px]">
          Одни и те же улицы — разные судьбы
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {stories.map((ending) => (
            <figure
              key={ending.code}
              className="m-0 flex flex-col gap-3 rounded-3xl border border-tg-line-soft bg-tg-card-2 p-6 shadow-[0_6px_20px_rgba(110,70,30,0.05)]"
            >
              <Quote size={26} className="fill-tg-amber stroke-none opacity-50" />
              <blockquote className="m-0 flex-1 text-[14.5px] leading-[1.65] font-medium text-tg-brown-2">
                {ending.description}
              </blockquote>
              <figcaption className="flex items-center gap-2">
                <span className="rounded-full bg-tg-amber-tint px-2.5 py-1 text-[11px] font-extrabold tracking-[0.4px] text-tg-amber-deep uppercase">
                  {ending.archetype}
                </span>
                <span className="font-display text-[15px] font-bold text-tg-brown">
                  «{ending.title}»
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 rounded-[28px] border border-white/70 bg-[linear-gradient(120deg,#F7E6C6,#F4DDCF)] px-6 py-10 text-center">
          <h3 className="m-0 font-display text-[24px] font-bold tracking-[-0.4px] text-tg-brown lg:text-[28px]">
            А какая судьба выпадет тебе?
          </h3>
          <p className="m-0 max-w-md text-[14.5px] leading-[1.6] font-medium text-tg-brown-2">
            До трёх параллельных жизней — проверь, как сложилось бы, если бы
            тогда решил иначе. Кудай буюрса.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[linear-gradient(180deg,#EFBE63,#E2A03A)] px-7 py-[15px] font-display text-base font-bold text-[#5A3F1C] shadow-[0_10px_24px_rgba(214,160,60,0.36)] transition-transform hover:-translate-y-px"
          >
            <ArrowRight size={18} strokeWidth={2.6} /> Начать жизнь
          </Link>
        </div>
      </section>

      {/* футер */}
      <footer className="border-t border-tg-line-soft">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-[13px] font-semibold text-tg-muted sm:flex-row lg:px-8">
          <span className="font-display text-[16px] font-bold text-tg-brown">
            Тагдыр
          </span>
          <span>Игра про выборы, деньги и жизнь в Кыргызстане</span>
          <span className="flex gap-4">
            <Link href="/about" className="hover:text-tg-brown">
              О проекте
            </Link>
            <Link href="/auth/login" className="hover:text-tg-brown">
              Войти
            </Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
