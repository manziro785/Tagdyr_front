import type { SeasonMeta } from "../model/types";

const SCENE_SRC: Record<SeasonMeta["scene"], string> = {
  valley: "/tagdyr/bg-valley.png",
  campus: "/tagdyr/bg-campus.png",
  bazaar: "/tagdyr/bg-bazaar.svg",
  city: "/tagdyr/bg-city.svg",
  issykkul: "/tagdyr/bg-issykkul.svg",
};

/**
 * Заблюренный мультяшный фон сцены + тёплый кремовый скрим (по .tg-scenebg
 * из дизайн-макета). dim — тёмная вуаль для межсезонья/финала.
 */
export function SceneBackground({
  scene,
  dim = false,
}: {
  scene: SeasonMeta["scene"];
  dim?: boolean;
}) {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {/* обычный img: фон декоративный, next/image тут не даст ничего кроме хлопот с fill */}
      <img
        src={SCENE_SRC[scene]}
        alt=""
        className="absolute -inset-[7%] size-[114%] scale-[1.03] object-cover blur-[7px] saturate-[1.04] brightness-[1.02] transition-opacity duration-700"
      />
      <span
        className={
          dim
            ? "absolute inset-0 bg-[linear-gradient(180deg,rgba(58,40,26,0.30)_0%,rgba(58,40,26,0.14)_30%,rgba(58,40,26,0.42)_78%,rgba(46,30,18,0.66)_100%)]"
            : "absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(250,242,228,0.30)_0%,rgba(250,242,228,0)_60%),linear-gradient(180deg,rgba(245,235,221,0.34)_0%,rgba(244,233,216,0.28)_34%,rgba(243,229,208,0.60)_74%,rgba(238,222,198,0.86)_100%)]"
        }
      />
    </div>
  );
}
