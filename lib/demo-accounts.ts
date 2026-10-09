import { UserRole } from "@/src/types";

/**
 * Demo account metadata for the one-click login UI.
 * Credentials live server-side in .env.local and are accessed by
 * /api/demo-login. This file only describes what the buttons look like.
 */

export interface DemoAccount {
  role: UserRole;
  label: string;
  icon: "admin" | "customer" | "agent";
  redirectTo: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: UserRole.ADMIN,
    label: "Admin",
    icon: "admin",
    redirectTo: "/admin",
  },
  {
    role: UserRole.CUSTOMER,
    label: "Customer",
    icon: "customer",
    redirectTo: "/dashboard",
  },
  {
    role: UserRole.AGENT,
    label: "Agent",
    icon: "agent",
    redirectTo: "/provider",
  },
];
