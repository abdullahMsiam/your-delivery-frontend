"use client";

import { api } from "@/lib/api-client";
import type {
  ApiResponse,
  Delivery,
  DeliveryDetail,
  DeliveryHistory,
  PaginatedResponse,
} from "@/src/types";

/* -------------------------------------------------------------------------- */
/*                             My deliveries list                             */
/* -------------------------------------------------------------------------- */

export interface MyDeliveriesParams {
  page?: number;
  limit?: number;
  status?: string;
  trackingId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export async function fetchMyDeliveries(
  params: MyDeliveriesParams = {},
): Promise<PaginatedResponse<Delivery>> {
  const res = await api.get<PaginatedResponse<Delivery>>(
    "/deliveries/my-deliveries",
    { params },
  );
  return res.data;
}

/* -------------------------------------------------------------------------- */
/*                                Delivery detail                             */
/* -------------------------------------------------------------------------- */

export async function fetchDelivery(id: string): Promise<DeliveryDetail> {
  const res = await api.get<ApiResponse<DeliveryDetail>>(`/deliveries/${id}`);
  return res.data.data;
}

/* -------------------------------------------------------------------------- */
/*                                Delivery history                            */
/* -------------------------------------------------------------------------- */

export async function fetchDeliveryHistory(
  id: string,
): Promise<DeliveryHistory> {
  const res = await api.get<ApiResponse<DeliveryHistory>>(
    `/deliveries/${id}/history`,
  );
  return res.data.data;
}

/* -------------------------------------------------------------------------- */
/*                              Cancel a delivery                             */
/* -------------------------------------------------------------------------- */

export async function cancelDelivery(id: string, note?: string) {
  const res = await api.patch<ApiResponse<DeliveryDetail>>(
    `/deliveries/${id}/cancel`,
    { note: note ?? "" },
  );
  return res.data.data;
}

/* -------------------------------------------------------------------------- */
/*                              Create a delivery                             */
/* -------------------------------------------------------------------------- */

export async function createDelivery(
  payload: import("@/src/types").CreateDeliveryInput,
) {
  const res = await api.post<ApiResponse<Delivery>>("/deliveries", payload);
  return res.data.data;
}
