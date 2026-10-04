"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

export function useLogout() {
  const { logout } = useAuth();
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  const doLogout = React.useCallback(async () => {
    setPending(true);
    try {
      await logout();
      toast.success("Signed out");
      router.replace("/login");
    } catch {
      toast.error("Could not sign out. Try again.");
    } finally {
      setPending(false);
    }
  }, [logout, router]);

  return { doLogout, pending };
}
