/**
 * Клиентская валидация auth-форм. Дублирует правила бэкенда
 * (packages/schemas: email + пароль 8–72), чтобы не гонять на сервер
 * заведомо пустые/битые формы.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function emailError(email: string): string | undefined {
  if (!email) return "Укажи почту";
  if (!EMAIL_RE.test(email)) return "Почта выглядит неправильно — проверь адрес";
  return undefined;
}

export function loginPasswordError(password: string): string | undefined {
  if (!password) return "Введи пароль";
  return undefined;
}

export function newPasswordError(password: string): string | undefined {
  if (!password) return "Придумай пароль";
  if (password.length < 8) return "Пароль короткий — нужно от 8 символов";
  if (password.length > 72) return "Пароль слишком длинный — максимум 72 символа";
  return undefined;
}

export function displayNameError(name: string): string | undefined {
  if (!name.trim()) return "Скажи, как тебя звать";
  if (name.trim().length > 60) return "Имя слишком длинное — максимум 60 символов";
  return undefined;
}
