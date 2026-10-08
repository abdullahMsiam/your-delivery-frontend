"use client";

import { api } from "@/lib/api-client";
import type {
  AdminDashboard,
  AdminUsersResponse,
  AgentStatistics,
  AgentStatisticsNumbers,
  ApiResponse,
  Delivery,
  DeliveryDetail,
  PaginatedResponse,
  User,
  UserRole,
} from "@/src/types";

/* -------------------------------------------------------------------------- */
/*                                Dashboard                                   */
/* -------------------------------------------------------------------------- */

export async function fetchAdminDashboard(): Promise<AdminDashboard> {
  const res = await api.get<ApiResponse<AdminDashboard>>("/admin/dashboard");
  return res.data.data;
}

/* -------------------------------------------------------------------------- */
/*                             Deliveries list                                */
/* -------------------------------------------------------------------------- */

export interface AdminDeliveriesParams {
  page?: number;
  limit?: number;
  status?: string;
  trackingId?: string;
  customerId?: string;
  agentId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export async function fetchAdminDeliveries(
  params: AdminDeliveriesParams = {},
): Promise<PaginatedResponse<Delivery>> {
  const res = await api.get<PaginatedResponse<Delivery>>("/admin/deliveries", {
    params,
  });
  return res.data;
}

export async function fetchAdminDelivery(id: string): Promise<DeliveryDetail> {
  const res = await api.get<ApiResponse<DeliveryDetail>>(
    `/admin/deliveries/${id}`,
  );
  return res.data.data;
}

/* -------------------------------------------------------------------------- */
/*                        Assign / reassign / cancel                          */
/* -------------------------------------------------------------------------- */

export async function assignAgent(
  deliveryId: string,
  agentId: string,
): Promise<DeliveryDetail> {
  const res = await api.patch<ApiResponse<DeliveryDetail>>(
    `/admin/deliveries/${deliveryId}/assign-agent`,
    { agentId },
  );
  return res.data.data;
}

export async function reassignAgent(
  deliveryId: string,
  agentId: string,
): Promise<DeliveryDetail> {
  const res = await api.patch<ApiResponse<DeliveryDetail>>(
    `/admin/deliveries/${deliveryId}/reassign-agent`,
    { agentId },
  );
  return res.data.data;
}

export async function adminCancelDelivery(
  deliveryId: string,
  note?: string,
): Promise<DeliveryDetail> {
  const res = await api.patch<ApiResponse<DeliveryDetail>>(
    `/admin/deliveries/${deliveryId}/cancel`,
    { note: note ?? "" },
  );
  return res.data.data;
}

/* -------------------------------------------------------------------------- */
/*                                   Users                                    */
/* -------------------------------------------------------------------------- */

export interface AdminUsersParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  /** Note: backend has a bug where `isActive=false` is parsed as true. */
  isActive?: boolean;
}

export async function fetchAdminUsers(
  params: AdminUsersParams = {},
): Promise<AdminUsersResponse> {
  const res = await api.get<ApiResponse<AdminUsersResponse>>("/admin/users", {
    params,
  });
  return res.data.data;
}

export async function fetchAdminUser(id: string): Promise<User> {
  const res = await api.get<ApiResponse<User>>(`/admin/users/${id}`);
  return res.data.data;
}

export async function setUserActive(
  id: string,
  isActive: boolean,
): Promise<User> {
  const res = await api.patch<ApiResponse<User>>(`/admin/users/${id}/status`, {
    isActive,
  });
  return res.data.data;
}

export async function setUserRole(id: string, role: UserRole): Promise<User> {
  const res = await api.patch<ApiResponse<User>>(`/admin/users/${id}/role`, {
    role,
  });
  return res.data.data;
}

/* -------------------------------------------------------------------------- */
/*                                   Agents                                   */
/* -------------------------------------------------------------------------- */

export async function fetchAdminAgent(id: string): Promise<User> {
  const res = await api.get<ApiResponse<User>>(`/admin/agents/${id}`);
  return res.data.data;
}

export interface AdminAgentStatistics {
  agent: AgentStatistics["agent"];
  statistics: AgentStatisticsNumbers;
}

export async function fetchAdminAgentStatistics(
  id: string,
): Promise<AdminAgentStatistics> {
  const res = await api.get<ApiResponse<AdminAgentStatistics>>(
    `/admin/agents/${id}/statistics`,
  );
  return res.data.data;
}
