import { UserRole } from "@/src/types";

/**
 * Demo accounts for the one-click login feature.
 * These MUST match backend-provisioned accounts.
 * Fill in real credentials provided by the backend owner.
 */
export interface DemoAccount {
  role: UserRole;
  label: string;
  email: string;
  password: string;
  icon: "admin" | "customer" | "agent";
  redirectTo: string;
}

// Todo
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: UserRole.ADMIN,
    label: "Admin",
    email: "abdullah@admin.com",
    password: "password123",
    icon: "admin",
    redirectTo: "/admin",
  },
  {
    role: UserRole.CUSTOMER,
    label: "Customer",
    email: "abslive@gmail.com",
    password: "password123",
    icon: "customer",
    redirectTo: "/dashboard",
  },
  {
    role: UserRole.AGENT,
    label: "Agent",
    email: "abdullah@agent.com",
    password: "password123",
    icon: "agent",
    redirectTo: "/provider",
  },
];
