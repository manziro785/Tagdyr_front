import {
  ArrowRight,
  Coins,
  Heart,
  Sparkles,
  User,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { HeroSlideshow } from "./HeroSlideshow";
import { PhoneScreen } from "./PhoneScreen";

const NAV_LINKS = [
  { label: "Как играть", href: "#how" },
  { label: "Истории", href: "#stories" },
];

const FEATURES: {
  icon: LucideIcon;
  color: string;
  label: string;
  filled?: boolean;
}[] = [
  {
    icon: Coins,
    color: "var(--color-tg-amber-deep)",
    label: "Финграмотность в механике",
  },
  {
    icon: User,
    color: "var(--color-tg-sage-deep)",
    label: "До 3 параллельных жизней",
  },
  {
    icon: Heart,
    color: "var(--color-tg-terra-deep)",
    label: "4 стата, без перегруза",
    filled: true,
  },
];

function FloatCard({
  icon: Icon,
  color,
  tint,
  title,
  sub,
  className,
  filled,
}: {
  icon: LucideIcon;
  color: string;
  tint: string;
  title: string;
  sub: string;
  className?: string;
  filled?: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute flex items-center gap-[10px] rounded-2xl border border-white/80 bg-[rgba(251,245,234,0.92)] px-[14px] py-[11px] shadow-[0_14px_34px_rgba(74,42,16,0.2)]",
        className,
      )}
    >
      <span
        className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px]"
        style={{ background: tint, color }}
      >
        <Icon
          size={17}
          strokeWidth={2.2}
          fill={filled ? "currentColor" : "none"}
        />
      </span>
      <span>
        <span className="block text-[13px] font-extrabold text-tg-brown">
          {title}
        </span>
        <span className="text-[11px] font-bold text-tg-muted">{sub}</span>
      </span>
    </div>
  );
}

export default function HeroDesktop() {
  return (
    <section className="relative isolate hidden min-h-dvh w-full flex-col overflow-hidden font-sans text-tg-brown lg:flex">
      <HeroSlideshow />

      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-5">
        <span className="font-display text-[26px] font-bold tracking-[-0.5px] text-tg-brown">
          Тагдыр
        </span>
        <div className="flex items-center gap-2.5">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-tg-brown-2 transition-colors hover:bg-white/40"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/auth/login"
            className="rounded-xl border border-white/80 bg-white/60 px-5 py-2.5 font-display text-[15px] font-bold text-tg-brown shadow-[0_4px_12px_rgba(120,80,40,0.08)] transition-colors hover:bg-white/80"
          >
            Войти
          </Link>
        </div>
      </nav>

      <div className="relative z-[1] mx-auto grid w-full max-w-7xl flex-1 grid-cols-[1.05fr_0.95fr] content-center items-center gap-8 px-8 pt-10 pb-20">
        <div className="flex max-w-xl flex-col gap-[22px]">
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-white/70 bg-white/55 px-3.5 py-[7px] font-display text-[12px] font-bold tracking-[1px] text-tg-terra-deep uppercase">
            <Sparkles size={12} fill="currentColor" strokeWidth={0} />
            Игра-симулятор жизни про Кыргызстан
          </span>

          <h1 className="m-0 font-display text-[58px] leading-[1.04] font-bold tracking-[-1.4px] text-balance text-tg-brown [text-shadow:0_2px_20px_rgba(250,240,224,0.5)]">
            Маленькие выборы
            <br />
            складываются в{" "}
            <em className="text-tg-terra-deep not-italic">судьбу</em>
          </h1>

          <p className="m-0 max-w-[460px] text-[19px] leading-[1.55] font-medium text-pretty text-tg-brown-2">
            От выпускника до взрослого — карточка за карточкой. Той у родни,
            первая зарплата, долг под проценты. Кудай буюрса, доживёшь до своей
            истории.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[linear-gradient(180deg,#EFBE63,#E2A03A)] px-6 py-[15px] font-display text-base font-bold text-[#5A3F1C] shadow-[0_10px_24px_rgba(214,160,60,0.36)] transition-transform hover:-translate-y-px"
            >
              <ArrowRight size={18} strokeWidth={2.6} /> Начать жизнь
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-white/80 bg-white/60 px-6 py-[15px] font-display text-base font-bold text-tg-brown shadow-[0_4px_12px_rgba(120,80,40,0.08)] transition-colors hover:bg-white/80"
            >
              Войти в сохранение
            </Link>
          </div>

          <ul className="mt-1 flex flex-wrap gap-x-[22px] gap-y-2.5">
            {FEATURES.map(({ icon: Icon, color, label, filled }) => (
              <li
                key={label}
                className="flex items-center gap-2.5 text-[13.5px] font-bold text-tg-brown-2"
              >
                <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[10px] bg-white/60">
                  <Icon
                    size={16}
                    strokeWidth={2.2}
                    fill={filled ? "currentColor" : "none"}
                    style={{ color }}
                  />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex h-full items-center justify-center">
          <div className="relative w-[330px] rounded-[46px] bg-[linear-gradient(160deg,#3C2C22,#5A4433)] p-[11px] shadow-[0_40px_90px_rgba(60,30,12,0.42),inset_0_0_0_2px_rgba(255,255,255,0.06)]">
            <FloatCard
              icon={Coins}
              color="var(--color-tg-amber-deep)"
              tint="var(--color-tg-amber-tint)"
              title="+5 000 с"
              sub="первая зарплата"
              className="top-[88px] left-[-44px] z-10"
            />
            <FloatCard
              icon={Heart}
              color="var(--color-tg-rose-deep)"
              tint="var(--color-tg-rose-tint)"
              title="Отношения ↑"
              sub="не пожадничал на той"
              filled
              className="right-[-48px] bottom-[120px] z-10"
            />

            <div className="relative aspect-[390/844] overflow-hidden rounded-[36px] bg-[#ECDDC2]">
              <span className="absolute top-[11px] left-1/2 z-[5] h-[26px] w-[118px] -translate-x-1/2 rounded-b-2xl bg-[#3C2C22]" />
              <div className="absolute top-0 left-0 origin-top-left scale-[0.7897]">
                <PhoneScreen />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
