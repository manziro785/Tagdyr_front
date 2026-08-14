/**
 * Клиентская валидация auth-форм. Дублирует правила бэкенда
 * (packages/schemas: email + пароль 8–72), чтобы не гонять на сервер
 * заведомо пустые/битые формы.
 *
 * Возвращает КЛЮЧ сообщения из словаря auth.errors, а не сам текст:
 * подставить перевод должна форма, которая знает текущую локаль.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function emailError(email: string): string | undefined {
  if (!email) return "emailRequired";
  if (!EMAIL_RE.test(email)) return "emailInvalid";
  return undefined;
}

export function loginPasswordError(password: string): string | undefined {
  if (!password) return "passwordRequired";
  return undefined;
}

export function newPasswordError(password: string): string | undefined {
  if (!password) return "passwordNew";
  if (password.length < 8) return "passwordShort";
  if (password.length > 72) return "passwordLong";
  return undefined;
}

export function displayNameError(name: string): string | undefined {
  if (!name.trim()) return "nameRequired";
  if (name.trim().length > 60) return "nameLong";
  return undefined;
}
