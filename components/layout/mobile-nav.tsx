"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Brand } from "@/components/layout/brand";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          "md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md",
          "text-muted-foreground hover:bg-accent hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "transition-colors"
        )}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>

      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b px-5 py-4 text-left">
          <SheetTitle className="flex items-center">
            <Brand />
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 p-3">
          {items.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                "text-muted-foreground hover:bg-accent hover:text-foreground",
                "transition-colors"
              )}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              {label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}