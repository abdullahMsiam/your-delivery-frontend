"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useSearchParamsState<T extends Record<string, string>>(
  defaults: T,
): [T, (patch: Partial<T>, opts?: { resetPage?: boolean }) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = React.useMemo(() => {
    const result: Record<string, string> = { ...defaults };
    for (const key of Object.keys(defaults)) {
      const v = searchParams.get(key);
      if (v !== null) result[key] = v;
    }
    return result as T;
  }, [defaults, searchParams]);

  const setState = React.useCallback(
    (patch: Partial<T>, opts?: { resetPage?: boolean }) => {
      const next = new URLSearchParams(searchParams.toString());

      Object.entries(patch).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });

      if (opts?.resetPage !== false && !("page" in patch)) {
        next.set("page", "1");
      }

      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  return [state, setState];
}
