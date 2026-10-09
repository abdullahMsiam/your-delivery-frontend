import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import type { ApiErrorResponse, ZodIssue } from "@/src/types";

/* -------------------------------------------------------------------------- */
/*                                 Constants                                  */
/* -------------------------------------------------------------------------- */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

/* -------------------------------------------------------------------------- */
/*                                Typed error                                 */
/* -------------------------------------------------------------------------- */

export class ApiError extends Error {
  status: number;
  errors?: ZodIssue[];

  constructor(message: string, status: number, errors?: ZodIssue[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

/* -------------------------------------------------------------------------- */
/*                      Token accessors (decoupled store)                     */
/* -------------------------------------------------------------------------- */

/**
 * The API client reads/writes tokens via these callbacks, which are wired
 * up to the Zustand store at app startup (see src/store/auth-store.ts).
 *
 * This avoids a circular import between api-client and the store.
 */
type TokenAccessors = {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  onTokensRefreshed: (accessToken: string) => void;
  onAuthFailure: () => void;
};

let tokenAccessors: TokenAccessors = {
  getAccessToken: () => null,
  getRefreshToken: () => null,
  onTokensRefreshed: () => {},
  onAuthFailure: () => {},
};

export function configureApiClient(accessors: TokenAccessors) {
  tokenAccessors = accessors;
}

/* -------------------------------------------------------------------------- */
/*                              Axios instance                                */
/* -------------------------------------------------------------------------- */

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // Long timeout to survive Render free-tier cold starts (~30-60s).
  timeout: 60_000,
});

/* -------------------------------------------------------------------------- */
/*                       Request interceptor — attach JWT                     */
/* -------------------------------------------------------------------------- */

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenAccessors.getAccessToken();
  // Public routes should not receive a bearer token.
  const isPublic =
    config.url?.startsWith("/auth/login") ||
    config.url?.startsWith("/auth/register") ||
    config.url?.startsWith("/auth/refresh-token") ||
    config.url?.startsWith("/auth/logout") ||
    config.url?.startsWith("/deliveries/track/");

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* -------------------------------------------------------------------------- */
/*                    Refresh-token coordination (single-flight)              */
/* -------------------------------------------------------------------------- */

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise; // reuse in-flight refresh

  const refreshToken = tokenAccessors.getRefreshToken();
  if (!refreshToken) {
    throw new ApiError("No refresh token available", 401);
  }

  refreshPromise = (async () => {
    try {
      // Use a *bare* axios call to avoid interceptor recursion.
      const res = await axios.post<{
        success: true;
        message: string;
        data: { accessToken: string };
      }>(
        `${API_URL}/auth/refresh-token`,
        { refreshToken },
        { headers: { "Content-Type": "application/json" } },
      );
      const newToken = res.data.data.accessToken;
      tokenAccessors.onTokensRefreshed(newToken);
      return newToken;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/* -------------------------------------------------------------------------- */
/*                     Response interceptor — error handling                  */
/* -------------------------------------------------------------------------- */

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiErrorResponse>) => {
    const original = error.config as
      | (AxiosRequestConfig & { _retried?: boolean })
      | undefined;

    const status = error.response?.status ?? 0;

    // 401 → try to refresh once, then retry original request
    if (status === 401 && original && !original._retried) {
      const isAuthCall =
        original.url?.includes("/auth/login") ||
        original.url?.includes("/auth/register") ||
        original.url?.includes("/auth/refresh-token");

      if (!isAuthCall) {
        original._retried = true;
        try {
          const newToken = await refreshAccessToken();
          original.headers = {
            ...(original.headers ?? {}),
            Authorization: `Bearer ${newToken}`,
          };
          return api.request(original);
        } catch {
          tokenAccessors.onAuthFailure();
          throw normalizeError(error);
        }
      }
    }

    if (!error.response && original && !original._retried) {
      original._retried = true;
      await new Promise((r) => setTimeout(r, 1500));
      return api.request(original);
    }

    throw normalizeError(error);
  },
);

/* -------------------------------------------------------------------------- */
/*                            Error normalization                             */
/* -------------------------------------------------------------------------- */

function normalizeError(error: AxiosError<ApiErrorResponse>): ApiError {
  if (error.response) {
    const { status, data } = error.response;
    const message =
      (data && "message" in data && data.message) ||
      error.message ||
      "Request failed";
    const issues = data && "errors" in data ? data.errors : undefined;
    return new ApiError(message, status, issues);
  }

  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return new ApiError(
      "The server is taking too long to respond. It may be waking up — please try again in a few seconds.",
      408,
    );
  }

  return new ApiError(
    "Can't reach the server. It may be waking up from sleep (this can take up to a minute). Please try again.",
    0,
  );
}
