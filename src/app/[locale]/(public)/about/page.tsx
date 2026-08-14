import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, BookOpen, Coins, Heart, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";

import { SessionAwareLink } from "@/features/auth/ui/SessionAwareLink";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.about" });
  return { title: t("title") };
}

const POINTS = [
  {
    icon: Coins,
    color: "var(--color-tg-amber-deep)",
    tint: "var(--color-tg-amber-tint)",
    key: "card1",
  },
  {
    icon: Heart,
    color: "var(--color-tg-rose-deep)",
    tint: "var(--color-tg-rose-tint)",
    key: "card2",
  },
  {
    icon: Users,
    color: "var(--color-tg-sage-deep)",
    tint: "var(--color-tg-sage-tint)",
    key: "card3",
  },
  {
    icon: BookOpen,
    color: "var(--color-tg-terra-deep)",
    tint: "var(--color-tg-terra-tint)",
    key: "card4",
  },
] as const;

export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // включает статический рендер страницы под каждую локаль
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "about" });
  const tl = await getTranslations({ locale, namespace: "landing" });
  const tc = await getTranslations({ locale, namespace: "common" });
  return (
    <main className="min-h-dvh bg-tg-cream font-sans text-tg-brown">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-14">
        <div>
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-[-0.5px] text-tg-brown/70 transition-colors hover:text-tg-brown"
          >
            {t("back")}
          </Link>
          <h1 className="mt-4 mb-0 font-display text-[34px] leading-[1.1] font-bold tracking-[-0.7px] text-balance lg:text-[42px]">
            {t("tagline")}
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-[1.65] font-medium text-tg-brown-2">
            {t("intro")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {POINTS.map(({ icon: Icon, color, tint, key }) => (
            <div
              key={key}
              className="flex flex-col gap-2.5 rounded-3xl border border-tg-line-soft bg-tg-card p-5"
            >
              <span
                className="flex size-10 items-center justify-center rounded-xl"
                style={{ background: tint, color }}
              >
                <Icon size={20} strokeWidth={2.2} />
              </span>
              <h2 className="m-0 font-display text-[16.5px] font-bold">
                {t(`${key}Title`)}
              </h2>
              <p className="m-0 text-[13.5px] leading-[1.6] font-medium text-tg-brown-2">
                {t(`${key}Text`)}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SessionAwareLink
            guestHref="/auth/register"
            userHref="/lives"
            userLabel={
              <>
                <ArrowRight size={17} strokeWidth={2.6} /> {tl("continueLife")}
              </>
            }
            className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[linear-gradient(180deg,#EFBE63,#E2A03A)] px-6 py-[14px] font-display text-[15px] font-bold text-[#5A3F1C] shadow-[0_10px_24px_rgba(214,160,60,0.36)] transition-transform hover:-translate-y-px"
          >
            <ArrowRight size={17} strokeWidth={2.6} /> {tl("startLife")}
          </SessionAwareLink>
          <SessionAwareLink
            guestHref="/auth/login"
            userHref="/lives"
            userLabel={tc("myLives")}
            className="inline-flex items-center justify-center rounded-2xl border border-tg-line bg-tg-card-2 px-6 py-[14px] font-display text-[15px] font-bold text-tg-brown transition-colors hover:bg-white"
          >
            {tl("signInSaved")}
          </SessionAwareLink>
        </div>

        <p className="m-0 text-[13px] font-semibold text-tg-muted">
          {t("footer")}
        </p>
      </div>
    </main>
  );
}
