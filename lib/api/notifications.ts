"use client";

import { api } from "@/lib/api-client";
import type {
  ApiResponse,
  AppNotification,
  MarkAllReadResponse,
  PaginatedResponse,
  UnreadCountResponse,
} from "@/src/types";

export interface NotificationsParams {
  page?: number;
  limit?: number;
}

export async function fetchNotifications(
  params: NotificationsParams = {},
): Promise<PaginatedResponse<AppNotification>> {
  const res = await api.get<PaginatedResponse<AppNotification>>(
    "/notifications",
    { params },
  );
  return res.data;
}

export async function fetchUnreadCount(): Promise<number> {
  const res = await api.get<ApiResponse<UnreadCountResponse>>(
    "/notifications/unread-count",
  );
  return res.data.data.unreadCount;
}

export async function markNotificationRead(
  id: string,
): Promise<AppNotification> {
  const res = await api.patch<ApiResponse<AppNotification>>(
    `/notifications/${id}/read`,
  );
  return res.data.data;
}

export async function markAllNotificationsRead(): Promise<number> {
  const res = await api.patch<ApiResponse<MarkAllReadResponse>>(
    "/notifications/read-all",
  );
  return res.data.data.updatedCount;
}
