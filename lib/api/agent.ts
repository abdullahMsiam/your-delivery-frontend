"use client";

import { api } from "@/lib/api-client";
import type {
  AgentStatistics,
  ApiResponse,
  Delivery,
  DeliveryStatus,
  PaginatedResponse,
  User,
} from "@/src/types";

/* -------------------------------------------------------------------------- */
/*                                Agent profile                               */
/* -------------------------------------------------------------------------- */

export async function fetchAgentMe(): Promise<User> {
  const res = await api.get<ApiResponse<User>>("/agent/me");
  return res.data.data;
}

/* -------------------------------------------------------------------------- */
/*                                 Statistics                                 */
/* -------------------------------------------------------------------------- */

export async function fetchAgentStatistics(): Promise<AgentStatistics> {
  const res = await api.get<ApiResponse<AgentStatistics>>("/agent/statistics");
  return res.data.data;
}

/* -------------------------------------------------------------------------- */
/*                            Assigned deliveries                             */
/* -------------------------------------------------------------------------- */

export interface AgentDeliveriesParams {
  page?: number;
  limit?: number;
}

export async function fetchAgentDeliveries(
  params: AgentDeliveriesParams = {},
): Promise<PaginatedResponse<Delivery>> {
  const res = await api.get<PaginatedResponse<Delivery>>("/agent/deliveries", {
    params,
  });
  return res.data;
}

/* -------------------------------------------------------------------------- */
/*                             Advance status                                 */
/* -------------------------------------------------------------------------- */

export interface UpdateStatusInput {
  status: DeliveryStatus;
  note?: string;
}

export async function updateAgentDeliveryStatus(
  id: string,
  input: UpdateStatusInput,
): Promise<Delivery> {
  const res = await api.patch<ApiResponse<Delivery>>(
    `/agent/deliveries/${id}/status`,
    input,
  );
  return res.data.data;
}
