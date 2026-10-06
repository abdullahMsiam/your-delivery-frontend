import "server-only";
import { cookies } from "next/headers";
import { ApiError } from "@/lib/api-client";
import type {
  CreatePaymentIntentResponse,
  DeliveryDetail,
  Payment,
} from "@/src/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";
const ACCESS_COOKIE = "yd_access";

async function authHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/* -------------------------------------------------------------------------- */
/*                              Fetch a delivery                              */
/* -------------------------------------------------------------------------- */

export async function fetchDeliveryForPay(
  id: string,
): Promise<DeliveryDetail | null> {
  const res = await fetch(`${API_URL}/deliveries/${id}`, {
    cache: "no-store",
    headers: await authHeaders(),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new ApiError("Failed to fetch delivery", res.status);
  const json = (await res.json()) as { data: DeliveryDetail };
  return json.data;
}

/* -------------------------------------------------------------------------- */
/*                          Create a Stripe intent                            */
/* -------------------------------------------------------------------------- */

export async function createPaymentIntentServer(
  deliveryId: string,
): Promise<CreatePaymentIntentResponse> {
  const res = await fetch(`${API_URL}/payments/create-intent`, {
    method: "POST",
    cache: "no-store",
    headers: await authHeaders(),
    body: JSON.stringify({ deliveryId }),
  });

  const json = (await res.json().catch(() => ({}))) as
    | { success: true; data: CreatePaymentIntentResponse }
    | { success: false; message?: string };

  if (!res.ok || !("success" in json) || !json.success) {
    const msg =
      "message" in json && json.message
        ? json.message
        : `Failed to create payment intent (${res.status})`;
    throw new ApiError(msg, res.status);
  }

  return json.data;
}

/* -------------------------------------------------------------------------- */
/*                          Fetch payment by delivery                         */
/* -------------------------------------------------------------------------- */

export async function fetchPaymentServer(
  deliveryId: string,
): Promise<Payment | null> {
  const res = await fetch(`${API_URL}/payments/${deliveryId}`, {
    cache: "no-store",
    headers: await authHeaders(),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new ApiError("Failed to fetch payment", res.status);
  const json = (await res.json()) as { data: Payment };
  return json.data;
}
