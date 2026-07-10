"use client";

import { ArrowRight, Lock, Mail, User } from "lucide-react";
import Link from "next/link";

import { authErrorMessage, useRegister } from "../model/use-auth";
import { AuthField } from "./AuthField";

/** Маленькие бренд-иконки для соц-кнопок. */
function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden>
      <path fill="#EA4335" d="M9 3.48c1.32 0 2.5.45 3.44 1.35l2.54-2.54C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.95 2.29C4.6 5.07 6.62 3.48 9 3.48Z" />
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62Z" />
      <path fill="#FBBC05" d="M3.91 10.7a5.4 5.4 0 0 1 0-3.45L.96 4.96a9 9 0 0 0 0 8.08l2.95-2.34Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.85.86-3.04.86-2.38 0-4.4-1.6-5.12-3.76L.96 13.04C2.44 15.98 5.48 18 9 18Z" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg width="15" height="17" viewBox="0 0 15 17" fill="currentColor" aria-hidden>
      <path d="M12.6 8.93c-.02-1.9 1.56-2.82 1.63-2.86-.89-1.3-2.27-1.48-2.76-1.5-1.18-.12-2.3.69-2.89.69-.6 0-1.51-.67-2.49-.66-1.28.02-2.46.74-3.12 1.89-1.33 2.31-.34 5.73.96 7.6.64.92 1.39 1.95 2.38 1.91.96-.04 1.32-.62 2.48-.62 1.15 0 1.48.62 2.49.6 1.03-.02 1.68-.93 2.31-1.86.73-1.06 1.03-2.1 1.04-2.15-.02-.01-2-.77-2.02-3.06ZM10.7 3.3c.53-.64.89-1.53.79-2.42-.76.03-1.69.51-2.24 1.15-.49.56-.92 1.46-.81 2.32.85.07 1.72-.43 2.26-1.05Z" />
    </svg>
  );
}

/**
 * Экран регистрации «Тагдыр». Дизайн-системы для отдельного экрана
 * регистрации в Figma нет, поэтому собран в едином стиле с входом.
 */
export function RegisterForm() {
  const register = useRegister();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (register.isPending) return;
    const form = new FormData(e.currentTarget);
    register.mutate({
      displayName: String(form.get("name") ?? "").trim(),
      email: String(form.get("login") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    });
  };

  return (
    <>
      {/* бренд */}
      <div className="mb-0.5 flex flex-col items-center gap-2.5">
        <span className="font-display text-[38px] font-bold tracking-[-0.6px] text-tg-brown [text-shadow:0_2px_14px_rgba(250,240,224,0.6)]">
          Тагдыр
        </span>
        <span className="text-center text-[13.5px] font-semibold text-tg-brown-2">
          Маленькие выборы складываются в судьбу. Начни свою.
        </span>
      </div>

      {/* карточка */}
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-[13px] rounded-3xl border border-white/70 bg-[rgba(251,245,234,0.86)] p-5 shadow-[0_22px_54px_rgba(74,42,16,0.22)] backdrop-blur-xl"
      >
        <h1 className="font-display text-xl font-bold text-tg-brown">
          Начать новую жизнь
        </h1>

        <AuthField
          label="Как тебя звать"
          icon={User}
          type="text"
          name="name"
          placeholder="Азамат"
          autoComplete="name"
        />

        <AuthField
          label="Почта"
          icon={Mail}
          type="email"
          name="login"
          placeholder="azamat@example.kg"
          autoComplete="username"
        />

        <AuthField
          label="Пароль"
          icon={Lock}
          type="password"
          name="password"
          placeholder="Минимум 8 символов"
          autoComplete="new-password"
        />

        <label className="flex cursor-pointer items-start gap-2 px-0.5 text-[12.5px] leading-snug font-semibold text-tg-brown-2 select-none">
          <input
            type="checkbox"
            name="agree"
            required
            className="peer sr-only"
          />
          <span className="mt-px flex size-[18px] shrink-0 items-center justify-center rounded-md border border-tg-line bg-tg-card-2 text-transparent transition-colors peer-checked:border-tg-amber peer-checked:bg-tg-amber peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-tg-amber/40">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <span>
            Соглашаюсь с{" "}
            <Link href="#" className="font-bold text-tg-amber-deep hover:underline">
              условиями
            </Link>{" "}
            и{" "}
            <Link href="#" className="font-bold text-tg-amber-deep hover:underline">
              политикой конфиденциальности
            </Link>
          </span>
        </label>

        {register.isError && (
          <p className="m-0 rounded-xl bg-[#F1D6CE] px-3 py-2 text-[12.5px] font-bold text-[#B5503C]">
            {authErrorMessage(register.error)}
          </p>
        )}

        <button
          type="submit"
          disabled={register.isPending}
          className="mt-0.5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(180deg,#EFBE63,#E2A03A)] px-5 py-3.5 font-display text-base font-bold text-[#5A3F1C] shadow-[0_8px_20px_rgba(214,160,60,0.34)] transition-transform hover:-translate-y-px disabled:opacity-60"
        >
          {register.isPending ? "Создаём…" : "Создать аккаунт"}{" "}
          <ArrowRight size={17} strokeWidth={2.6} />
        </button>

        <div className="flex items-center gap-[11px] text-xs font-bold text-tg-faint before:h-px before:flex-1 before:bg-tg-line after:h-px after:flex-1 after:bg-tg-line">
          или
        </div>

        <div className="flex gap-2.5" title="Скоро — пока вход по почте или гостем">
          <button
            type="button"
            disabled
            className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-2xl border-[1.5px] border-tg-line bg-tg-card-2 py-3 text-[13.5px] font-bold text-tg-brown opacity-50"
          >
            <GoogleMark /> Google
          </button>
          <button
            type="button"
            disabled
            className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-2xl border-[1.5px] border-tg-line bg-tg-card-2 py-3 text-[13.5px] font-bold text-tg-brown opacity-50"
          >
            <AppleMark /> Apple ID
          </button>
        </div>
      </form>

      {/* футер */}
      <p className="m-0 text-center text-[13px] font-semibold text-tg-brown-2">
        Уже есть аккаунт?{" "}
        <Link href="/auth/login" className="font-extrabold text-tg-amber-deep hover:underline">
          Войти
        </Link>
      </p>
    </>
  );
}
