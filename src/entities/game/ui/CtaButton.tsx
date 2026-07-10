import { cn } from "@/lib/utils";

/** Янтарная CTA-кнопка из дизайн-макета (.tg-cta). */
export function CtaButton({
  children,
  className,
  disabled,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-[18px] border-none bg-[linear-gradient(180deg,#EFBE63,#E2A03A)] p-[15px] font-display text-base font-bold text-[#5A3F1C] shadow-[0_8px_20px_rgba(214,160,60,0.34)] transition-transform hover:-translate-y-px active:translate-y-0",
        disabled && "cursor-not-allowed opacity-60 hover:translate-y-0",
        className,
      )}
    >
      {children}
    </button>
  );
}
