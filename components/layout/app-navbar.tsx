"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "@/components/layout/brand";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { MobileNav, type NavItem } from "@/components/layout/mobile-nav";
import { cn } from "@/lib/utils";
import { NotificationsBell } from "@/components/layout/notifications-bell";

export function AppNavbar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b",
        "bg-background/70 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu */}
        <MobileNav items={items} />

        {/* Brand */}
        <Brand />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ml-6">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          <NotificationsBell/>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
