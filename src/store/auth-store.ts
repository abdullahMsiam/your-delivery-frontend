"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { api, configureApiClient } from "@/lib/api-client";
import type { AuthUser, LoginResponse, UserRole } from "@/src/types";
import { authCookies } from "@/lib/cookies";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  /* actions */
  login: (email: string, password: string) => Promise<AuthUser>;
  /**
   * Set a full session in one shot — used by the demo login flow
   * (which receives tokens from /api/demo-login instead of /auth/login).
   */
  setSession: (
    accessToken: string,
    refreshToken: string,
    user: AuthUser,
  ) => void;
  logout: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  setUser: (user: AuthUser | null) => void;
  clearAuth: () => void;

  /* helpers */
  hasRole: (...roles: UserRole[]) => boolean;
}

/* -------------------------------------------------------------------------- */
/*                                   Store                                    */
/* -------------------------------------------------------------------------- */

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      /* ------------------------------ login ------------------------------ */
      login: async (email, password) => {
        const res = await api.post<{
          success: true;
          message: string;
          data: LoginResponse;
        }>("/auth/login", { email, password });

        const { accessToken, refreshToken, user } = res.data.data;

        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });

        // Mirror to cookies so edge middleware can read them.
        authCookies.setTokens(accessToken, refreshToken);
        authCookies.setRole(user.role);

        return user;
      },

      /* ---------------------------- setSession --------------------------- */
      setSession: (accessToken, refreshToken, user) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
        authCookies.setTokens(accessToken, refreshToken);
        authCookies.setRole(user.role);
      },

      /* ------------------------------ logout ----------------------------- */
      logout: async () => {
        const refreshToken = get().refreshToken;

        // Best-effort: revoke on backend, ignore errors, always clear local state.
        if (refreshToken) {
          try {
            await api.post("/auth/logout", { refreshToken });
          } catch {
            // ignore — we log out locally regardless
          }
        }

        get().clearAuth();
      },

      /* ----------------------------- setTokens --------------------------- */
      setTokens: (accessToken, refreshToken) => {
        set((s) => ({
          accessToken,
          refreshToken: refreshToken ?? s.refreshToken,
          isAuthenticated: true,
        }));
        authCookies.setTokens(accessToken, refreshToken);
      },

      /* ------------------------------ setUser ---------------------------- */
      setUser: (user) => set({ user }),

      /* ----------------------------- clearAuth --------------------------- */
      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        authCookies.clear();
      },

      /* ------------------------------ hasRole ---------------------------- */
      hasRole: (...roles) => {
        const role = get().user?.role;
        return !!role && roles.includes(role);
      },
    }),
    {
      name: "your-delivery-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        isAuthenticated: s.isAuthenticated,
      }),
    },
  ),
);

/* -------------------------------------------------------------------------- */
/*                    Wire the store into the API client                      */
/* -------------------------------------------------------------------------- */

configureApiClient({
  getAccessToken: () => useAuthStore.getState().accessToken,
  getRefreshToken: () => useAuthStore.getState().refreshToken,
  onTokensRefreshed: (newAccessToken) => {
    useAuthStore.getState().setTokens(newAccessToken);
  },
  onAuthFailure: () => {
    useAuthStore.getState().clearAuth();
  },
});
