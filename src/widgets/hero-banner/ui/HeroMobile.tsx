import {
  ArrowRight,
  Coins,
  Heart,
  Sparkles,
  User,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { Avatar } from "./Avatar";
import { HeroSlideshow } from "./HeroSlideshow";

const CHIPLETS: {
  icon: LucideIcon;
  color: string;
  label: string;
  filled?: boolean;
}[] = [
  { icon: Coins, color: "var(--color-tg-amber-deep)", label: "Финграмотность" },
  { icon: User, color: "var(--color-tg-sage-deep)", label: "3 жизни" },
  {
    icon: Heart,
    color: "var(--color-tg-rose-deep)",
    label: "4 стата",
    filled: true,
  },
];

export default function HeroMobile() {
  return (
    <section className="relative flex min-h-[88svh] flex-col overflow-hidden font-sans text-tg-brown lg:hidden">
      <HeroSlideshow />

      <div className="relative z-[2] flex items-center justify-between px-[22px] pt-4">
        <span className="font-display text-[22px] font-bold tracking-[-0.5px] text-tg-brown">
          Тагдыр
        </span>
        <Link
          href="/auth/login"
          className="rounded-xl border border-white/80 bg-white/60 px-4 py-2 font-display text-[13.5px] font-bold text-tg-brown shadow-[0_4px_12px_rgba(120,80,40,0.08)]"
        >
          Войти
        </Link>
      </div>

      <div className="pointer-events-none absolute top-[120px] left-1/2 z-[1] -translate-x-1/2">
        <Avatar size={104} breathe ring />
      </div>

      <div className="relative z-[2] mt-auto flex flex-col gap-[18px] px-6 pt-6 pb-8">
        <span className="inline-flex items-center gap-2 self-start rounded-full border border-white/70 bg-white/55 px-3.5 py-[7px] font-display text-[11px] font-bold tracking-[0.6px] text-tg-terra-deep uppercase">
          <Sparkles size={11} fill="currentColor" strokeWidth={0} />
          Симулятор жизни · Кыргызстан
        </span>

        <h1 className="m-0 font-display text-[34px] leading-[1.08] font-bold tracking-[-0.8px] text-balance break-words text-tg-brown [text-shadow:0_2px_16px_rgba(250,240,224,0.6)] min-[420px]:text-[40px]">
          Маленькие выборы — твоя{" "}
          <em className="text-tg-terra-deep not-italic">судьба</em>
        </h1>

        <p className="m-0 text-base leading-[1.5] font-medium text-pretty text-tg-brown-2">
          От выпускника до взрослого. Решай карточками, расти, набивай шишки.
          Кудай буюрса.
        </p>

        <div className="flex gap-2">
          {CHIPLETS.map(({ icon: Icon, color, label, filled }) => (
            <div
              key={label}
              className="flex flex-1 flex-col items-center gap-[5px] rounded-[15px] border border-white/65 bg-white/50 px-1.5 py-[11px]"
            >
              <Icon
                size={18}
                strokeWidth={2.2}
                fill={filled ? "currentColor" : "none"}
                style={{ color }}
              />
              <span className="text-[10.5px] font-extrabold text-tg-brown">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-[11px]">
          <Link
            href="/auth/register"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[linear-gradient(180deg,#EFBE63,#E2A03A)] px-6 py-[15px] font-display text-base font-bold text-[#5A3F1C] shadow-[0_8px_20px_rgba(214,160,60,0.34)]"
          >
            <ArrowRight size={18} strokeWidth={2.6} /> Начать жизнь
          </Link>
          <Link
            href="/auth/login"
            className="p-1.5 text-center font-display text-[13.5px] font-extrabold text-tg-brown-2"
          >
            Уже играл? Войти →
          </Link>
        </div>
      </div>
    </section>
  );
}
