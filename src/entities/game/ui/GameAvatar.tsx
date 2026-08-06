import { cn } from "@/lib/utils";

/**
 * Аватар персонажа: тёплое кольцо, «дыхание» и портрет-картинка, взрослеющий
 * с этапами (4 фото на персонажа). characterId выбирает облик (Айбек — калпак,
 * Марат — тюбетейка, Айжан — косы/платок), возраст — этап 1–4.
 * Файлы: public/tagdyr/avatars/<variant>-<stage>.png. Без id — базовый парень.
 */

type Variant = "aibek" | "marat" | "aizhan";

const VARIANT_BY_ID: Record<string, Variant> = {
  char_aibek: "aibek",
  char_marat: "marat",
  char_aizhan: "aizhan",
};

/** Возраст → индекс фото (1..4): юность / молодость / зрелость / старший. */
function stageForAge(age: number): 1 | 2 | 3 | 4 {
  if (age < 19) return 1;
  if (age < 23) return 2;
  if (age < 28) return 3;
  return 4;
}

export function GameAvatar({
  size = 96,
  age = 17,
  breathe = true,
  characterId,
  tag,
  className,
}: {
  size?: number;
  age?: number;
  /** @deprecated настроение теперь не влияет на портрет — мимика зашита в фото. */
  mood?: number;
  breathe?: boolean;
  characterId?: string;
  tag?: string;
  className?: string;
}) {
  const variant: Variant = VARIANT_BY_ID[characterId ?? ""] ?? "aibek";
  const stage = stageForAge(age);
  const src = `/tagdyr/avatars/${variant}-${stage}.png`;

  return (
    <div
      className={cn("relative flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <span className="absolute -inset-[24%] rounded-full bg-[radial-gradient(circle,rgba(230,162,60,0.42)_0%,rgba(230,162,60,0)_68%)]" />
      <div className="relative size-full rounded-full bg-[linear-gradient(155deg,#EEB85C,#E2A03A_60%,#D08F2C)] p-1 shadow-[0_6px_16px_rgba(160,110,40,0.28)]">
        <div
          className={cn(
            "relative flex size-full items-center justify-center overflow-hidden rounded-full bg-[#F6E7CD] shadow-[inset_0_2px_9px_rgba(74,55,42,0.13)]",
            breathe && "tg-breathe",
          )}
        >
          {/* обычный img: портрет декоративный и фиксированного размера — как в SceneBackground */}
          <img
            src={src}
            alt=""
            aria-hidden
            className="size-full object-cover"
            draggable={false}
          />
          {tag && size >= 72 && (
            <span className="absolute bottom-[7px] left-1/2 -translate-x-1/2 rounded-[5px] bg-white/60 px-[5px] py-px font-mono text-[7.5px] tracking-[0.3px] whitespace-nowrap text-[rgba(74,55,42,0.55)]">
              {tag}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
