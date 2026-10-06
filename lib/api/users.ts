"use client";

import { api } from "@/lib/api-client";
import type { ApiResponse, AuthUser, User } from "@/src/types";

/** Get the current user's full profile. */
export async function fetchMe(): Promise<User> {
  const res = await api.get<ApiResponse<User>>("/users/me");
  return res.data.data;
}

/** Update name and/or phone. */
export async function updateMe(input: {
  name?: string;
  phone?: string;
}): Promise<User> {
  const res = await api.patch<ApiResponse<User>>("/users/me", input);
  return res.data.data;
}

/** Change password. */
export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  await api.patch("/auth/change-password", input);
}
