import { User } from "lucide-react";

import { cn } from "@/lib/utils";

type AvatarProps = {
  size?: number;
  breathe?: boolean;
  ring?: boolean;
  tag?: string;
};

export function Avatar({
  size = 96,
  breathe = true,
  ring = true,
  tag = "char",
}: AvatarProps) {
  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <span className="absolute -inset-[24%] rounded-full bg-[radial-gradient(circle,rgba(230,162,60,0.42)_0%,rgba(230,162,60,0)_68%)]" />
      <div
        className={cn(
          "relative size-full rounded-full bg-[linear-gradient(155deg,#EEB85C,#E2A03A_60%,#D08F2C)]",
          ring
            ? "p-1 shadow-[0_6px_16px_rgba(160,110,40,0.28)]"
            : "p-[3px] shadow-[0_4px_10px_rgba(160,110,40,0.22)]",
        )}
      >
        <div
          className={cn(
            "relative flex size-full items-center justify-center overflow-hidden rounded-full",
            "bg-[repeating-linear-gradient(135deg,#ECDCC0_0_9px,#E4D0B0_9px_18px)]",
            "shadow-[inset_0_2px_9px_rgba(74,55,42,0.13)]",
            breathe && "tg-breathe",
          )}
        >
          <User
            size={Math.round(size * 0.46)}
            strokeWidth={1.6}
            className="text-[rgba(74,55,42,0.26)]"
          />
          {size >= 80 && (
            <span className="absolute bottom-[7px] left-1/2 -translate-x-1/2 rounded-[5px] bg-white/60 px-[5px] py-px font-mono text-[7.5px] tracking-[0.3px] whitespace-nowrap text-[rgba(74,55,42,0.5)]">
              {tag}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
