"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAdminUsers } from "@/lib/api/admin";
import { queryKeys } from "@/lib/query-keys";

export function useActiveAgents() {
  return useQuery({
    queryKey: queryKeys.admin.users({ role: "AGENT", isActive: true }),
    queryFn: () =>
      fetchAdminUsers({ role: "AGENT", isActive: true, page: 1, limit: 50 }),
    select: (data) => data.users.filter((u) => u.isActive),
    staleTime: 60_000,
  });
}
