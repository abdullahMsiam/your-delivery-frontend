"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchNotifications,
  fetchUnreadCount,
  type NotificationsParams,
} from "@/lib/api/notifications";
import { queryKeys } from "@/lib/query-keys";

export function useNotifications(params: NotificationsParams = {}) {
  return useQuery({
    queryKey: queryKeys.notifications.list(params),
    queryFn: () => fetchNotifications(params),
    placeholderData: (prev) => prev,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount,
    queryFn: fetchUnreadCount,
    // Poll every 60s per the backend guide (no push).
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    // Keep stale value on window focus; refetch quietly
    staleTime: 30_000,
  });
}
