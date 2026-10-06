"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAgentStatistics } from "@/lib/api/agent";
import { queryKeys } from "@/lib/query-keys";

export function useAgentStatistics() {
  return useQuery({
    queryKey: queryKeys.agent.statistics,
    queryFn: fetchAgentStatistics, // returns full { agent, statistics }
    select: (data) => data.statistics, // component gets numbers only
    staleTime: 30_000,
  });
}
