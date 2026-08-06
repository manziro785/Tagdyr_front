import axios, { AxiosError } from "axios";

import { useAuthStore } from "@/entities/session/model/auth-store";
import type { TokenPair } from "@/entities/game/api/types";
import { API_BASE_URL } from "./base-url";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/** Один общий refresh на все параллельные 401 — чтобы не штурмовать /auth/refresh. */
let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken, setTokens, signOut } = useAuthStore.getState();
  if (!refreshToken) return null;
  try {
    // чистый axios: наш инстанс зациклил бы интерсепторы
    const { data } = await axios.post<TokenPair>(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken },
      { headers: { "Content-Type": "application/json" } },
    );
    setTokens(data);
    return data.accessToken;
  } catch {
    signOut();
    return null;
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config;
    const status = error.response?.status;

    // 401 на самих auth-роутах — это «неверный пароль», не повод рефрешить/редиректить
    const isAuthRoute = original?.url?.includes("/auth/");

    if (status === 401 && original && !isAuthRoute && !original.headers?.["X-Retried"]) {
      refreshing ??= refreshAccessToken().finally(() => {
        refreshing = null;
      });
      const token = await refreshing;
      if (token) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${token}`;
        original.headers["X-Retried"] = "1";
        return api.request(original);
      }
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  },
);
