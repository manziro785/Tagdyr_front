import type { Metadata } from "next";
import {
  Geist_Mono,
  Montserrat_Alternates,
  Nunito,
} from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/queryClient";

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

export const metadata: Metadata = {
  title: "Тагдыр — симулятор жизни про Кыргызстан",
  description:
    "Игра-симулятор жизни: от выпускника до взрослого, карточка за карточкой. Маленькие выборы складываются в судьбу.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${nunito.variable} ${montserratAlternates.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
