"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { changePassword, updateMe } from "@/lib/api/users";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/src/store/auth-store";
import { ApiError } from "@/lib/api-client";

export function useUpdateProfile() {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (input: { name?: string; phone?: string }) => updateMe(input),
    onSuccess: (user) => {
      // Update the Zustand store so the navbar reflects the new name instantly.
      setUser({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      });
      qc.invalidateQueries({ queryKey: queryKeys.users.me });
      qc.invalidateQueries({ queryKey: queryKeys.auth.me });
      toast.success("Profile updated");
    },
    onError: (err) => {
      const message =
        err instanceof ApiError ? err.message : "Couldn't update profile";
      toast.error(message);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: { currentPassword: string; newPassword: string }) =>
      changePassword(input),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (err) => {
      const message =
        err instanceof ApiError ? err.message : "Couldn't change password";
      toast.error(message);
    },
  });
}
