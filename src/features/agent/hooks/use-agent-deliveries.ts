"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchAgentDeliveries,
  type AgentDeliveriesParams,
} from "@/lib/api/agent";
import { queryKeys } from "@/lib/query-keys";

export function useAgentDeliveries(params: AgentDeliveriesParams = {}) {
  return useQuery({
    queryKey: queryKeys.agent.deliveries(params),
    queryFn: () => fetchAgentDeliveries(params),
    placeholderData: (prev) => prev,
  });
}