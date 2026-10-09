"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { setUserActive, setUserRole } from "@/lib/api/admin";
import { queryKeys } from "@/lib/query-keys";
import { ApiError } from "@/lib/api-client";
import type { UserRole } from "@/src/types";

export function useToggleUserActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      setUserActive(id, isActive),
    onSuccess: (user) => {
      toast.success(
        user.isActive ? `${user.name} activated` : `${user.name} deactivated`,
      );
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
    onError: (err) => {
      const message =
        err instanceof ApiError ? err.message : "Couldn't update user";
      toast.error(message);
    },
  });
}

export function useChangeUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      setUserRole(id, role),
    onSuccess: (user) => {
      toast.success(`${user.name} is now ${user.role}`);
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
    onError: (err) => {
      const message =
        err instanceof ApiError ? err.message : "Couldn't change role";
      toast.error(message);
    },
  });
}
