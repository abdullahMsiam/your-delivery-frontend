"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchMyDeliveries,
  type MyDeliveriesParams,
} from "@/lib/api/deliveries";
import { queryKeys } from "@/lib/query-keys";

export function useMyDeliveries(params: MyDeliveriesParams = {}) {
  return useQuery({
    queryKey: queryKeys.deliveries.myList(params),
    queryFn: () => fetchMyDeliveries(params),
    placeholderData: (prev) => prev, // keep previous page while switching
  });
}
