import "server-only";
import { cookies } from "next/headers";
import { ApiError } from "@/lib/api-client";
import type { Delivery, DeliveryDetail } from "@/src/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";
const ACCESS_COOKIE = "yd_access";

async function authHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/* -------------------------------------------------------------------------- */
/*                    Customer: fetch a single delivery                       */
/* -------------------------------------------------------------------------- */

export async function fetchDeliveryDetail(
  id: string,
): Promise<DeliveryDetail | null> {
  const res = await fetch(`${API_URL}/deliveries/${id}`, {
    cache: "no-store",
    headers: await authHeaders(),
  });

  if (res.status === 404) return null;
  if (res.status === 403) throw new ApiError("Not authorized", 403);
  if (!res.ok) {
    throw new ApiError("Failed to fetch delivery", res.status);
  }

  const json = (await res.json()) as { data: DeliveryDetail };
  return json.data;
}

/* -------------------------------------------------------------------------- */
/*                    Agent: fetch a single delivery (assigned)               */
/* -------------------------------------------------------------------------- */

/**
 * The backend currently has no GET /agent/deliveries/{id}.
 * Workaround: fetch the agent's assigned list, find the delivery by id.
 * If the backend adds a dedicated endpoint later, replace this function.
 *
 * NOTE: the list response may not include `statusHistory` or `agent`.
 * If it doesn't, we merge in whatever we have and the timeline shows empty.
 */
export async function fetchAgentDeliveryDetail(
  id: string,
): Promise<DeliveryDetail | null> {
  // First: try the agent-scoped endpoint (may exist in newer backend versions)
  const agentRes = await fetch(`${API_URL}/agent/deliveries/${id}`, {
    cache: "no-store",
    headers: await authHeaders(),
  });

  if (agentRes.ok) {
    const json = (await agentRes.json()) as { data: DeliveryDetail };
    return json.data;
  }

  // Fallback: scan the agent's list for this id
  const listRes = await fetch(`${API_URL}/agent/deliveries?page=1&limit=50`, {
    cache: "no-store",
    headers: await authHeaders(),
  });

  if (!listRes.ok) {
    throw new ApiError("Failed to fetch assigned deliveries", listRes.status);
  }

  const listJson = (await listRes.json()) as {
    data: Delivery[];
  };

  const match = listJson.data.find((d) => d.id === id);
  if (!match) return null;

  // The list item may be missing statusHistory/agent. Return what we have.
  return {
    ...match,
    statusHistory: match.statusHistory ?? [],
    agent: match.agent ?? null,
  } as DeliveryDetail;
}
