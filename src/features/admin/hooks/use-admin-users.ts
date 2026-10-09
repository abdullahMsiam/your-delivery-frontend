"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAdminUsers, type AdminUsersParams } from "@/lib/api/admin";
import { queryKeys } from "@/lib/query-keys";

export function useAdminUsers(params: AdminUsersParams = {}) {
  return useQuery({
    queryKey: queryKeys.admin.users(params),
    queryFn: () => fetchAdminUsers(params),
    placeholderData: (prev) => prev,
  });
}
