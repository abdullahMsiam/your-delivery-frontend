import "server-only";
import { cookies } from "next/headers";
import { ApiError } from "@/lib/api-client";
import type { DeliveryDetail } from "@/src/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

const ACCESS_COOKIE = "yd_access";

/**
 * Fetch a single delivery using the auth cookie (set on login).
 * Returns `null` on 404 so callers can trigger notFound().
 */
export async function fetchDeliveryDetail(
  id: string,
): Promise<DeliveryDetail | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;

  const res = await fetch(`${API_URL}/deliveries/${id}`, {
    // Don't cache — detail views are per-user and must reflect the latest state.
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 404) return null;
  if (res.status === 401 || res.status === 403) {
    // Let middleware handle redirect on the next navigation.
    throw new ApiError("Not authorized", res.status);
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(
      text || `Failed to fetch delivery (${res.status})`,
      res.status,
    );
  }

  const json = (await res.json()) as {
    success: true;
    message: string;
    data: DeliveryDetail;
  };

  return json.data;
}
