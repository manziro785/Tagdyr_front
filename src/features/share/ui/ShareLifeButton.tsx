"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

import { useShareLink } from "@/entities/meta/api";
import { useAuthStore } from "@/entities/session/model/auth-store";
import { cn } from "@/lib/utils";

type Status = "idle" | "copied" | "error";

/**
 * «Поделиться жизнью»: просит у сервера публичный токен (он стабильный —
 * повторные клики дают ту же ссылку) и отдаёт её системному шерингу, а на
 * десктопе кладёт в буфер обмена.
 *
 * Гостю кнопки нет: жизнь живёт в localStorage, серверу нечего публиковать.
 */
export function ShareLifeButton({
  lifeId,
  title,
  className,
}: {
  lifeId: string;
  /** Заголовок концовки — уходит в текст системного «поделиться». */
  title?: string;
  className?: string;
}) {
  const isUser = useAuthStore((s) => s.mode) === "user";
  const shareLink = useShareLink();
  const [status, setStatus] = useState<Status>("idle");

  if (!isUser) return null;

  const onShare = () => {
    if (shareLink.isPending) return;
    setStatus("idle");
    shareLink.mutate(lifeId, {
      onSuccess: async ({ token }) => {
        const url = `${window.location.origin}/s/${token}`;
        const text = title ? `Моя жизнь в «Тагдыр»: ${title}` : "Моя жизнь в «Тагдыр»";
        try {
          if (typeof navigator.share === "function") {
            await navigator.share({ title: "Тагдыр", text, url });
            return;
          }
          await navigator.clipboard.writeText(url);
          setStatus("copied");
        } catch (err) {
          // закрыл системную шторку — это не ошибка, всё остальное показываем
          if (err instanceof DOMException && err.name === "AbortError") return;
          setStatus("error");
        }
      },
      onError: () => setStatus("error"),
    });
  };

  const label = shareLink.isPending
    ? "Готовлю ссылку…"
    : status === "copied"
      ? "Ссылка скопирована"
      : status === "error"
        ? "Не вышло — ещё раз?"
        : "Поделиться жизнью";

  return (
    <button
      type="button"
      onClick={onShare}
      disabled={shareLink.isPending}
      className={cn(
        "inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-[18px] border border-white/50 bg-white/20 p-[13px] font-display text-[15px] font-bold text-[#FFFCF6] backdrop-blur-sm transition-colors hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
    >
      {status === "copied" ? (
        <Check size={17} strokeWidth={2.6} />
      ) : (
        <Share2 size={17} strokeWidth={2.2} />
      )}
      {label}
    </button>
  );
}
