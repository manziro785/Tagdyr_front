"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/** Сцены лендинга: долина с юртами → кампус → Иссык-Куль. */
const SLIDES = [
  "/tagdyr/blur/valley.jpg",
  "/tagdyr/blur/campus.jpg",
  "/tagdyr/blur/issykkul.jpg",
];

const INTERVAL_MS = 7000;

/**
 * Фон-слайдшоу героя: стопка картинок, активная проявляется opacity-переходом.
 * Все слайды в DOM сразу — браузер их прогревает, кроссфейд без миганий.
 * Уважает prefers-reduced-motion и не листает в фоновом табе.
 */
export function HeroSlideshow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!document.hidden) setActive((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {SLIDES.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-[2200ms] ease-in-out",
            i === active ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      {/* тёплый кремовый скрим поверх любой сцены */}
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(245,235,221,0.3)_0%,rgba(244,233,216,0.24)_40%,rgba(243,229,208,0.55)_80%,rgba(238,222,198,0.85)_100%)]" />
    </div>
  );
}
