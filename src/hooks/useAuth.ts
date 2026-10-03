"use client";

import { useAuthStore } from "@/src/store/auth-store";
import type { UserRole } from "@/src/types";

/** Full auth state + actions. */
export function useAuth() {
  return useAuthStore();
}

/** Convenience: current user object. */
export function useUser() {
  return useAuthStore((s) => s.user);
}

/** Convenience: is the user authenticated? */
export function useIsAuthenticated() {
  return useAuthStore((s) => s.isAuthenticated);
}

/** Convenience: current role (or null). */
export function useRole(): UserRole | null {
  return useAuthStore((s) => s.user?.role ?? null);
}

/** Convenience: does the user have one of the given roles? */
export function useHasRole(...roles: UserRole[]) {
  return useAuthStore((s) => {
    const role = s.user?.role;
    return !!role && roles.includes(role);
  });
}
