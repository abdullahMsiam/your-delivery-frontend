"use client";

import { useAuthStore } from "@/src/store/auth-store";
import * as React from "react";

/**
 * Waits for Zustand's persisted state to rehydrate before rendering children.
 * Uses `useSyncExternalStore` — the React-recommended way to subscribe to
 * an external store (which is what Zustand is), avoiding setState-in-effect.
 *
 * Renders nothing during SSR and first client render; content appears
 * once localStorage has been read and merged into the store.
 */
export function AuthSync({ children }: { children: React.ReactNode }) {
  const isHydrated = React.useSyncExternalStore(
    // subscribe: called on the client only
    (callback) => {
      const persistApi = useAuthStore.persist;
      if (!persistApi) return () => {};
      const unsub = persistApi.onFinishHydration(callback);
      return unsub;
    },
    // getSnapshot: client
    () => {
      const persistApi = useAuthStore.persist;
      return persistApi ? persistApi.hasHydrated() : true;
    },
    // getServerSnapshot: SSR — always false, we don't know yet
    () => false
  );

  if (!isHydrated) return null;

  return <>{children}</>;
}