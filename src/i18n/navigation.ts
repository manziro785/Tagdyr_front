import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

/**
 * Обёртки над навигацией Next, которые сами подставляют префикс локали.
 *
 * ВАЖНО: внутри приложения импортировать Link/useRouter/usePathname отсюда,
 * а не из "next/link" и "next/navigation" — иначе на кыргызской или английской
 * версии переход выкинет игрока обратно на русскую.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
