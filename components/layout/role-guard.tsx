"use client";

import * as React from "react";
import { AccessDenied } from "@/components/shared/access-denied";
import { homeRouteForRole } from "@/lib/routes";
import { UserRole } from "@/src/types";
import { useAuthStore } from "@/src/store/auth-store";

interface Props {
  allow: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Client-side UI gate. Middleware already prevents wrong-role users from
 * reaching these routes; this is a belt-and-suspenders for cases where
 * state changes (e.g. role update) without a navigation.
 */
export function RoleGuard({ allow, children, fallback }: Props) {
  // Subscribe to zustand's hydration + auth state via useSyncExternalStore.
  // This is the React-recommended way to read from an external store.
  const mountedAndHydrated = React.useSyncExternalStore(
    (callback) => {
      const persistApi = useAuthStore.persist;
      const unsub = persistApi?.onFinishHydration(callback) ?? (() => {});
      return unsub;
    },
    () => {
      const persistApi = useAuthStore.persist;
      // If persist isn't ready, treat as not-hydrated
      if (!persistApi) return false;
      return persistApi.hasHydrated();
    },
    () => false, // Server snapshot: never hydrated
  );

  const user = useAuthStore((s) => s.user);

  if (!mountedAndHydrated) return null;

  if (!user || !allow.includes(user.role)) {
    return (
      <>
        {fallback ?? (
          <AccessDenied homeHref={homeRouteForRole(user?.role ?? null)} />
        )}
      </>
    );
  }

  return <>{children}</>;
}
