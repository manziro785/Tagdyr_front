import type { Metadata } from "next";
import { Geist_Mono, Montserrat_Alternates, Nunito } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";
import { QueryProvider } from "@/lib/queryClient";
import "../globals.css";

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const montserratAlternates = Montserrat_Alternates({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Пререндерим все языки на сборке — страниц мало, зато нет рантайм-развилки. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    // нужен для share-ссылок: без него относительные og:image не разворачиваются
    // в абсолютные и превью в мессенджерах остаётся без картинки
    metadataBase: new URL("https://tagdyr.vercel.app"),
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // без этого страницы сегмента становятся динамическими
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${nunito.variable} ${montserratAlternates.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <NextIntlClientProvider>
          <QueryProvider>{children}</QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
