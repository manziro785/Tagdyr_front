"use client";

import { GitCompareArrows, Home, Trophy, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/lives", label: "Жизни", icon: User },
  { href: "/play", label: "Игра", icon: Home },
  { href: "/compare", label: "Сравнить", icon: GitCompareArrows },
  { href: "/profile", label: "Профиль", icon: Trophy },
] as const;

export function BottomNav({ playHref = "/lives" }: { playHref?: string }) {
  const pathname = usePathname() ?? "";
  return (
    <nav className="sticky bottom-0 z-20 mt-auto flex h-[60px] shrink-0 items-center justify-around border-t border-tg-line-soft bg-tg-card-2 lg:hidden">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const target = href === "/play" ? playHref : href;
        const active =
          href === "/play"
            ? pathname.startsWith("/play")
            : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={target}
            className={cn(
              "flex flex-col items-center gap-[3px] text-tg-faint",
              active && "text-tg-amber-deep",
            )}
          >
            <Icon size={21} strokeWidth={2} />
            <span className="text-[9.5px] font-extrabold tracking-[0.1px]">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
