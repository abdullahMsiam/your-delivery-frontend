"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  DollarSign,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api/notifications";
import { queryKeys } from "@/lib/query-keys";
import { useNotifications } from "@/src/features/notifications/hooks/use-notifications";
import { useSearchParamsState } from "@/src/hooks/use-search-params-state";
import { formatRelative } from "@/lib/format";
import type { AppNotification, NotificationType } from "@/src/types";

export default function NotificationsPage() {
  return (
    <RoleGuard allow={[UserRole.CUSTOMER, UserRole.AGENT, UserRole.ADMIN]}>
      <NotificationsList />
    </RoleGuard>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Icon per type                                  */
/* -------------------------------------------------------------------------- */

const ICON_BY_TYPE: Record<
  NotificationType,
  React.ComponentType<{ className?: string }>
> = {
  DELIVERY_ASSIGNED: Truck,
  DELIVERY_STATUS_UPDATED: Package,
  DELIVERY_DELIVERED: CheckCircle2,
  DELIVERY_CANCELLED: XCircle,
  PAYMENT_PAID: DollarSign,
  PAYMENT_FAILED: XCircle,
  COD_PAYMENT_RECEIVED: DollarSign,
};

/* -------------------------------------------------------------------------- */
/*                                   List                                     */
/* -------------------------------------------------------------------------- */

const DEFAULTS = { page: "1", limit: "20" };

function NotificationsList() {
  const qc = useQueryClient();
  const [filters, setFilters] = useSearchParamsState(DEFAULTS);

  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(filters.limit) || 20));

  const { data, isLoading, isError, refetch } = useNotifications({
    page,
    limit,
  });

  const notifications = data?.data ?? [];
  const pagination = data?.pagination;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  /* ------------------------------ Mutations ------------------------------ */

  const markOne = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
    onError: () => toast.error("Couldn't mark as read"),
  });

  const markAll = useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: (count) => {
      toast.success(count > 0 ? `Marked ${count} as read` : "Nothing to mark");
      qc.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
    onError: () => toast.error("Couldn't mark all as read"),
  });

  /* -------------------------------- Render ------------------------------- */

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Updates about your deliveries and payments.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => markAll.mutate()}
          disabled={markAll.isPending || unreadCount === 0}
          className="gap-2"
        >
          <CheckCheck className="h-4 w-4" />
          {markAll.isPending ? "Marking…" : "Mark all as read"}
        </Button>
      </div>

      {/* List */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <ListSkeleton rows={5} />
          ) : isError ? (
            <ErrorBlock onRetry={refetch} />
          ) : notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You're all caught up. New updates will show up here."
              className="border-none bg-transparent my-6"
            />
          ) : (
            <>
              <ul className="divide-y divide-border/60">
                {notifications.map((n) => (
                  <NotificationRow
                    key={n.id}
                    notification={n}
                    onMarkRead={() => markOne.mutate(n.id)}
                    isMarking={markOne.isPending && markOne.variables === n.id}
                  />
                ))}
              </ul>

              {pagination && (
                <div className="px-6 pb-6 pt-2">
                  <Pagination pagination={pagination} />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Notification row                              */
/* -------------------------------------------------------------------------- */

function NotificationRow({
  notification,
  onMarkRead,
  isMarking,
}: {
  notification: AppNotification;
  onMarkRead: () => void;
  isMarking: boolean;
}) {
  const Icon = ICON_BY_TYPE[notification.type] ?? Bell;
  const unread = !notification.isRead;

  return (
    <li
      className={cn(
        "relative flex gap-4 px-6 py-5 transition-colors",
        unread && "bg-primary/5",
      )}
    >
      {/* Unread dot */}
      {unread && (
        <span
          aria-label="Unread"
          className="absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary"
        />
      )}

      {/* Icon */}
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          unread
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="h-4 w-4" />
      </span>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={cn("text-sm", unread ? "font-semibold" : "font-medium")}
          >
            {notification.title}
          </p>
          {unread && (
            <Badge variant="outline" className="text-[10px] py-0 h-5">
              New
            </Badge>
          )}
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground text-pretty">
          {notification.message}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatRelative(notification.createdAt)}
        </p>
      </div>

      {/* Action */}
      {unread && (
        <div className="shrink-0 self-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkRead}
            disabled={isMarking}
            className="text-xs"
          >
            {isMarking ? "…" : "Mark read"}
          </Button>
        </div>
      )}
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Sub-components                                */
/* -------------------------------------------------------------------------- */

function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <ul className="divide-y divide-border/60">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="flex gap-4 px-6 py-5">
          <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 rounded bg-muted animate-pulse" />
            <div className="h-3 w-full max-w-md rounded bg-muted animate-pulse" />
            <div className="h-3 w-20 rounded bg-muted animate-pulse" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function ErrorBlock({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="m-6 rounded-xl border border-destructive/30 bg-destructive/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm">
        <p className="font-medium text-destructive">
          Couldn`t load notifications
        </p>
        <p className="text-muted-foreground">
          Please check your connection and try again.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}
