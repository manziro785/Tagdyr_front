"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

import { useAuthStore } from "@/entities/session/model/auth-store";

/** true после восстановления persist-стора из localStorage. */
function useAuthHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useAuthStore.persist.onFinishHydration(onChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}

/**
 * Гард приватной зоны: без выбранного режима (user/guest) — на логин.
 * Ждём гидратацию persist-стора, иначе на первом рендере mode всегда null.
 */
export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const mode = useAuthStore((s) => s.mode);
  const hydrated = useAuthHydrated();

  useEffect(() => {
    if (hydrated && mode === null) router.replace("/auth/login");
  }, [hydrated, mode, router]);

  if (!hydrated || mode === null) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-tg-cream">
        <span className="font-display text-xl font-bold text-tg-muted">Тагдыр…</span>
      </div>
    );
  }
  return <>{children}</>;
}
