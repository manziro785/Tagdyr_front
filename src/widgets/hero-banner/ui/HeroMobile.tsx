import {
  ArrowRight,
  Coins,
  Heart,
  Sparkles,
  User,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar } from "./Avatar";
import { SessionAwareLink } from "@/features/auth/ui/SessionAwareLink";
import { HeroSlideshow } from "./HeroSlideshow";
import { LocaleSwitcher } from "@/features/locale/ui/LocaleSwitcher";

const CHIPLETS: {
  icon: LucideIcon;
  color: string;
  key: string;
  filled?: boolean;
}[] = [
  { icon: Coins, color: "var(--color-tg-amber-deep)", key: "financeShort" },
  { icon: User, color: "var(--color-tg-sage-deep)", key: "livesShort" },
  {
    icon: Heart,
    color: "var(--color-tg-rose-deep)",
    key: "statsShort",
    filled: true,
  },
];

export default function HeroMobile() {
  const t = useTranslations("landing");
  const tc = useTranslations("common");
  return (
    <section className="relative flex min-h-[88svh] flex-col overflow-hidden font-sans text-tg-brown lg:hidden">
      <HeroSlideshow />

      <div className="relative z-[2] flex items-center justify-between px-[22px] pt-4">
        <span className="font-display text-[22px] font-bold tracking-[-0.5px] text-tg-brown">
          {tc("appName")}
        </span>
        <div className="flex items-center gap-2">
        <LocaleSwitcher />
        <SessionAwareLink
          guestHref="/auth/login"
          userHref="/lives"
          userLabel={tc("myLives")}
          className="rounded-xl border border-white/80 bg-white/60 px-4 py-2 font-display text-[13.5px] font-bold text-tg-brown shadow-[0_4px_12px_rgba(120,80,40,0.08)]"
        >
          {t("signIn")}
        </SessionAwareLink>
        </div>
      </div>

      <div className="pointer-events-none absolute top-[120px] left-1/2 z-[1] -translate-x-1/2">
        <Avatar size={104} breathe ring />
      </div>

      <div className="relative z-[2] mt-auto flex flex-col gap-[18px] px-6 pt-6 pb-8">
        <span className="inline-flex items-center gap-2 self-start rounded-full border border-white/70 bg-white/55 px-3.5 py-[7px] font-display text-[11px] font-bold tracking-[0.6px] text-tg-terra-deep uppercase">
          <Sparkles size={11} fill="currentColor" strokeWidth={0} />
          {t("badgeMobile")}
        </span>

        <h1 className="m-0 font-display text-[34px] leading-[1.08] font-bold tracking-[-0.8px] text-balance break-words text-tg-brown [text-shadow:0_2px_16px_rgba(250,240,224,0.6)] min-[420px]:text-[40px]">
          {t("headlineMobile")}{" "}
          <em className="text-tg-terra-deep not-italic">
            {t("headlineMobileAccent")}
          </em>
        </h1>

        <p className="m-0 text-base leading-[1.5] font-medium text-pretty text-tg-brown-2">
          {t("leadMobile")}
        </p>

        <div className="flex gap-2">
          {CHIPLETS.map(({ icon: Icon, color, key, filled }) => (
            <div
              key={key}
              className="flex flex-1 flex-col items-center gap-[5px] rounded-[15px] border border-white/65 bg-white/50 px-1.5 py-[11px]"
            >
              <Icon
                size={18}
                strokeWidth={2.2}
                fill={filled ? "currentColor" : "none"}
                style={{ color }}
              />
              <span className="text-[10.5px] font-extrabold text-tg-brown">
                {t(`features.${key}`)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-[11px]">
          <SessionAwareLink
            guestHref="/auth/register"
            userHref="/lives"
            userLabel={
              <>
                <ArrowRight size={18} strokeWidth={2.6} /> {t("continueLife")}
              </>
            }
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[linear-gradient(180deg,#EFBE63,#E2A03A)] px-6 py-[15px] font-display text-base font-bold text-[#5A3F1C] shadow-[0_8px_20px_rgba(214,160,60,0.34)]"
          >
            <ArrowRight size={18} strokeWidth={2.6} /> {t("startLife")}
          </SessionAwareLink>
          <SessionAwareLink
            guestHref="/auth/login"
            userHref="/lives"
            userLabel={t("myLivesArrow")}
            className="p-1.5 text-center font-display text-[13.5px] font-extrabold text-tg-brown-2"
          >
            {t("playedBefore")}
          </SessionAwareLink>
        </div>
      </div>
    </section>
  );
}
