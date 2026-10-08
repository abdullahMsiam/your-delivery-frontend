"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchAdminDashboard } from "@/lib/api/admin";

export function useAdminDashboard() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard,
    queryFn: fetchAdminDashboard,
    staleTime: 30_000,
  });
}
