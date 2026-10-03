"use client";

import { useAuthStore } from "@/src/store/auth-store";
import * as React from "react";

/**
 * Reads persisted Zustand state on mount and ensures
 * isAuthenticated is consistent with the presence of a token.
 * Prevents flash of "logged out" UI on first render after refresh.
 */
export function AuthSync({ children }: { children: React.ReactNode }) {
  const hasHydrated = useAuthStore.persist.hasHydrated();
  const [ready, setReady] = React.useState(hasHydrated);

  React.useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setReady(true));
    // If already hydrated, unblock immediately.
    if (useAuthStore.persist.hasHydrated()) setReady(true);
    return unsub;
  }, []);

  if (!ready) {
    // Render nothing (or a skeleton) on first client paint.
    return null;
  }

  return <>{children}</>;
}
