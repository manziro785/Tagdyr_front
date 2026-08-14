"use client";

import { Link } from "@/i18n/navigation";

import { useAuthStore } from "@/entities/session/model/auth-store";
import { useAuthHydrated } from "@/entities/session/model/use-auth-hydrated";

/**
 * Ссылка на публичных страницах, которая знает про сессию.
 *
 * Лендинг — серверный компонент, поэтому кнопки на нём вели на регистрацию
 * всегда, даже у вошедшего игрока: «Начать жизнь» отправляло регистрироваться
 * заново. Этот тонкий клиентский слой подменяет адрес и подпись, когда режим
 * уже выбран (вход или гость).
 */
export function SessionAwareLink({
  guestHref,
  userHref,
  userLabel,
  className,
  children,
}: {
  /** Куда вести, пока режим не выбран. */
  guestHref: string;
  /** Куда вести вошедшего игрока (или гостя с прогрессом). */
  userHref: string;
  /** Подпись для вошедшего; без неё остаётся исходная. */
  userLabel?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  const mode = useAuthStore((s) => s.mode);
  const hydrated = useAuthHydrated();
  // до гидратации показываем гостевой вариант — он же приходит с сервера
  const signedIn = hydrated && mode !== null;

  return (
    <Link href={signedIn ? userHref : guestHref} className={className}>
      {signedIn && userLabel !== undefined ? userLabel : children}
    </Link>
  );
}
