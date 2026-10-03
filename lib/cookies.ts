"use client";

/**
 * Lightweight cookie helpers for token mirroring.
 * These cookies are READ by middleware (edge runtime).
 * They are NOT httpOnly — that would require server-set cookies,
 * which our current login flow doesn't do. This is acceptable for
 * a learner project; production would move to httpOnly + API routes.
 */

const ACCESS_COOKIE = "yd_access";
const REFRESH_COOKIE = "yd_refresh";
const ROLE_COOKIE = "yd_role";

const DEFAULT_MAX_AGE_DAYS = 7;

function setCookie(name: string, value: string, days = DEFAULT_MAX_AGE_DAYS) {
  if (typeof document === "undefined") return;
  const expires = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000,
  ).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export const authCookies = {
  setTokens(accessToken: string, refreshToken?: string) {
    setCookie(ACCESS_COOKIE, accessToken);
    if (refreshToken) setCookie(REFRESH_COOKIE, refreshToken);
  },
  setRole(role: string) {
    setCookie(ROLE_COOKIE, role);
  },
  clear() {
    deleteCookie(ACCESS_COOKIE);
    deleteCookie(REFRESH_COOKIE);
    deleteCookie(ROLE_COOKIE);
  },
  names: {
    ACCESS: ACCESS_COOKIE,
    REFRESH: REFRESH_COOKIE,
    ROLE: ROLE_COOKIE,
  },
};
