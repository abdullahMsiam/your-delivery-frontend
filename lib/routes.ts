import { UserRole } from "@/src/types";

/** Canonical home route per role. */
export function homeRouteForRole(role: UserRole | null | undefined): string {
  switch (role) {
    case UserRole.ADMIN:
      return "/admin";
    case UserRole.AGENT:
      return "/provider";
    case UserRole.CUSTOMER:
      return "/dashboard";
    default:
      return "/login";
  }
}

/** Route prefixes that require authentication + a specific role. */
export const PROTECTED_PREFIXES: {
  prefix: string;
  roles: UserRole[];
}[] = [
  { prefix: "/admin", roles: [UserRole.ADMIN] },
  { prefix: "/provider", roles: [UserRole.AGENT] },
  { prefix: "/dashboard", roles: [UserRole.CUSTOMER] },
];

/** Routes that should redirect AWAY if user is already authenticated. */
export const AUTH_ROUTES = ["/login", "/register"];