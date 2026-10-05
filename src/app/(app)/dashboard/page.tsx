"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  CircleDollarSign,
  Clock,
  Package,
  PackageCheck,
  Plus,
} from "lucide-react";

import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatsSkeleton, TableSkeleton } from "@/components/shared/skeletons";

import type { Delivery, DeliveryStatus } from "@/src/types";
import { cn } from "@/lib/utils";
import { useMyDeliveries } from "@/src/features/deliveries/hooks/use-my-deliveries";
import {
  DeliveryAmountCell,
  DeliveryIdentityCell,
  DeliveryRouteCell,
  DeliveryStatusCell,
} from "@/src/features/deliveries/components/delivery-row-cells";

const ACTIVE_STATUSES: DeliveryStatus[] = [
  "PENDING",
  "ASSIGNED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
];

export default function CustomerDashboardPage() {
  return (
    <RoleGuard allow={[UserRole.CUSTOMER]}>
      <Dashboard />
    </RoleGuard>
  );
}

function Dashboard() {
  // For stat aggregation we ask for a generous page so we can compute counts
  // locally. If you have >50 deliveries, add a dedicated summary endpoint.
  const { data, isLoading, isError, refetch } = useMyDeliveries({
    page: 1,
    limit: 50,
  });

  const stats = useMemo(() => {
    const items = data?.data ?? [];
    const active = items.filter((d) => ACTIVE_STATUSES.includes(d.status));
    const delivered = items.filter((d) => d.status === "DELIVERED");
    const totalSpent = items
      .filter((d) => d.payment?.status === "PAID")
      .reduce((sum, d) => sum + Number(d.payment?.amount ?? 0), 0);
    return {
      total: items.length,
      active: active.length,
      delivered: delivered.length,
      totalSpent,
    };
  }, [data]);

  const recent = (data?.data ?? []).slice(0, 5);

  const columns: Column<Delivery>[] = [
    {
      key: "identity",
      header: "Delivery",
      cell: (d) => <DeliveryIdentityCell delivery={d} />,
      cellClassName: "min-w-[140px]",
    },
    {
      key: "route",
      header: "Route",
      cell: (d) => <DeliveryRouteCell delivery={d} />,
      cellClassName: "min-w-[180px] hidden md:table-cell",
      headClassName: "hidden md:table-cell",
    },
    {
      key: "amount",
      header: "Amount",
      cell: (d) => <DeliveryAmountCell delivery={d} />,
      cellClassName: "min-w-[120px] hidden sm:table-cell",
      headClassName: "hidden sm:table-cell",
    },
    {
      key: "status",
      header: "Status",
      cell: (d) => <DeliveryStatusCell delivery={d} />,
      cellClassName: "min-w-[140px]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* ------------------------------ Header ------------------------------ */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A snapshot of your delivery activity.
          </p>
        </div>

        <Link
          href="/dashboard/deliveries/new"
          className={cn(buttonVariants(), "gap-2")}
        >
          <Plus className="h-4 w-4" />
          New delivery
        </Link>
      </div>

      {/* ------------------------------ Stats ------------------------------- */}
      {isLoading ? (
        <StatsSkeleton count={4} />
      ) : isError ? (
        <ErrorBlock onRetry={refetch} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Package}
            label="Total deliveries"
            value={stats.total}
            tone="primary"
          />
          <StatCard
            icon={Clock}
            label="In progress"
            value={stats.active}
            tone="warning"
          />
          <StatCard
            icon={PackageCheck}
            label="Delivered"
            value={stats.delivered}
            tone="success"
          />
          <StatCard
            icon={CircleDollarSign}
            label="Total spent"
            value={`$${stats.totalSpent.toFixed(2)}`}
            hint="Paid deliveries only"
            tone="default"
          />
        </div>
      )}

      {/* ---------------------- Recent deliveries table --------------------- */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base">Recent deliveries</CardTitle>
          <Link
            href="/dashboard/deliveries"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>

        <CardContent className="pt-0">
          {isLoading ? (
            <TableSkeleton rows={5} columns={4} />
          ) : isError ? (
            <ErrorBlock onRetry={refetch} />
          ) : recent.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No deliveries yet"
              description="Once you book your first delivery, it will appear here."
              action={{
                label: "Create a delivery",
                href: "/dashboard/deliveries/new",
              }}
            />
          ) : (
            <DataTable<Delivery>
              rows={recent}
              columns={columns}
              getRowKey={(d) => d.id}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Error block                                 */
/* -------------------------------------------------------------------------- */

function ErrorBlock({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm">
        <p className="font-medium text-destructive">Couldn`t load deliveries</p>
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
