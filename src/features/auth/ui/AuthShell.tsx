import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/features/locale/ui/LocaleSwitcher";

/**
 * Общий каркас экранов аутентификации «Тагдыр»:
 * полноэкранный размытый фон-долина с тёплым скримом и
 * вертикально отцентрованный контент.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("common");
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 py-10 font-sans text-tg-brown">
      {/* фон: размытая долина с юртами + тёплый скрим */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* блюр запечён в jpg: рантайм-blur() давал GPU-шов на широких экранах */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/tagdyr/blur/valley.jpg"
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(245,235,221,0.34)_0%,rgba(244,233,216,0.28)_34%,rgba(243,229,208,0.6)_74%,rgba(238,222,198,0.86)_100%)]" />
      </div>

      {/* лого-ссылка наверху для возврата на лендинг */}
      <Link
        href="/"
        className="absolute top-5 left-1/2 -translate-x-1/2 font-display text-lg font-bold tracking-[-0.5px] text-tg-brown/70 transition-colors hover:text-tg-brown sm:left-6 sm:translate-x-0"
      >
        {t("appName")}
      </Link>

      <LocaleSwitcher className="absolute top-4 right-4 sm:top-5 sm:right-6" />

      <div className="flex w-full max-w-[400px] flex-col gap-[22px]">
        {children}
      </div>
    </main>
  );
}
