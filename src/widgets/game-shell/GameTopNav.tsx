"use client";

import { GitCompareArrows, Home, LogOut, Trophy, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useLives } from "@/entities/game/api";
import { useAuthStore } from "@/entities/session/model/auth-store";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/lives", label: "Жизни", icon: User },
  { href: "/play", label: "Игра", icon: Home },
  { href: "/compare", label: "Сравнить", icon: GitCompareArrows },
  { href: "/profile", label: "Профиль", icon: Trophy },
] as const;

/** Верхняя навигация игровых экранов на десктопе (на мобиле — BottomNav). */
export function GameTopNav() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const signOut = useAuthStore((s) => s.signOut);
  const { data: lives } = useLives();

  const active = (lives ?? []).filter((l) => l.status !== "archived");
  const playHref = active.length > 0 ? `/play/${active[0]!.id}` : "/lives";

  return (
    <div className="flex items-center gap-2.5">
      <nav className="flex items-center gap-1 rounded-2xl border border-white/70 bg-white/55 p-1 shadow-[0_4px_14px_rgba(120,80,40,0.08)] backdrop-blur-md">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const target = href === "/play" ? playHref : href;
          const isActive =
            href === "/play" ? pathname.startsWith("/play") : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={target}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-bold text-tg-brown-2 transition-colors hover:bg-white/70",
                isActive && "bg-white text-tg-amber-deep shadow-[0_2px_8px_rgba(120,80,40,0.1)]",
              )}
            >
              <Icon size={15} strokeWidth={2.2} />
              {label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={() => {
          signOut();
          router.replace("/");
        }}
        aria-label="Выйти"
        className="flex size-[38px] cursor-pointer items-center justify-center rounded-2xl border border-white/70 bg-white/55 text-tg-brown-2 shadow-[0_4px_14px_rgba(120,80,40,0.08)] backdrop-blur-md transition-colors hover:bg-white/80"
      >
        <LogOut size={16} strokeWidth={2.2} />
      </button>
    </div>
  );
}
