import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from "@/stores/auth.store";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is not defined.");
}

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30_000,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let refreshRequest: Promise<void> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const originalRequest = error.config as
        (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
      const refreshToken = useAuthStore.getState().refreshToken;
      const isRefreshRequest = originalRequest?.url?.endsWith("/auth/refresh");

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        refreshToken &&
        !isRefreshRequest
      ) {
        originalRequest._retry = true;

        try {
          refreshRequest ??= axios
            .post(`${API_URL}/auth/refresh`, { refreshToken })
            .then((response) => {
              const tokens = response.data?.data;

              if (!tokens?.accessToken || !tokens?.refreshToken) {
                throw new Error("Invalid token refresh response.");
              }

              useAuthStore
                .getState()
                .setTokens(tokens.accessToken, tokens.refreshToken);
            })
            .finally(() => {
              refreshRequest = null;
            });

          await refreshRequest;

          const accessToken = useAuthStore.getState().accessToken;
          if (accessToken) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          return apiClient(originalRequest);
        } catch {
          useAuthStore.getState().logout();
        }
      }

      const responseData = error.response?.data as
        | { message?: string; error?: string; errors?: { message?: string }[] }
        | undefined;
      const message =
        responseData?.message ??
        responseData?.error ??
        responseData?.errors?.[0]?.message ??
        error.message ??
        "Something went wrong. Please try again.";

      return Promise.reject(new Error(message));
    }

    return Promise.reject(error);
  },
);
