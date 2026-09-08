import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  Coins,
  Quote,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { SessionAwareLink } from "@/features/auth/ui/SessionAwareLink";

import { getEndings } from "@/entities/game/content/endings";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

/** Концовки, которые показываем на лендинге как «истории». */
const STORY_CODES = ["entrepreneur", "support", "mountain_soul"] as const;

const STEPS = [
  {
    icon: UserRound,
    color: "var(--color-tg-sage-deep)",
    tint: "var(--color-tg-sage-tint)",
    key: "step1",
  },
  {
    icon: CalendarClock,
    color: "var(--color-tg-amber-deep)",
    tint: "var(--color-tg-amber-tint)",
    key: "step2",
  },
  {
    icon: Sparkles,
    color: "var(--color-tg-terra-deep)",
    tint: "var(--color-tg-terra-tint)",
    key: "step3",
  },
] as const;

/**
 * Секции лендинга под героем: «Как играть» и «Истории» (якоря из шапки).
 * Истории — реальные концовки из контента игры, не выдуманные отзывы.
 */
export function LandingSections() {
  const t = useTranslations("landing.sections");
  const tl = useTranslations("landing");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const endings = getEndings(locale);
  const stories = STORY_CODES.map((code) =>
    endings.find((e) => e.code === code),
  ).filter((e): e is (typeof endings)[number] => Boolean(e));

  return (
    <div className="bg-tg-cream font-sans text-tg-brown">
      {/* как играть */}
      <section id="how" className="mx-auto w-full max-w-6xl scroll-mt-8 px-6 py-16 lg:px-8 lg:py-20">
        <span className="font-display text-[12px] font-bold tracking-[1px] text-tg-amber-deep uppercase">
          {t("howKicker")}
        </span>
        <h2 className="mt-2 mb-8 max-w-xl font-display text-[30px] leading-[1.12] font-bold tracking-[-0.6px] text-balance lg:text-[38px]">
          {t("howTitle")}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, color, tint, key }, i) => (
            <div
              key={key}
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
                {t(`${key}Title`)}
              </h3>
              <p className="m-0 text-[14px] leading-[1.6] font-medium text-tg-brown-2">
                {t(`${key}Text`, { count: endings.length })}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] font-bold text-tg-muted">
          <span className="inline-flex items-center gap-1.5">
            <Coins size={14} strokeWidth={2.2} className="text-tg-amber-deep" />
            {t("noteFinance")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen size={14} strokeWidth={2.2} className="text-tg-sage-deep" />
            {t("noteCards")}
          </span>
        </div>
      </section>

      {/* истории */}
      <section id="stories" className="mx-auto w-full max-w-6xl scroll-mt-8 px-6 pb-16 lg:px-8 lg:pb-20">
        <span className="font-display text-[12px] font-bold tracking-[1px] text-tg-terra-deep uppercase">
          {t("storiesKicker")}
        </span>
        <h2 className="mt-2 mb-8 max-w-xl font-display text-[30px] leading-[1.12] font-bold tracking-[-0.6px] text-balance lg:text-[38px]">
          {t("storiesTitle")}
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
            {t("ctaTitle")}
          </h3>
          <p className="m-0 max-w-md text-[14.5px] leading-[1.6] font-medium text-tg-brown-2">
            {t("ctaText")}
          </p>
          <SessionAwareLink
            guestHref="/auth/register"
            userHref="/lives"
            userLabel={
              <>
                <ArrowRight size={18} strokeWidth={2.6} /> {tl("continueLife")}
              </>
            }
            className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[linear-gradient(180deg,#EFBE63,#E2A03A)] px-7 py-[15px] font-display text-base font-bold text-[#5A3F1C] shadow-[0_10px_24px_rgba(214,160,60,0.36)] transition-transform hover:-translate-y-px"
          >
            <ArrowRight size={18} strokeWidth={2.6} /> {tl("startLife")}
          </SessionAwareLink>
        </div>
      </section>

      {/* футер */}
      <footer className="border-t border-tg-line-soft">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-[13px] font-semibold text-tg-muted sm:flex-row lg:px-8">
          <span className="font-display text-[16px] font-bold text-tg-brown">
            {tc("appName")}
          </span>
          <span>{t("footerTagline")}</span>
          <span className="flex gap-4">
            <Link href="/about" className="hover:text-tg-brown">
              {t("footerAbout")}
            </Link>
            <Link href="/auth/login" className="hover:text-tg-brown">
              {tl("signIn")}
            </Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
