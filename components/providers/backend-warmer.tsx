"use client";

import * as React from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

/**
 * Fires one lightweight ping to the backend on app load to nudge Render's
 * free-tier dyno awake. Fire-and-forget — errors are swallowed.
 *
 * Only runs if the backend is remote (not localhost), since local servers
 * don't cold-start.
 */
export function BackendWarmer() {
  React.useEffect(() => {
    const isLocal =
      API_URL.includes("localhost") || API_URL.includes("127.0.0.1");
    if (isLocal) return;

    // The /health endpoint lives outside /api/v1.
    // We derive it from the base: "https://x.onrender.com/api/v1" → "https://x.onrender.com/api/health"
    const healthUrl = API_URL.replace(/\/api\/v1\/?$/, "/api/health");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 70_000);

    fetch(healthUrl, { signal: controller.signal, cache: "no-store" })
      .catch(() => {
        // Swallow — this is best-effort
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

  return null;
}
