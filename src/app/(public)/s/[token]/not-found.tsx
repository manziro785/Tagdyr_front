import Link from "next/link";

/** Токен не найден или жизнь удалили: не оставляем пришедшего из чата ни с чем. */
export default function ShareNotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-tg-cream px-6 text-center font-sans">
      <h1 className="m-0 font-display text-[26px] font-bold tracking-[-0.5px] text-tg-brown">
        Ссылка больше не живёт
      </h1>
      <p className="m-0 max-w-[38ch] text-[14px] leading-[1.6] font-semibold text-tg-muted">
        Жизнь по этой ссылке удалили или её никогда не было. Зато свою можно
        прожить прямо сейчас.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#EFBE63,#E2A03A)] px-6 py-[14px] font-display text-[15px] font-bold text-[#5A3F1C] shadow-[0_10px_24px_rgba(214,160,60,0.36)] transition-transform hover:-translate-y-px"
      >
        На главную «Тагдыр»
      </Link>
    </main>
  );
}
