"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPayment } from "@/lib/api/payments";
import { queryKeys } from "@/lib/query-keys";
import type { PaymentStatus } from "@/src/types";

interface Options {
  deliveryId: string | null;
  /** Keep polling while status is in one of these states. */
  pendingStatuses?: PaymentStatus[];
  /** Max time to keep polling, in ms. Default 30s. */
  timeoutMs?: number;
}

export function usePaymentStatus({
  deliveryId,
  pendingStatuses = ["PENDING", "PROCESSING"],
  timeoutMs = 30_000,
}: Options) {
  const startedAt = Date.now();

  return useQuery({
    queryKey: deliveryId
      ? queryKeys.payments.byDelivery(deliveryId)
      : ["payments", "noop"],
    enabled: Boolean(deliveryId),
    queryFn: async () => {
      if (!deliveryId) throw new Error("No delivery ID");
      return fetchPayment(deliveryId);
    },
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 1500;

      const stillPending = pendingStatuses.includes(data.status);
      const timedOut = Date.now() - startedAt > timeoutMs;

      return stillPending && !timedOut ? 2000 : false;
    },
    refetchIntervalInBackground: false,
  });
}
