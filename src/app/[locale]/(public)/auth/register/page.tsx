import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AuthShell } from "@/features/auth/ui/AuthShell";
import { RegisterForm } from "@/features/auth/ui/RegisterForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.register" });
  return { title: t("title"), description: t("description") };
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // включает статический рендер страницы под каждую локаль
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AuthShell>
      <RegisterForm />
    </AuthShell>
  );
}
