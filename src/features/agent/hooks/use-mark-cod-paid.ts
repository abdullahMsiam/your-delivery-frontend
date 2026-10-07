"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { ApiResponse, Payment } from "@/src/types";

export function useMarkCodPaid() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (deliveryId: string) => {
      const res = await api.patch<ApiResponse<Payment>>(
        `/payments/${deliveryId}/cod-paid`,
      );
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Cash payment recorded");
      qc.invalidateQueries({ queryKey: queryKeys.agent.deliveries() });
      qc.invalidateQueries({ queryKey: queryKeys.agent.statistics });
      qc.invalidateQueries({ queryKey: queryKeys.deliveries.all });
      qc.invalidateQueries({ queryKey: queryKeys.payments.byDelivery("") });
    },
    onError: (err) => {
      const message =
        err instanceof ApiError ? err.message : "Could not record payment";
      toast.error(message);
    },
  });
}
