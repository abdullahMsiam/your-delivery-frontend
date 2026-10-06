"use client";

import { api } from "@/lib/api-client";
import type {
  ApiResponse,
  CreatePaymentIntentResponse,
  Payment,
} from "@/src/types";

/** Create a Stripe PaymentIntent for a STRIPE delivery. */
export async function createPaymentIntent(
  deliveryId: string,
): Promise<CreatePaymentIntentResponse> {
  const res = await api.post<ApiResponse<CreatePaymentIntentResponse>>(
    "/payments/create-intent",
    { deliveryId },
  );
  return res.data.data;
}

/** Fetch the payment record for a delivery. */
export async function fetchPayment(deliveryId: string): Promise<Payment> {
  const res = await api.get<ApiResponse<Payment>>(`/payments/${deliveryId}`);
  return res.data.data;
}
