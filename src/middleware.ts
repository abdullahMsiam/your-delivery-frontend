import { NextResponse, type NextRequest } from "next/server";

import {
  AUTH_ROUTES,
  PROTECTED_PREFIXES,
  homeRouteForRole,
} from "@/lib/routes";
import { UserRole } from "./types";

const ACCESS_COOKIE = "yd_access";
const ROLE_COOKIE = "yd_role";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const accessToken = req.cookies.get(ACCESS_COOKIE)?.value;
  const roleCookie = req.cookies.get(ROLE_COOKIE)?.value as
    | UserRole
    | undefined;

  const isAuthenticated = Boolean(accessToken);
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));

  // 1) If authenticated and hitting /login or /register → redirect to role home.
  if (isAuthRoute && isAuthenticated) {
    const target = homeRouteForRole(roleCookie);
    return NextResponse.redirect(new URL(target, req.url));
  }

  // 2) Protected areas: check login + role.
  const matched = PROTECTED_PREFIXES.find((p) => pathname.startsWith(p.prefix));

  if (matched) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("next", pathname + search);
      return NextResponse.redirect(loginUrl);
    }

    if (!roleCookie || !matched.roles.includes(roleCookie)) {
      // Wrong role → bounce to their own home (or login if unknown role).
      const target = homeRouteForRole(roleCookie ?? null);
      return NextResponse.redirect(new URL(target, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware only on protected + auth routes — nothing else.
  matcher: [
    "/admin/:path*",
    "/provider/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
