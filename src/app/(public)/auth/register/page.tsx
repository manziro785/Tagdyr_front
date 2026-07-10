import type { Metadata } from "next";

import { AuthShell } from "@/features/auth/ui/AuthShell";
import { RegisterForm } from "@/features/auth/ui/RegisterForm";

export const metadata: Metadata = {
  title: "Регистрация — Тагдыр",
  description: "Маленькие выборы складываются в судьбу. Начни свою.",
};

export default function RegisterPage() {
  return (
    <AuthShell>
      <RegisterForm />
    </AuthShell>
  );
}
