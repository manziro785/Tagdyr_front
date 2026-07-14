import Link from "next/link";

import { SCENE_SRC } from "@/entities/game/ui/SceneBackground";
import type { SeasonMeta } from "@/entities/game/model/types";

/**
 * Десктоп-каркас игровых экранов-«колонок» (жизни, профиль, сравнение,
 * межсезонье). На мобильных не делает ничего — отдаёт детей как есть.
 * На lg+ рисует сцену на весь экран, шапку с логотипом и подаёт колонку
 * как карточку-«телефон» с внутренним скроллом.
 *
 * Требование к ребёнку: корень с min-h-dvh должен иметь lg:min-h-full,
 * чтобы заполнять карточку, а не вьюпорт.
 */
export function GameFrame({
  scene = "valley",
  children,
}: {
  scene?: SeasonMeta["scene"];
  children: React.ReactNode;
}) {
  return (
    <div className="lg:relative">
      {/* сцена: fixed, чтобы покрывать вьюпорт целиком без «обрезки» справа */}
      <div aria-hidden className="fixed inset-0 hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SCENE_SRC[scene]}
          alt=""
          className="size-full object-cover"
        />
        <span className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(250,242,228,0.30)_0%,rgba(250,242,228,0)_60%),linear-gradient(180deg,rgba(245,235,221,0.30)_0%,rgba(244,233,216,0.24)_40%,rgba(243,229,208,0.55)_80%,rgba(238,222,198,0.85)_100%)]" />
      </div>

      <header className="fixed inset-x-0 top-0 z-10 hidden items-center justify-between px-9 py-5 lg:flex">
        <Link
          href="/"
          className="font-display text-[24px] font-bold tracking-[-0.5px] text-tg-brown transition-opacity hover:opacity-80"
        >
          Тагдыр
        </Link>
        <span className="rounded-full border border-white/70 bg-white/50 px-4 py-2 text-[12.5px] font-bold text-tg-brown-2">
          Маленькие выборы складываются в судьбу
        </span>
      </header>

      <div className="relative lg:flex lg:min-h-dvh lg:items-center lg:justify-center lg:px-8 lg:py-[76px]">
        <div className="lg:h-[min(880px,calc(100dvh-9rem))] lg:w-[434px] lg:overflow-hidden lg:rounded-[38px] lg:border lg:border-white/75 lg:shadow-[0_48px_110px_rgba(60,30,12,0.35),0_0_0_10px_rgba(255,255,255,0.16)]">
          <div className="lg:h-full lg:overflow-y-auto lg:[scrollbar-color:rgba(156,130,104,0.35)_transparent] lg:[scrollbar-width:thin]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
