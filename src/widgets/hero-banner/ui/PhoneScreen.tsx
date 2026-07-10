import {
  Calculator,
  Home,
  MapPin,
  Quote,
  Settings,
  Trophy,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { SCENE, type SceneChoice, type SceneStat } from "../model/scene";
import { Avatar } from "./Avatar";

function StatusBar() {
  return (
    <div className="flex h-11 shrink-0 items-center justify-between px-[22px] text-[14px] font-extrabold text-tg-brown tabular-nums">
      <span>9:41</span>
      <span className="flex items-center gap-[7px]">
        <svg
          width="18"
          height="12"
          viewBox="0 0 18 12"
          fill="currentColor"
          aria-hidden
        >
          <rect x="0" y="7" width="3" height="5" rx="1" />
          <rect x="5" y="4.5" width="3" height="7.5" rx="1" />
          <rect x="10" y="2" width="3" height="10" rx="1" />
          <rect x="15" y="2" width="3" height="10" rx="1" opacity="0.35" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden>
          <rect
            x="0.6"
            y="0.6"
            width="20"
            height="10.8"
            rx="3"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.5"
          />
          <rect
            x="2"
            y="2"
            width="15"
            height="8"
            rx="1.6"
            fill="currentColor"
          />
          <rect
            x="22"
            y="3.6"
            width="1.8"
            height="4.8"
            rx="0.9"
            fill="currentColor"
            opacity="0.6"
          />
        </svg>
      </span>
    </div>
  );
}

function StatMini({ stat }: { stat: SceneStat }) {
  const Icon = stat.icon;
  return (
    <div className="flex flex-col items-center gap-[5px]">
      <Icon
        size={16}
        strokeWidth={2.2}
        fill={stat.filled ? "currentColor" : "none"}
        style={{ color: stat.color }}
      />
      <span className="font-display text-[15px] leading-none font-bold text-tg-brown">
        {stat.value}
      </span>
      <span className="h-[5px] w-full overflow-hidden rounded bg-tg-track">
        <i
          className="block h-full rounded"
          style={{ width: `${stat.pct}%`, background: stat.color }}
        />
      </span>
      <span className="text-[9.5px] font-bold tracking-[0.1px] text-tg-muted">
        {stat.label}
      </span>
    </div>
  );
}

function Choice({ choice }: { choice: SceneChoice }) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between gap-[10px] rounded-2xl px-[15px] py-3 text-left",
        "transition-transform duration-100 hover:-translate-y-px",
        choice.primary
          ? "border-[1.5px] border-[#E0AE55] bg-[linear-gradient(180deg,#F4D99C_0%,#ECC069_100%)] shadow-[0_4px_12px_rgba(214,160,60,0.22)]"
          : "border-[1.5px] border-tg-line bg-tg-card shadow-[0_1px_2px_rgba(120,80,40,0.05)]",
      )}
    >
      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            "text-[14.5px] leading-tight font-extrabold",
            choice.primary ? "text-[#5A3F1C]" : "text-tg-brown",
          )}
        >
          {choice.text}
        </span>
        <span className="mt-[5px] flex flex-wrap gap-[7px]">
          {choice.deltas.map((d, i) => (
            <span
              key={i}
              className={cn(
                "text-[11.5px] font-bold",
                d.dir === "up" ? "text-tg-sage-deep" : "text-tg-terracotta",
              )}
            >
              {d.dir === "up" ? "↑" : "↓"} {d.text}
            </span>
          ))}
        </span>
      </span>
      {choice.chance && (
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-tg-terra-tint px-[9px] py-[5px] text-[11.5px] font-extrabold text-tg-terracotta">
          Шанс {choice.chance}%
        </span>
      )}
    </button>
  );
}

function BottomNav() {
  const items = [
    { id: "play", label: "Игра", icon: Home, active: true },
    { id: "lives", label: "Жизни", icon: User, active: false },
    { id: "budget", label: "Бюджет", icon: Calculator, active: false },
    { id: "profile", label: "Профиль", icon: Trophy, active: false },
  ];
  return (
    <nav className="mt-auto flex h-[60px] shrink-0 items-center justify-around border-t border-tg-line-soft bg-tg-card-2">
      {items.map(({ id, label, icon: Icon, active }) => (
        <button
          key={id}
          type="button"
          className={cn(
            "flex flex-col items-center gap-[3px]",
            active ? "text-tg-amber-deep" : "text-tg-faint",
          )}
        >
          <Icon size={21} strokeWidth={2} />
          <span className="text-[9.5px] font-extrabold tracking-[0.1px]">
            {label}
          </span>
        </button>
      ))}
    </nav>
  );
}

export function PhoneScreen() {
  return (
    <div className="relative flex h-[844px] w-[390px] flex-col bg-[#ECDDC2] text-tg-brown antialiased">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/tagdyr/bg-campus.png"
          alt=""
          className="absolute -inset-[7%] size-[114%] scale-[1.03] object-cover blur-[7px] saturate-[1.04] brightness-[1.02]"
        />
        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(245,235,221,0.34)_0%,rgba(244,233,216,0.28)_34%,rgba(243,229,208,0.6)_74%,rgba(238,222,198,0.86)_100%)]" />
      </div>

      <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
        <StatusBar />

        <div className="flex items-center gap-3 px-[18px] pt-1 pb-3">
          <Avatar size={62} breathe />
          <div className="min-w-0 flex-1">
            <div className="font-display text-[18px] font-bold tracking-[-0.2px] text-tg-brown">
              {SCENE.name}, {SCENE.age}
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-[12px] font-bold text-tg-muted">
              <MapPin size={12} strokeWidth={2.2} /> {SCENE.place} ·{" "}
              {SCENE.stage}
            </div>
          </div>
          <button
            type="button"
            className="flex size-[38px] shrink-0 items-center justify-center rounded-xl border border-tg-line bg-white/45 text-tg-brown"
          >
            <Settings size={17} strokeWidth={2} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 px-[18px]">
          {SCENE.stats.map((s) => (
            <StatMini key={s.key} stat={s} />
          ))}
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 px-[18px] pt-[14px] pb-4">
          <div className="relative rounded-[18px] border border-white/70 bg-[rgba(252,247,238,0.82)] p-4 shadow-[0_10px_28px_rgba(80,45,18,0.16)] backdrop-blur-[8px]">
            <Quote
              size={26}
              className="mb-1.5 text-tg-amber/50"
              fill="currentColor"
              strokeWidth={0}
            />
            <div className="mb-1.5 font-display text-[11px] font-bold tracking-[0.6px] text-tg-amber-deep uppercase">
              {SCENE.event.kicker}
            </div>
            <p className="m-0 text-[15px] leading-[1.55] font-medium text-tg-brown-2 text-pretty">
              {SCENE.event.text}
            </p>
          </div>

          <div className="flex flex-col gap-[9px]">
            {SCENE.choices.map((c, i) => (
              <Choice key={i} choice={c} />
            ))}
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
