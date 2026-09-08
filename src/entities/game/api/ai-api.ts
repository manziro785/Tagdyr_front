import { useAuthStore } from "@/entities/session/model/auth-store";
import { currentLocale } from "@/i18n/current-locale";
import { API_BASE_URL } from "@/shared/ui/api/base-url";

/**
 * Клиент AI-эндпоинтов. Отдельно от axios-инстанса, потому что axios в браузере
 * не умеет читать ответ по мере поступления — нужен fetch с ReadableStream.
 * Из-за этого здесь вручную то, что axios-интерсептор делает сам: токен и
 * Accept-Language.
 *
 * Формат ответа — SSE от hono/streaming:
 *   event: delta \n data: {"type":"delta","text":"…"} \n\n
 * События: delta (дописать), reset (стереть накопленное), done (итог).
 */

export type AiSource = "ai" | "fallback" | "cache";

export interface AiStreamHandlers {
  onDelta: (text: string) => void;
  /** Сервер отказался от начатого текста — стереть показанное. */
  onReset: () => void;
  onDone: (text: string, source: AiSource) => void;
}

/**
 * Стримит эпилог сезона. Бросает исключение на любой осечке — вызывающий
 * решает, что показывать вместо; молча глотать нельзя, иначе непонятно,
 * почему игрок всегда видит шаблон.
 */
export async function streamSeasonEpilogue(
  params: { lifeId: string; seasonNumber: number; signal: AbortSignal },
  handlers: AiStreamHandlers,
): Promise<void> {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) throw new Error("streamSeasonEpilogue: нет токена");

  const res = await fetch(`${API_BASE_URL}/ai/epilogue`, {
    method: "POST",
    signal: params.signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Accept-Language": currentLocale(),
    },
    body: JSON.stringify({ lifeId: params.lifeId, seasonNumber: params.seasonNumber }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`ai/epilogue ответил ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // события разделены пустой строкой; недочитанный хвост ждёт следующей порции
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() ?? "";

    for (const block of blocks) {
      let name = "";
      let raw = "";
      for (const line of block.split("\n")) {
        if (line.startsWith("event:")) name = line.slice("event:".length).trim();
        if (line.startsWith("data:")) raw = line.slice("data:".length).trim();
      }
      if (!name || !raw) continue;

      if (name === "reset") {
        handlers.onReset();
        continue;
      }
      const payload = JSON.parse(raw) as { text?: string; source?: AiSource };
      if (name === "delta" && payload.text) handlers.onDelta(payload.text);
      if (name === "done") handlers.onDone(payload.text ?? "", payload.source ?? "fallback");
    }
  }
}
