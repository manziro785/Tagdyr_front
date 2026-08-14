"use client";

import { useSyncExternalStore } from "react";

import { useAuthStore } from "./auth-store";

/**
 * true после восстановления persist-стора из localStorage. До гидратации
 * mode всегда null, поэтому решения «залогинен или нет» принимаем только
 * после неё — иначе разметка сервера и клиента разойдётся.
 */
export function useAuthHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useAuthStore.persist.onFinishHydration(onChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}
