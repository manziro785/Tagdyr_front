import { cn } from "@/lib/utils";

/**
 * Аватар персонажа: тёплое кольцо, «дыхание», флэт-лицо, взрослеющее с этапами.
 * Лицо — инлайн-SVG: черты (щетина, морщинки, седина) добавляются с возрастом,
 * уголки рта зависят от настроения.
 */
export function GameAvatar({
  size = 96,
  age = 17,
  mood = 60,
  breathe = true,
  tag,
  className,
}: {
  size?: number;
  age?: number;
  mood?: number;
  breathe?: boolean;
  tag?: string;
  className?: string;
}) {
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
            {/* фон-небо за головой */}
            <rect width="100" height="100" fill="#F6E7CD" />
            <circle cx="50" cy="118" r="52" fill="#C96F4A" />
            {/* плечи/пиджак взрослеют цветом */}
            <circle cx="50" cy="118" r="52" fill={["#C96F4A", "#7C9070", "#6B523F", "#5C4433"][stage]} />
            {/* голова */}
            <circle cx="50" cy="46" r="26" fill="#E8B98A" />
            {/* волосы: гуще в юности, аккуратнее и с сединой позже */}
            {stage === 0 && <path d="M24 44 q4 -26 26 -26 q22 0 26 26 q-6 -12 -26 -12 q-20 0 -26 12 Z" fill="#4A372A" />}
            {stage === 1 && <path d="M25 42 q5 -23 25 -23 q20 0 25 23 q-7 -10 -25 -10 q-18 0 -25 10 Z" fill="#4A372A" />}
            {stage === 2 && <path d="M26 41 q5 -21 24 -21 q19 0 24 21 q-7 -9 -24 -9 q-17 0 -24 9 Z" fill="#5C4433" />}
            {stage === 3 && (
              <>
                <path d="M27 40 q5 -19 23 -19 q18 0 23 19 q-7 -8 -23 -8 q-16 0 -23 8 Z" fill="#6B523F" />
                <path d="M30 36 q6 -10 20 -11" stroke="#BBA990" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </>
            )}
            {/* глаза */}
            <circle cx="41" cy="46" r="2.6" fill="#4A372A" />
            <circle cx="59" cy="46" r="2.6" fill="#4A372A" />
            {/* брови */}
            <path d="M36 40 q5 -3 10 -1" stroke="#4A372A" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M54 39 q5 -2 10 1" stroke="#4A372A" strokeWidth="2" fill="none" strokeLinecap="round" />
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
            {/* щетина в зрелости */}
            {stage >= 2 && (
              <path d="M33 56 q3 14 17 16 q14 -2 17 -16 q-2 12 -17 13 q-15 -1 -17 -13 Z" fill="#5C4433" opacity="0.25" />
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
