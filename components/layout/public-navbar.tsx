"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Container } from "@/components/shared/container";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { homeRouteForRole } from "@/lib/routes";
import { useIsAuthenticated, useRole } from "@/src/hooks/useAuth";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/track", label: "Track" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const authed = useIsAuthenticated();
  const role = useRole();
  const dashboardHref = homeRouteForRole(role);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center gap-6">
          <Brand />

          <nav className="hidden md:flex items-center gap-1 ml-4">
            {LINKS.map(({ href, label }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <ThemeToggle />

            {authed ? (
              <Link
                href={dashboardHref}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "hidden sm:inline-flex",
                )}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "hidden sm:inline-flex",
                  )}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "hidden sm:inline-flex",
                  )}
                >
                  Get started
                </Link>
              </>
            )}

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                className={cn(
                  "md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md",
                  "text-muted-foreground hover:bg-accent hover:text-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <SheetHeader className="border-b px-5 py-4 text-left">
                  <SheetTitle className="flex items-center">
                    <Brand />
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-1 p-3">
                  {LINKS.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      {label}
                    </Link>
                  ))}

                  <div className="mt-3 border-t pt-3 flex flex-col gap-2">
                    {authed ? (
                      <Link
                        href={dashboardHref}
                        onClick={() => setOpen(false)}
                        className={cn(buttonVariants())}
                      >
                        Go to dashboard
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setOpen(false)}
                          className={cn(buttonVariants({ variant: "outline" }))}
                        >
                          Sign in
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setOpen(false)}
                          className={cn(buttonVariants())}
                        >
                          Get started
                        </Link>
                      </>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
}
