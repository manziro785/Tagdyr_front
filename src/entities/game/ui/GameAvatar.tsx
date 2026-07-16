import { cn } from "@/lib/utils";

/**
 * Аватар персонажа: тёплое кольцо, «дыхание», флэт-портрет, взрослеющий
 * с этапами (усы/платок/седина), уголки рта — от настроения.
 * characterId выбирает облик: Айбек — белый калпак, Марат — тюбетейка,
 * Айжан — косы с такыей (в зрелости — платок). Без id — базовый парень.
 */

type Variant = "aibek" | "marat" | "aizhan";

const VARIANT_BY_ID: Record<string, Variant> = {
  char_aibek: "aibek",
  char_marat: "marat",
  char_aizhan: "aizhan",
};

/** Цвет одежды по этапу жизни: юность ярче, зрелость сдержаннее. */
const CLOTHES: Record<Variant, [string, string, string, string]> = {
  aibek: ["#C96F4A", "#7C9070", "#6B523F", "#5C4433"],
  marat: ["#8A5A38", "#5F7457", "#5C4433", "#4A372A"],
  aizhan: ["#C77E73", "#B06257", "#8A5A38", "#6B523F"],
};

function Kalpak() {
  return (
    <>
      {/* белый войлочный купол со швами */}
      <path d="M27 38 Q34 6 50 6 Q66 6 73 38 Z" fill="#FBF4E8" />
      <path d="M50 8 L44 36 M50 8 L56 36" stroke="#6B523F" strokeWidth="1.6" fill="none" opacity="0.55" />
      <path d="M38 14 q12 -6 24 0" stroke="#C96F4A" strokeWidth="1.8" fill="none" opacity="0.7" />
      {/* тёмный отворот */}
      <rect x="25" y="35" width="50" height="8" rx="4" fill="#4A372A" />
      <circle cx="50" cy="6" r="2.4" fill="#E2A03A" />
    </>
  );
}

function Tubeteika() {
  return (
    <>
      <path d="M29 35 Q50 14 71 35 Z" fill="#B05A38" />
      <rect x="28" y="33" width="44" height="7" rx="3.5" fill="#8A4A2C" />
      <path d="M40 24 q4 -3 8 0 M52 24 q4 -3 8 0" stroke="#F7E6C6" strokeWidth="1.7" fill="none" strokeLinecap="round" />
      <circle cx="36" cy="36.5" r="1.4" fill="#F7E6C6" />
      <circle cx="50" cy="36.5" r="1.4" fill="#F7E6C6" />
      <circle cx="64" cy="36.5" r="1.4" fill="#F7E6C6" />
    </>
  );
}

/** Косы по бокам — рисуются поверх плеч, рядом со щеками. */
function Braids() {
  return (
    <>
      <path d="M29 50 q-9 13 -6 32" stroke="#3C2C22" strokeWidth="6.5" fill="none" strokeLinecap="round" />
      <path d="M71 50 q9 13 6 32" stroke="#3C2C22" strokeWidth="6.5" fill="none" strokeLinecap="round" />
      {/* перевязки на косах */}
      <circle cx="23.2" cy="82" r="3.4" fill="#C96F4A" />
      <circle cx="76.8" cy="82" r="3.4" fill="#C96F4A" />
      <circle cx="23.2" cy="82" r="1.3" fill="#E2A03A" />
      <circle cx="76.8" cy="82" r="1.3" fill="#E2A03A" />
    </>
  );
}

/** Красная такыя — поверх волос, на макушке. */
function Takiya() {
  return (
    <>
      <path d="M32 27 Q50 11 68 27 L68 32 Q50 25 32 32 Z" fill="#C96F4A" />
      <path d="M38 25 q4 -3 8 -3 M54 22 q4 0 8 3" stroke="#E2A03A" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="17" r="2" fill="#E2A03A" />
    </>
  );
}

/** Белый платок — зрелая Айжан: закрывает волосы и спускается к плечам. */
function Headscarf() {
  return (
    <>
      <path d="M22 58 Q19 12 50 12 Q81 12 78 58 L78 66 Q66 50 50 50 Q34 50 22 66 Z" fill="#FBF4E8" />
      <path d="M27 46 Q31 22 50 20" stroke="#E6D5BA" strokeWidth="1.6" fill="none" opacity="0.85" />
      <path d="M50 12 v6" stroke="#E6D5BA" strokeWidth="1.4" opacity="0.7" />
    </>
  );
}

