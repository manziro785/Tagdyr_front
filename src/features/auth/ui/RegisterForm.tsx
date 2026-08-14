"use client";

import { useState } from "react";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { authErrorKey, useRegister } from "../model/use-auth";
import { displayNameError, emailError, newPasswordError } from "../model/validation";
import { AuthField } from "./AuthField";
import { SocialAuth } from "./SocialAuth";

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  agree?: string;
};

/**
 * Экран регистрации «Тагдыр». Дизайн-системы для отдельного экрана
 * регистрации в Figma нет, поэтому собран в едином стиле с входом.
 */
export function RegisterForm() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const register = useRegister();
  const [errors, setErrors] = useState<FieldErrors>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (register.isPending) return;
    const form = new FormData(e.currentTarget);
    const displayName = String(form.get("name") ?? "").trim();
    const email = String(form.get("login") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const agreed = form.get("agree") === "on";

    const next: FieldErrors = {
      name: displayNameError(displayName),
      email: emailError(email),
      password: newPasswordError(password),
      agree: agreed ? undefined : "agreeRequired",
    };
    if (next.name || next.email || next.password || next.agree) {
      setErrors(next);
      return;
    }
    setErrors({});
    register.mutate({ displayName, email, password });
  };

  // ошибка поля гаснет, как только игрок начал его править
  const onInput = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.name === "name") setErrors((p) => ({ ...p, name: undefined }));
    if (target.name === "login") setErrors((p) => ({ ...p, email: undefined }));
    if (target.name === "password") setErrors((p) => ({ ...p, password: undefined }));
    if (target.name === "agree") setErrors((p) => ({ ...p, agree: undefined }));
  };

  return (
    <>
      {/* бренд */}
      <div className="mb-0.5 flex flex-col items-center gap-2.5">
        <span className="font-display text-[38px] font-bold tracking-[-0.6px] text-tg-brown [text-shadow:0_2px_14px_rgba(250,240,224,0.6)]">
          {tc("appName")}
        </span>
        <span className="text-center text-[13.5px] font-semibold text-tg-brown-2">
          {t("register.subtitle")}
        </span>
      </div>

      {/* карточка */}
      <form
        onSubmit={onSubmit}
        onInput={onInput}
        noValidate
        className="flex flex-col gap-[13px] rounded-3xl border border-white/70 bg-[rgba(251,245,234,0.86)] p-5 shadow-[0_22px_54px_rgba(74,42,16,0.22)] backdrop-blur-xl"
      >
        <h1 className="font-display text-xl font-bold text-tg-brown">
          {t("register.title")}
        </h1>

        <AuthField
          label={t("fields.name")}
          icon={User}
          type="text"
          name="name"
          placeholder={t("fields.namePlaceholder")}
          autoComplete="name"
          error={errors.name && t(`errors.${errors.name}`)}
        />

        <AuthField
          label={t("fields.email")}
          icon={Mail}
          type="email"
          name="login"
          placeholder={t("fields.emailPlaceholder")}
          autoComplete="username"
          error={errors.email && t(`errors.${errors.email}`)}
        />

        <AuthField
          label={t("fields.password")}
          icon={Lock}
          type="password"
          name="password"
          placeholder={t("fields.newPasswordPlaceholder")}
          autoComplete="new-password"
          error={errors.password && t(`errors.${errors.password}`)}
        />

        <div className="flex flex-col gap-1">
          <label className="flex cursor-pointer items-start gap-2 px-0.5 text-[12.5px] leading-snug font-semibold text-tg-brown-2 select-none">
            <input type="checkbox" name="agree" className="peer sr-only" />
            <span className="mt-px flex size-[18px] shrink-0 items-center justify-center rounded-md border border-tg-line bg-tg-card-2 text-transparent transition-colors peer-checked:border-tg-amber peer-checked:bg-tg-amber peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-tg-amber/40">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <span>
              {t("register.agreePrefix")}{" "}
              <Link href="#" className="font-bold text-tg-amber-deep hover:underline">
                {t("register.terms")}
              </Link>{" "}
              {t("register.agreeAnd")}{" "}
              <Link href="#" className="font-bold text-tg-amber-deep hover:underline">
                {t("register.privacy")}
              </Link>
            </span>
          </label>
          {errors.agree && (
            <p role="alert" className="m-0 pl-0.5 text-[12px] font-bold text-[#B5503C]">
              {t(`errors.${errors.agree}`)}
            </p>
          )}
        </div>

        {register.isError && (
          <p className="m-0 rounded-xl bg-[#F1D6CE] px-3 py-2 text-[12.5px] font-bold text-[#B5503C]">
            {t(`errors.${authErrorKey(register.error)}`)}
          </p>
        )}

        <button
          type="submit"
          disabled={register.isPending}
          className="mt-0.5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(180deg,#EFBE63,#E2A03A)] px-5 py-3.5 font-display text-base font-bold text-[#5A3F1C] shadow-[0_8px_20px_rgba(214,160,60,0.34)] transition-transform hover:-translate-y-px disabled:opacity-60"
        >
          {register.isPending ? t("register.submitting") : t("register.submit")}{" "}
          <ArrowRight size={17} strokeWidth={2.6} />
        </button>

        <div className="flex items-center gap-[11px] text-xs font-bold text-tg-faint before:h-px before:flex-1 before:bg-tg-line after:h-px after:flex-1 after:bg-tg-line">
          {t("or")}
        </div>

        <SocialAuth context="signup" />
      </form>

      {/* футер */}
      <p className="m-0 text-center text-[13px] font-semibold text-tg-brown-2">
        {t("register.hasAccount")}{" "}
        <Link href="/auth/login" className="font-extrabold text-tg-amber-deep hover:underline">
          {t("register.toLogin")}
        </Link>
      </p>
    </>
  );
}
