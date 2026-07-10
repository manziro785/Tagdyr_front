"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthResponse, Me, TokenPair } from "@/entities/game/api/types";

/**
 * Сессия. Два режима:
 *  - "user"  — вход по email, токены живут здесь (persist), запросы идут на API;
 *  - "guest" — без сервера, весь прогресс в localStorage (localApi).
 * null — режим ещё не выбран (первый визит) → лендинг/логин.
 */
export type AuthMode = "user" | "guest";

interface AuthState {
  mode: AuthMode | null;
  user: Me | null;
  accessToken: string | null;
  refreshToken: string | null;
  signIn: (auth: AuthResponse) => void;
  setTokens: (tokens: TokenPair) => void;
  continueAsGuest: () => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      mode: null,
      user: null,
      accessToken: null,
      refreshToken: null,

      signIn: (auth) =>
        set({
          mode: "user",
          user: auth.user,
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
        }),

      setTokens: (tokens) =>
        set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }),

      continueAsGuest: () =>
        set({ mode: "guest", user: null, accessToken: null, refreshToken: null }),

      signOut: () => set({ mode: null, user: null, accessToken: null, refreshToken: null }),
    }),
    { name: "tagdyr-auth" },
  ),
);
