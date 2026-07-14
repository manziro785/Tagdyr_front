import type { Metadata } from "next";
import { ArrowRight, BookOpen, Coins, Heart, Users } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "О проекте — Тагдыр",
};

const POINTS = [
  {
    icon: Coins,
    color: "var(--color-tg-amber-deep)",
    tint: "var(--color-tg-amber-tint)",
    title: "Финграмотность без нотаций",
    text: "Долг под проценты, подушка безопасности, сложный процент — всё это игрок проживает на своей шкуре, а не читает в учебнике.",
  },
  {
    icon: Heart,
    color: "var(--color-tg-rose-deep)",
    tint: "var(--color-tg-rose-tint)",
    title: "Про нашу жизнь",
    text: "Той у родни, стройка у Жаныбека, маршрутки Бишкека и берег Иссык-Куля. Узнаваемые ситуации, в которых вырос каждый.",
  },
  {
    icon: Users,
    color: "var(--color-tg-sage-deep)",
    tint: "var(--color-tg-sage-tint)",
    title: "До трёх параллельных жизней",
    text: "Проживи одну судьбу упрямым Айбеком, другую — смышлёной Айжан, и сравни, где дороги разошлись.",
  },
  {
    icon: BookOpen,
    color: "var(--color-tg-terra-deep)",
    tint: "var(--color-tg-terra-tint)",
    title: "Коллекция на годы",
    text: "10 концовок и карточки знаний, спрятанные в выборах. Всё открывается только игрой — срезать углы не выйдет.",
  },
] as const;

export default function About() {
  return (
    <main className="min-h-dvh bg-tg-cream font-sans text-tg-brown">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-14">
        <div>
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-[-0.5px] text-tg-brown/70 transition-colors hover:text-tg-brown"
          >
            ← Тагдыр
          </Link>
          <h1 className="mt-4 mb-0 font-display text-[34px] leading-[1.1] font-bold tracking-[-0.7px] text-balance lg:text-[42px]">
            Игра про выборы, деньги и жизнь в Кыргызстане
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-[1.65] font-medium text-tg-brown-2">
            «Тагдыр» (кырг. «судьба») — симулятор жизни от выпускника до
            взрослого. Карточка за карточкой ты решаешь: ехать на Иссык-Куль
            или отложить на осень, поступать или работать, помогать родне или
            копить на своё. Маленькие выборы складываются в судьбу.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {POINTS.map(({ icon: Icon, color, tint, title, text }) => (
            <div
              key={title}
              className="flex flex-col gap-2.5 rounded-3xl border border-tg-line-soft bg-tg-card p-5"
            >
              <span
                className="flex size-10 items-center justify-center rounded-xl"
                style={{ background: tint, color }}
              >
                <Icon size={20} strokeWidth={2.2} />
              </span>
              <h2 className="m-0 font-display text-[16.5px] font-bold">{title}</h2>
              <p className="m-0 text-[13.5px] leading-[1.6] font-medium text-tg-brown-2">
                {text}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[linear-gradient(180deg,#EFBE63,#E2A03A)] px-6 py-[14px] font-display text-[15px] font-bold text-[#5A3F1C] shadow-[0_10px_24px_rgba(214,160,60,0.36)] transition-transform hover:-translate-y-px"
          >
            <ArrowRight size={17} strokeWidth={2.6} /> Начать жизнь
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-2xl border border-tg-line bg-tg-card-2 px-6 py-[14px] font-display text-[15px] font-bold text-tg-brown transition-colors hover:bg-white"
          >
            Войти в сохранение
          </Link>
        </div>

        <p className="m-0 text-[13px] font-semibold text-tg-muted">
          Пет-проект, сделанный с теплом к дому. Кудай буюрса.
        </p>
      </div>
    </main>
  );
}
