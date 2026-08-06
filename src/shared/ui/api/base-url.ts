/**
 * Базовый URL API. Живёт отдельно от axiosInstance, потому что серверные
 * компоненты (страница /s/[token]) ходят обычным fetch и не должны тянуть
 * за собой клиентский стор сессии.
 *
 * Переменная однажды попала в Vercel с BOM из PowerShell-пайпа — браузер
 * считал URL относительным; чистим невидимые символы и пустую строку.
 */
export const API_BASE_URL =
  (process.env.NEXT_PUBLIC_BASE_URL ?? "").replace(/﻿/g, "").trim() ||
  "http://localhost:8787/api/v1";
