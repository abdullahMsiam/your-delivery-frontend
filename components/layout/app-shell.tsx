"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  Truck,
  Wallet,
} from "lucide-react";
import { AppNavbar } from "@/components/layout/app-navbar";
import type { NavItem } from "@/components/layout/mobile-nav";
import { useRole } from "@/src/hooks/useAuth";

const NAV: Record<string, NavItem[]> = {
  CUSTOMER: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/deliveries", label: "Deliveries", icon: Package },
    { href: "/dashboard/payments", label: "Payments", icon: Wallet },
    { href: "/dashboard/profile", label: "Profile", icon: Settings },
  ],
  AGENT: [
    { href: "/provider", label: "Overview", icon: LayoutDashboard },
    { href: "/provider/deliveries", label: "Assigned", icon: Truck },
    { href: "/provider/earnings", label: "Earnings", icon: Wallet },
    { href: "/provider/profile", label: "Profile", icon: Settings },
  ],
  ADMIN: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/deliveries", label: "Deliveries", icon: Package },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/reports", label: "Reports", icon: Settings },
  ],
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const role = useRole();
  const items = role ? NAV[role] : [];

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <AppNavbar items={items} />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          {children}
        </div>
      </main>

      <footer className="border-t border-border/60 bg-background/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} Your Delivery</span>
          <span className="flex items-center gap-4">
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Contact
            </Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
