"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchAdminDeliveries,
  type AdminDeliveriesParams,
} from "@/lib/api/admin";
import { queryKeys } from "@/lib/query-keys";

export function useAdminDeliveries(params: AdminDeliveriesParams = {}) {
  return useQuery({
    queryKey: queryKeys.admin.deliveries(params),
    queryFn: () => fetchAdminDeliveries(params),
    placeholderData: (prev) => prev,
  });
}
