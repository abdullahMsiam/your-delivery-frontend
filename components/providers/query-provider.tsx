"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            // Retry up to 3 times, but only for network-level errors.
            // 4xx responses are NOT retried (they're real errors).
            retry: (failureCount, error) => {
              // Axios network error → status 0 or no response
              const status = (error as { status?: number })?.status;
              if (status && status < 500 && status !== 408) return false;
              return failureCount < 3;
            },
            retryDelay: (attempt) => Math.min(1500 * 2 ** attempt, 8000),
            refetchOnWindowFocus: false,
          },
          mutations: {
            // Don't retry mutations — user needs to know if an action failed
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
