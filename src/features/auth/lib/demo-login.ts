"use client";

import type { AuthUser, UserRole } from "@/src/types";

interface DemoLoginResponse {
  success: true;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  };
}

export async function demoLogin(
  role: UserRole,
): Promise<DemoLoginResponse["data"]> {
  const res = await fetch("/api/demo-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });

  const json = (await res.json()) as
    | DemoLoginResponse
    | { success: false; message?: string };

  if (!res.ok || !("success" in json) || !json.success) {
    const message =
      "message" in json && json.message
        ? json.message
        : `Demo login failed (${res.status})`;
    throw new Error(message);
  }

  return json.data;
}
