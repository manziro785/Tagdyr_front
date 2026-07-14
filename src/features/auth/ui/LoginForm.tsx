"use client";

import { useState } from "react";
import { ArrowRight, Check, Lock, Mail } from "lucide-react";
import Link from "next/link";

import { authErrorMessage, useGuestEntry, useLogin } from "../model/use-auth";
import { emailError, loginPasswordError } from "../model/validation";
import { AuthField } from "./AuthField";
import { SocialAuth } from "./SocialAuth";

type FieldErrors = { email?: string; password?: string };

/** Экран входа «Тагдыр» по дизайну из Figma. */
export function LoginForm() {
  const login = useLogin();
  const enterAsGuest = useGuestEntry();
  const [errors, setErrors] = useState<FieldErrors>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (login.isPending) return;
    const form = new FormData(e.currentTarget);
    const email = String(form.get("login") ?? "").trim();
    const password = String(form.get("password") ?? "");

    const next: FieldErrors = {
      email: emailError(email),
      password: loginPasswordError(password),
    };
    if (next.email || next.password) {
      setErrors(next);
      return;
    }
    setErrors({});
    login.mutate({ email, password });
  };

  // ошибка поля гаснет, как только игрок начал его править
  const onInput = (e: React.FormEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name;
    if (name === "login") setErrors((p) => ({ ...p, email: undefined }));
    if (name === "password") setErrors((p) => ({ ...p, password: undefined }));
  };

  return (
    <>
      {/* бренд */}
      <div className="mb-0.5 flex flex-col items-center gap-2.5">
        <span className="font-display text-[38px] font-bold tracking-[-0.6px] text-tg-brown [text-shadow:0_2px_14px_rgba(250,240,224,0.6)]">
          Тагдыр
        </span>
        <span className="text-center text-[13.5px] font-semibold text-tg-brown-2">
          С возвращением. Твоя судьба тебя ждёт.
        </span>
      </div>

      {/* карточка */}
      <form
        onSubmit={onSubmit}
        onInput={onInput}
        noValidate
        className="flex flex-col gap-[13px] rounded-3xl border border-white/70 bg-[rgba(251,245,234,0.86)] p-5 shadow-[0_22px_54px_rgba(74,42,16,0.22)] backdrop-blur-xl"
      >
        <h1 className="font-display text-xl font-bold text-tg-brown">Войти</h1>

        <AuthField
          label="Почта"
          icon={Mail}
          type="email"
          name="login"
          placeholder="azamat@example.kg"
          autoComplete="username"
          error={errors.email}
        />

        <AuthField
          label="Пароль"
          icon={Lock}
          type="password"
          name="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password}
        />

        <div className="flex items-center justify-between px-0.5">
          <label className="flex cursor-pointer items-center gap-2 text-[12.5px] font-bold text-tg-brown-2 select-none">
            <input type="checkbox" name="remember" defaultChecked className="peer sr-only" />
            <span className="flex size-[18px] items-center justify-center rounded-md border border-tg-line bg-tg-card-2 text-transparent transition-colors peer-checked:border-tg-amber peer-checked:bg-tg-amber peer-checked:text-white">
              <Check size={12} strokeWidth={3} />
            </span>
            Запомнить
          </label>
          <Link href="#" className="text-[12.5px] font-bold text-tg-amber-deep hover:underline">
            Забыли пароль?
          </Link>
        </div>

        {login.isError && (
          <p className="m-0 rounded-xl bg-[#F1D6CE] px-3 py-2 text-[12.5px] font-bold text-[#B5503C]">
            {authErrorMessage(login.error)}
          </p>
        )}

        <button
          type="submit"
          disabled={login.isPending}
          className="mt-0.5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(180deg,#EFBE63,#E2A03A)] px-5 py-3.5 font-display text-base font-bold text-[#5A3F1C] shadow-[0_8px_20px_rgba(214,160,60,0.34)] transition-transform hover:-translate-y-px disabled:opacity-60"
        >
          {login.isPending ? "Входим…" : "Войти"} <ArrowRight size={17} strokeWidth={2.6} />
        </button>

        <div className="flex items-center gap-[11px] text-xs font-bold text-tg-faint before:h-px before:flex-1 before:bg-tg-line after:h-px after:flex-1 after:bg-tg-line">
          или
        </div>

        <SocialAuth context="signin" />
      </form>

      {/* гость + футер */}
      <button
        type="button"
        onClick={enterAsGuest}
        className="cursor-pointer p-1.5 text-center text-[13.5px] font-extrabold text-tg-brown-2 hover:underline"
      >
        Войти как гость · просто попробовать
      </button>

      <p className="m-0 text-center text-[13px] font-semibold text-tg-brown-2">
        Впервые тут?{" "}
        <Link href="/auth/register" className="font-extrabold text-tg-amber-deep hover:underline">
          Начать новую жизнь
        </Link>
      </p>
    </>
  );
}
