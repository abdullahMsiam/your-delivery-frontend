"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAdminAgent, fetchAdminAgentStatistics } from "@/lib/api/admin";
import { queryKeys } from "@/lib/query-keys";

export function useAdminAgent(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.agentProfile(id),
    queryFn: () => fetchAdminAgent(id),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}

export function useAdminAgentStatistics(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.agentStatistics(id),
    queryFn: () => fetchAdminAgentStatistics(id),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}
