"use client";

import { useEffect, useRef, useState } from "react";

import { authErrorMessage, useGoogleAuth } from "../model/use-auth";

/**
 * Блок соц-входа под формами логина/регистрации.
 *
 * NEW PATTERN: Google Identity Services (GIS) — официальный скрипт Google
 * рисует свою кнопку в наш контейнер и отдаёт в callback подписанный
 * ID-токен (JWT); мы шлём его на POST /auth/google. Свою кнопку рисовать
 * нельзя по правилам Google, поэтому вид кнопки отличается от остальных.
 *
 * Без NEXT_PUBLIC_GOOGLE_CLIENT_ID показывает прежние заглушки «скоро».
 */

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GSI_SRC = "https://accounts.google.com/gsi/client";

// минимальный срез типов GIS — официальных типов у скрипта нет
interface GsiApi {
  accounts: {
    id: {
      initialize(cfg: {
        client_id: string;
        callback: (response: { credential: string }) => void;
      }): void;
      renderButton(
        el: HTMLElement,
        cfg: {
          theme: "outline" | "filled_blue" | "filled_black";
          size: "large" | "medium" | "small";
          text?: "signin_with" | "signup_with" | "continue_with";
          width?: number;
          locale?: string;
        },
      ): void;
    };
  };
}

let gsiPromise: Promise<GsiApi> | null = null;

/** Одноразовая загрузка GIS-скрипта на страницу. */
function loadGsi(): Promise<GsiApi> {
  gsiPromise ??= new Promise<GsiApi>((resolve, reject) => {
    const w = window as Window & { google?: GsiApi };
    if (w.google?.accounts?.id) {
      resolve(w.google);
      return;
    }
    const script = document.createElement("script");
    script.src = GSI_SRC;
    script.async = true;
    script.onload = () => {
      if (w.google?.accounts?.id) resolve(w.google);
      else reject(new Error("GIS script loaded without google.accounts.id"));
    };
    script.onerror = () => reject(new Error("Failed to load GIS script"));
    document.head.appendChild(script);
  });
  return gsiPromise;
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden>
      <path fill="#EA4335" d="M9 3.48c1.32 0 2.5.45 3.44 1.35l2.54-2.54C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.95 2.29C4.6 5.07 6.62 3.48 9 3.48Z" />
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62Z" />
      <path fill="#FBBC05" d="M3.91 10.7a5.4 5.4 0 0 1 0-3.45L.96 4.96a9 9 0 0 0 0 8.08l2.95-2.34Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.85.86-3.04.86-2.38 0-4.4-1.6-5.12-3.76L.96 13.04C2.44 15.98 5.48 18 9 18Z" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg width="15" height="17" viewBox="0 0 15 17" fill="currentColor" aria-hidden>
      <path d="M12.6 8.93c-.02-1.9 1.56-2.82 1.63-2.86-.89-1.3-2.27-1.48-2.76-1.5-1.18-.12-2.3.69-2.89.69-.6 0-1.51-.67-2.49-.66-1.28.02-2.46.74-3.12 1.89-1.33 2.31-.34 5.73.96 7.6.64.92 1.39 1.95 2.38 1.91.96-.04 1.32-.62 2.48-.62 1.15 0 1.48.62 2.49.6 1.03-.02 1.68-.93 2.31-1.86.73-1.06 1.03-2.1 1.04-2.15-.02-.01-2-.77-2.02-3.06ZM10.7 3.3c.53-.64.89-1.53.79-2.42-.76.03-1.69.51-2.24 1.15-.49.56-.92 1.46-.81 2.32.85.07 1.72-.43 2.26-1.05Z" />
    </svg>
  );
}

/** Прежние заглушки, пока Google-вход не сконфигурирован. */
function DisabledSocialRow() {
  return (
    <div className="flex gap-2.5" title="Скоро — пока вход по почте или гостем">
      <button
        type="button"
        disabled
        className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-2xl border-[1.5px] border-tg-line bg-tg-card-2 py-3 text-[13.5px] font-bold text-tg-brown opacity-50"
      >
        <GoogleMark /> Google
      </button>
      <button
        type="button"
        disabled
        className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-2xl border-[1.5px] border-tg-line bg-tg-card-2 py-3 text-[13.5px] font-bold text-tg-brown opacity-50"
      >
        <AppleMark /> Apple ID
      </button>
    </div>
  );
}

export function SocialAuth({ context }: { context: "signin" | "signup" }) {
  const googleAuth = useGoogleAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  // mutate в ref: GIS-callback живёт вне жизненного цикла React
  const mutateRef = useRef(googleAuth.mutate);
  useEffect(() => {
    mutateRef.current = googleAuth.mutate;
  });

  useEffect(() => {
    if (!CLIENT_ID) return;
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;

    loadGsi()
      .then((gsi) => {
        if (cancelled) return;
        gsi.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (response) => mutateRef.current(response.credential),
        });
        el.innerHTML = "";
        gsi.accounts.id.renderButton(el, {
          theme: "outline",
          size: "large",
          text: context === "signup" ? "signup_with" : "signin_with",
          width: Math.min(400, Math.max(200, el.offsetWidth || 336)),
          locale: "ru",
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [context]);

  if (!CLIENT_ID || failed) return <DisabledSocialRow />;

  return (
    <div className="flex flex-col gap-2">
      <div ref={containerRef} className="flex min-h-11 justify-center" />
      {googleAuth.isPending && (
        <p className="m-0 text-center text-[12.5px] font-bold text-tg-muted">
          Входим через Google…
        </p>
      )}
      {googleAuth.isError && (
        <p className="m-0 rounded-xl bg-[#F1D6CE] px-3 py-2 text-[12.5px] font-bold text-[#B5503C]">
          {authErrorMessage(googleAuth.error)}
        </p>
      )}
    </div>
  );
}
