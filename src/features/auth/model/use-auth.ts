"use client";

import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";

import type { AuthResponse } from "@/entities/game/api/types";
import { useAuthStore } from "@/entities/session/model/auth-store";
import { api } from "@/shared/ui/api/axiosInstance";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  displayName: string;
}

/** Человеческое сообщение об ошибке auth-запроса. */
export function authErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 401) return "Неверная почта или пароль.";
    if (error.response?.status === 409) return "Эта почта уже зарегистрирована — попробуй войти.";
    if (error.response?.status === 422) return "Проверь поля: почта настоящая, пароль от 8 символов.";
    if (!error.response) return "Сервер не отвечает. Можно зайти гостем — прогресс сохранится в браузере.";
  }
  return "Что-то пошло не так. Попробуй ещё раз.";
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

/** Гостевой вход: без сервера, прогресс в localStorage. */
export function useGuestEntry() {
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);
  const router = useRouter();
  return () => {
    continueAsGuest();
    router.push("/lives");
  };
}
