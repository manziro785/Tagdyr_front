import { useTranslations } from "next-intl";

import { SCENE_SRC } from "@/entities/game/ui/SceneBackground";
import type { SceneName } from "@/entities/game/model/types";
import { GameTopNav } from "./GameTopNav";
import { Link } from "@/i18n/navigation";

/**
 * Десктоп-каркас игровых экранов. На мобильных не делает ничего — отдаёт
 * детей как есть (колонка + BottomNav). На lg+ рисует сцену на весь экран,
 * шапку с логотипом и навигацией, а контент кладёт широкой колонкой
 * с обычным скроллом страницы — без «телефона в рамке».
 *
 * Требования к ребёнку на lg: корень с min-h-dvh/max-w-[430px]/градиентом
 * должен снимать их через lg:-классы (см. LivesScreen).
 */
export function GameFrame({
  scene = "valley",
  children,
}: {
  scene?: SceneName;
  children: React.ReactNode;
}) {
  const t = useTranslations("common");
  return (
    <div className="lg:relative lg:min-h-dvh">
      {/* сцена: fixed, чтобы покрывать вьюпорт целиком при любой высоте контента */}
      <div aria-hidden className="fixed inset-0 hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SCENE_SRC[scene]} alt="" className="size-full object-cover" />
        <span className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(250,242,228,0.30)_0%,rgba(250,242,228,0)_60%),linear-gradient(180deg,rgba(245,235,221,0.30)_0%,rgba(244,233,216,0.24)_40%,rgba(243,229,208,0.55)_80%,rgba(238,222,198,0.85)_100%)]" />
      </div>

      <header className="relative z-10 mx-auto hidden w-full max-w-[1140px] items-center justify-between px-8 pt-5 pb-2 lg:flex">
        <Link
          href="/"
          className="font-display text-[24px] font-bold tracking-[-0.5px] text-tg-brown transition-opacity hover:opacity-80"
        >
          {t("appName")}
        </Link>
        <GameTopNav />
      </header>

      <div className="relative lg:mx-auto lg:w-full lg:max-w-[1140px] lg:px-8 lg:pt-4 lg:pb-14">
        {children}
      </div>
    </div>
  );
}
