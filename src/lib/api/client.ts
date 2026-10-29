import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from "@/stores/auth.store";
import { ApiRequestError } from "@/lib/api/errors";

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

// Refresh this long before the access token actually expires
const REFRESH_LEEWAY_MS = 60_000;

let sessionExpiredHandler: (() => void) | null = null;

export function setSessionExpiredHandler(handler: (() => void) | null) {
  sessionExpiredHandler = handler;
}

function getTokenTiming(token: string) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { exp, iat } = JSON.parse(atob(payload)) as {
      exp?: number;
      iat?: number;
    };
    if (typeof exp !== "number") return null;
    const expiresAt = exp * 1000;
    const lifetime = typeof iat === "number" ? expiresAt - iat * 1000 : null;
    return { expiresAt, lifetime };
  } catch {
    return null;
  }
}

function isAuthEndpoint(url?: string) {
  return Boolean(url && /\/auth\/(login|register|refresh)\b/.test(url));
}

function expireSession() {
  if (!useAuthStore.getState().refreshToken) return;

  useAuthStore.getState().logout();
  sessionExpiredHandler?.();
}

// Logs the user out as soon as the refresh token expires, even when idle
export function startSessionWatcher() {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const check = () => {
    clearTimeout(timer);
    const { refreshToken } = useAuthStore.getState();
    if (!refreshToken) return;

    const expiresAt = getTokenTiming(refreshToken)?.expiresAt;
    if (!expiresAt) return;

    const remaining = expiresAt - Date.now();
    if (remaining <= 0) {
      expireSession();
      return;
    }
    // setTimeout overflows past ~24.8 days, so re-check in chunks
    timer = setTimeout(check, Math.min(remaining + 500, 2_000_000_000));
  };

  const unsubscribe = useAuthStore.subscribe(check);
  const onVisible = () => {
    if (document.visibilityState === "visible") check();
  };
  document.addEventListener("visibilitychange", onVisible);
  check();

  return () => {
    clearTimeout(timer);
    unsubscribe();
    document.removeEventListener("visibilitychange", onVisible);
  };
}

let refreshRequest: Promise<void> | null = null;

// One refresh at a time. Refresh tokens are single-use, so concurrent
// requests must share the same call.
function refreshSession() {
  refreshRequest ??= (async () => {
    const usedRefreshToken = useAuthStore.getState().refreshToken;

    if (!usedRefreshToken) {
      throw new ApiRequestError("Not signed in.", "session", 401);
    }

    try {
      const response = await axios.post(
        `${API_URL}/auth/refresh`,
        { refreshToken: usedRefreshToken },
        { timeout: 15_000 },
      );
      const tokens = response.data?.data;

      if (!tokens?.accessToken || !tokens?.refreshToken) {
        throw new Error("Invalid token refresh response.");
      }

      useAuthStore
        .getState()
        .setTokens(tokens.accessToken, tokens.refreshToken);
    } catch (error) {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;
      const rejected = status === 400 || status === 401 || status === 403;

      // Another tab may already have rotated the token; use its result
      if (useAuthStore.getState().refreshToken !== usedRefreshToken) return;

      if (rejected) {
        expireSession();
        throw new ApiRequestError("Session expired.", "session", status);
      }

      // Network or server trouble: keep the user signed in and let them retry
      throw error;
    }
  })().finally(() => {
    refreshRequest = null;
  });

  return refreshRequest;
}

apiClient.interceptors.request.use(async (config) => {
  const { accessToken, refreshToken } = useAuthStore.getState();

  if (accessToken && refreshToken && !isAuthEndpoint(config.url)) {
    const timing = getTokenTiming(accessToken);
    // Short-lived tokens must not be refreshed on every request
    const leeway = timing?.lifetime
      ? Math.min(REFRESH_LEEWAY_MS, timing.lifetime * 0.2)
      : REFRESH_LEEWAY_MS;

    if (timing && timing.expiresAt - Date.now() < leeway) {
      try {
        await refreshSession();
      } catch (error) {
        if (error instanceof ApiRequestError) throw error;
        // transient failure: try the request with the current token
      }
    }
  }

  const currentToken = useAuthStore.getState().accessToken;

  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (error instanceof ApiRequestError) return Promise.reject(error);

    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const originalRequest = error.config as
      (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      useAuthStore.getState().refreshToken &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        await refreshSession();
        return apiClient(originalRequest);
      } catch (refreshError) {
        if (refreshError instanceof ApiRequestError) {
          return Promise.reject(refreshError);
        }
        // otherwise fall through and report the original failure
      }
    }

    if (!error.response) {
      const timedOut = error.code === "ECONNABORTED";

      return Promise.reject(
        new ApiRequestError(
          timedOut
            ? "The request took too long. Please try again."
            : "Can't reach the server. Check your connection and try again.",
          timedOut ? "timeout" : "network",
        ),
      );
    }

    const responseData = error.response.data as
      | { message?: string; error?: string; errors?: { message?: string }[] }
      | undefined;
    const message =
      responseData?.message ??
      responseData?.error ??
      responseData?.errors?.[0]?.message ??
      "Something went wrong. Please try again.";

    return Promise.reject(
      new ApiRequestError(message, "http", error.response.status),
    );
  },
);