export function GameAvatar({
  size = 96,
  age = 17,
  mood = 60,
  breathe = true,
  characterId,
  tag,
  className,
}: {
  size?: number;
  age?: number;
  mood?: number;
  breathe?: boolean;
  characterId?: string;
  tag?: string;
  className?: string;
}) {
  const variant: Variant = VARIANT_BY_ID[characterId ?? ""] ?? "aibek";
  const female = variant === "aizhan";
  const stage = age < 19 ? 0 : age < 23 ? 1 : age < 28 ? 2 : 3;
  // рот: от лёгкой грусти до улыбки
  const smile = mood >= 66 ? 10 : mood >= 33 ? 4 : -6;

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
          <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
            <rect width="100" height="100" fill="#F6E7CD" />
            {/* плечи/одежда взрослеют цветом */}
            <circle cx="50" cy="118" r="52" fill={CLOTHES[variant][stage]} />
            {/* воротник-стойка у мужчин, бусы у Айжан */}
            {!female && <path d="M36 76 q14 8 28 0 l0 6 q-14 7 -28 0 Z" fill="#FBF4E8" opacity="0.5" />}
            {female && (
              <g fill="#E2A03A">
                <circle cx="42" cy="80" r="2" />
                <circle cx="50" cy="83" r="2.4" />
                <circle cx="58" cy="80" r="2" />
              </g>
            )}

            {/* голова */}
            <circle cx="50" cy="46" r="26" fill={female ? "#EFC299" : "#E8B98A"} />

            {/* головной убор / причёска */}
            {variant === "aibek" && <Kalpak />}
            {variant === "marat" && (
              <>
                {/* волосы из-под тюбетейки */}
                <path d="M27 42 q1 -8 6 -11 q-2 7 0 11 Z M73 42 q-1 -8 -6 -11 q2 7 0 11 Z" fill={stage === 3 ? "#6B523F" : "#3C2C22"} />
                <Tubeteika />
              </>
            )}
            {female &&
              (stage === 3 ? (
                <Headscarf />
              ) : (
                <>
                  {/* волосы с пробором + косы поверх плеч */}
                  <path d="M25 44 Q28 18 50 18 Q72 18 75 44 Q65 27 50 27 Q35 27 25 44 Z" fill="#3C2C22" />
                  <Braids />
                  {stage <= 1 && <Takiya />}
                  {stage === 2 && <path d="M31 31 q8 -7 17 -8" stroke="#6B523F" strokeWidth="1.6" fill="none" opacity="0.7" strokeLinecap="round" />}
                </>
              ))}
            {/* седые виски у мужчин в зрелости */}
            {!female && stage === 3 && (
              <path d="M27 44 q1 -6 4 -9 M73 44 q-1 -6 -4 -9" stroke="#BBA990" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            )}

            {/* глаза */}
            <circle cx="41" cy="46" r="2.6" fill="#4A372A" />
            <circle cx="59" cy="46" r="2.6" fill="#4A372A" />
            {/* реснички у Айжан */}
            {female && (
              <path d="M37.5 43 q3 -2.5 6.5 -1.5 M56 41.5 q3.5 -1 6.5 1.5" stroke="#3C2C22" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            )}
            {/* брови */}
            <path d="M36 40 q5 -3 10 -1" stroke={female ? "#3C2C22" : "#4A372A"} strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M54 39 q5 -2 10 1" stroke={female ? "#3C2C22" : "#4A372A"} strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* румянец */}
            {female && (
              <g fill="#E58F74" opacity="0.4">
                <circle cx="36" cy="54" r="3.6" />
                <circle cx="64" cy="54" r="3.6" />
              </g>
            )}
            {/* морщинки с возрастом */}
            {stage >= 2 && (
              <path d="M37 53 q2 2 4 0 M59 53 q2 2 4 0" stroke="#D19A6A" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            )}
            {/* нос */}
            <path d="M50 48 q-2 5 1 7" stroke="#D19A6A" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* рот по настроению */}
            <path
              d={`M42 ${62 - smile / 4} q8 ${smile} 16 0`}
              stroke="#4A372A"
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
            />
            {/* усы и борода у мужчин с возрастом */}
            {!female && stage >= 2 && (
              <path d="M42 58.5 q8 4 16 0 q-3 4 -8 4 q-5 0 -8 -4 Z" fill={stage === 3 ? "#6B523F" : "#4A372A"} opacity="0.8" />
            )}
            {!female && stage >= 2 && (
              <path d="M33 56 q3 14 17 16 q14 -2 17 -16 q-2 12 -17 13 q-15 -1 -17 -13 Z" fill="#5C4433" opacity="0.3" />
            )}
            {/* серьги у взрослой Айжан */}
            {female && stage >= 2 && (
              <g fill="#E2A03A">
                <circle cx="24.5" cy="52" r="2" />
                <circle cx="75.5" cy="52" r="2" />
              </g>
            )}
          </svg>
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
