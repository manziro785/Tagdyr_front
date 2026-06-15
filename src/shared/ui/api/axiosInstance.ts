import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.res?.status === 401) {
      console.warn("401 not authorized");
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  },
);
