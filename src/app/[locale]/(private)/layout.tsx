"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { useAuthStore } from "@/entities/session/model/auth-store";
import { useAuthHydrated } from "@/entities/session/model/use-auth-hydrated";
import { useRouter } from "@/i18n/navigation";

/**
 * Гард приватной зоны: без выбранного режима (user/guest) — на логин.
 * Ждём гидратацию persist-стора, иначе на первом рендере mode всегда null.
 */
export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("common");
  const router = useRouter();
  const mode = useAuthStore((s) => s.mode);
  const hydrated = useAuthHydrated();

  useEffect(() => {
    if (hydrated && mode === null) router.replace("/auth/login");
  }, [hydrated, mode, router]);

  if (!hydrated || mode === null) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-tg-cream">
        <span className="font-display text-xl font-bold text-tg-muted">
          {t("loading")}
        </span>
      </div>
    );
  }
  return <>{children}</>;
}
