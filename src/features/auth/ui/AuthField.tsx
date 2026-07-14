"use client";

import { useId, useState } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type AuthFieldProps = {
  label: string;
  icon: LucideIcon;
  type?: "text" | "tel" | "email" | "password";
  placeholder?: string;
  autoComplete?: string;
  name?: string;
  defaultValue?: string;
  /** Текст ошибки валидации: подсвечивает поле и выводится под ним. */
  error?: string;
};

/** Поле ввода в стиле дизайна Тагдыр: подпись + иконка + инпут. */
export function AuthField({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  autoComplete,
  name,
  defaultValue,
  error,
}: AuthFieldProps) {
  const id = useId();
  const isPassword = type === "password";
  const [revealed, setRevealed] = useState(false);
  const inputType = isPassword && revealed ? "text" : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="pl-0.5 text-xs font-bold text-tg-muted">
        {label}
      </label>
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-2xl border-[1.5px] border-tg-line bg-tg-card-2 px-3.5 py-3.5",
          "transition-colors focus-within:border-tg-amber",
          error && "border-[#C96F4A] focus-within:border-[#C96F4A]"
        )}
      >
        <Icon
          size={17}
          strokeWidth={2}
          className={cn("shrink-0 text-tg-faint", error && "text-[#C96F4A]")}
        />
        <input
          id={id}
          name={name}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          className="min-w-0 flex-1 border-none bg-transparent text-[15px] font-semibold text-tg-brown outline-none placeholder:font-medium placeholder:text-tg-faint"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? "Скрыть пароль" : "Показать пароль"}
            className="shrink-0 text-tg-faint transition-colors hover:text-tg-brown-2"
          >
            {revealed ? <EyeOff size={17} strokeWidth={2} /> : <Eye size={17} strokeWidth={2} />}
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="m-0 pl-0.5 text-[12px] font-bold text-[#B5503C]">
          {error}
        </p>
      )}
    </div>
  );
}
