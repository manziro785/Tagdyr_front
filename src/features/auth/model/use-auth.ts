"use client";

import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import type { AuthResponse, GoogleAuthRequest } from "@/entities/game/api/types";
import { useAuthStore } from "@/entities/session/model/auth-store";
import { api } from "@/shared/ui/api/axiosInstance";
import { useRouter } from "@/i18n/navigation";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  displayName: string;
}

/** Ключ сообщения об ошибке auth-запроса из словаря auth.errors. */
export function authErrorKey(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 401) return "invalidCredentials";
    if (error.response?.status === 404) return "googleUnavailable";
    if (error.response?.status === 409) return "emailTaken";
    if (error.response?.status === 422) return "validation";
    if (!error.response) return "offline";
  }
  return "unknown";
}

export function useLogin() {
  const signIn = useAuthStore((s) => s.signIn);
  const router = useRouter();
  return useMutation({
    mutationFn: async (body: LoginInput) =>
      (await api.post<AuthResponse>("/auth/login", body)).data,
    onSuccess: (auth) => {
      signIn(auth);
      router.push("/lives");
    },
  });
}

export function useRegister() {
  const signIn = useAuthStore((s) => s.signIn);
  const router = useRouter();
  return useMutation({
    mutationFn: async (body: RegisterInput) =>
      (await api.post<AuthResponse>("/auth/register", body)).data,
    onSuccess: (auth) => {
      signIn(auth);
      router.push("/lives");
    },
  });
}

/**
 * Вход через Google: GIS-кнопка отдаёт ID-токен, бэкенд проверяет его
 * подпись у Google и выдаёт нашу пару токенов (POST /auth/google).
 */
export function useGoogleAuth() {
  const signIn = useAuthStore((s) => s.signIn);
  const router = useRouter();
  return useMutation({
    mutationFn: async (idToken: string) =>
      (
        await api.post<AuthResponse>("/auth/google", {
          idToken,
        } satisfies GoogleAuthRequest)
      ).data,
    onSuccess: (auth) => {
      signIn(auth);
      router.push("/lives");
    },
  });
}

/** Гостевой вход: без сервера, прогресс в localStorage. */
export function useGuestEntry() {
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);
  const router = useRouter();
  return () => {
    continueAsGuest();
    router.push("/lives");
  };
}
