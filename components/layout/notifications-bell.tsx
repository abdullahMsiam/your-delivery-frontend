"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useUnreadCount } from "@/src/features/notifications/hooks/use-notifications";
import { useRole } from "@/src/hooks/useAuth";
import { cn } from "@/lib/utils";

const HREF_BY_ROLE: Record<string, string> = {
  CUSTOMER: "/dashboard/notifications",
  AGENT: "/provider/notifications",
  ADMIN: "/admin/notifications",
};

export function NotificationsBell() {
  const { data: unread = 0 } = useUnreadCount();
  const role = useRole();
  const hasUnread = unread > 0;
  const href = role ? (HREF_BY_ROLE[role] ?? "/") : "/";

  return (
    <Link
      href={href}
      aria-label={
        hasUnread ? `${unread} unread notifications` : "Notifications"
      }
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-md",
        "text-muted-foreground hover:bg-accent hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "transition-colors",
      )}
    >
      <Bell className="h-5 w-5" />
      {hasUnread && (
        <span
          className={cn(
            "absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full",
            "bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground",
            "ring-2 ring-background",
          )}
        >
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </Link>
  );
}
