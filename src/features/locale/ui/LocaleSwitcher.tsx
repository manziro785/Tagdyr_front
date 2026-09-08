"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import {
  LOCALE_LABELS,
  LOCALE_SWITCHER_VISIBLE,
  routing,
  type Locale,
} from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Переключатель языка: EN · RU · KG.
 *
 * Меняет только сегмент локали, оставаясь на той же странице — usePathname из
 * i18n/navigation отдаёт путь БЕЗ префикса, поэтому router.replace с опцией
 * locale собирает адрес заново. params прокидываем, иначе динамические сегменты
 * (/play/[lifeId], /s/[token]) потеряются при переключении.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("locale");
  const active = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // рубильник на случай, если перевод снова окажется неполным
  if (!LOCALE_SWITCHER_VISIBLE) return null;

  const switchTo = (locale: Locale) => {
    if (locale === active) return;
    startTransition(() => {
      router.replace(
        // @ts-expect-error — типы pathname строгие, а params здесь произвольные
        { pathname, params },
        { locale },
      );
    });
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-xl border border-white/70 bg-white/55 p-0.5 backdrop-blur-md",
        isPending && "opacity-60",
        className,
      )}
      role="group"
      aria-label={t("switchLabel")}
    >
      {routing.locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchTo(locale)}
          aria-current={locale === active}
          title={LOCALE_LABELS[locale].full}
          className={cn(
            "cursor-pointer rounded-[9px] px-2 py-1 font-mono text-[11px] font-bold transition-colors",
            locale === active
              ? "bg-white text-tg-amber-deep shadow-[0_1px_4px_rgba(120,80,40,0.12)]"
              : "text-tg-muted hover:text-tg-brown",
          )}
        >
          {LOCALE_LABELS[locale].short}
        </button>
      ))}
    </div>
  );
}
