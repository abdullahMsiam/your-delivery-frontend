import "server-only";
import { ApiError } from "@/lib/api-client";
import { TrackingResponse } from "@/src/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export async function fetchTracking(
  trackingId: string
): Promise<TrackingResponse | null> {
  const url = `${API_URL}/deliveries/track/${encodeURIComponent(trackingId)}`;

  const res = await fetch(url, {
    next: { revalidate: 30 },
    headers: { Accept: "application/json" },
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(
      text || `Failed to fetch tracking (${res.status})`,
      res.status
    );
  }

  const json = (await res.json()) as {
    success: true;
    message: string;
    data: TrackingResponse;
  };

  return json.data;
}