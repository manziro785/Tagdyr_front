import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/ui/AuthShell";
import { LoginForm } from "@/features/auth/ui/LoginForm";

export const metadata: Metadata = {
  title: "Войти — Тагдыр",
  description: "С возвращением. Твоя судьба тебя ждёт.",
};

export default function LoginPage() {
  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
}
