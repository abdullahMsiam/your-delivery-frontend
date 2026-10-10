"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Package,
  Plus,
  TrendingUp,
  Truck,
} from "lucide-react";

import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatsSkeleton, TableSkeleton } from "@/components/shared/skeletons";
import {
  DeliveryAmountCell,
  DeliveryIdentityCell,
  DeliveryRouteCell,
  DeliveryStatusCell,
} from "@/src/features/deliveries/components/delivery-row-cells";
import { useAgentStatistics } from "@/src/features/agent/hooks/use-agent-statistics";
import { useAgentDeliveries } from "@/src/features/agent/hooks/use-agent-deliveries";
import type { Delivery, DeliveryStatus } from "@/src/types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const ACTIVE_STATUSES: DeliveryStatus[] = [
  "ASSIGNED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
];

export default function AgentDashboardPage() {
  return (
    <RoleGuard allow={[UserRole.AGENT]}>
      <Dashboard />
    </RoleGuard>
  );
}

function Dashboard() {
  const stats = useAgentStatistics();
  const recent = useAgentDeliveries({ page: 1, limit: 50 });

  const router = useRouter(); 

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

  const recentFive = (recent.data?.data ?? []).slice(0, 5);

  function computeSuccessRate(stats: {
    delivered?: number;
    completedDeliveries?: number;
  }) {
    const delivered = stats.delivered ?? 0;
    const completed = stats.completedDeliveries ?? delivered;
    if (completed === 0) return 0;
    return (delivered / completed) * 100;
  }

  return (
    <div className="space-y-8">
      {/* ------------------------------ Header ---------------------------- */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Agent overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your assigned deliveries and performance at a glance.
          </p>
        </div>

        <Link
          href="/provider/deliveries"
          className={cn(buttonVariants(), "gap-2")}
        >
          <Truck className="h-4 w-4" />
          View all tasks
        </Link>
      </div>

      {/* ------------------------------ Stats ----------------------------- */}
      {stats.isLoading ? (
        <StatsSkeleton count={4} />
      ) : stats.isError ? (
        <ErrorBlock onRetry={stats.refetch} />
      ) : stats.data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Package}
            label="Total assigned"
            value={stats.data.totalAssigned}
            tone="primary"
          />
          <StatCard
            icon={Clock}
            label="Active now"
            value={stats.data.activeDeliveries}
            tone="warning"
          />
          <StatCard
            icon={CheckCircle2}
            label="Delivered"
            value={stats.data.delivered}
            tone="success"
          />
          <StatCard
            icon={TrendingUp}
            label="Success rate"
            value={`${stats.data.successRate}%`}
            hint={
              stats.data.completedDeliveries > 0
                ? `${stats.data.completedDeliveries} completed`
                : "No deliveries yet"
            }
            tone={
              stats.data.completedDeliveries === 0
                ? "default"
                : stats.data.successRate >= 80
                  ? "success"
                  : stats.data.successRate >= 50
                    ? "warning"
                    : "danger"
            }
          />
        </div>
      ) : null}

      {/* --------------------- Status breakdown bar ---------------------- */}
      {stats.data && stats.data.totalAssigned > 0 && (
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Breakdown by status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Assigned", value: stats.data.statusBreakdown.assigned },
              {
                label: "Picked up",
                value: stats.data.statusBreakdown.pickedUp,
              },
              {
                label: "In transit",
                value: stats.data.statusBreakdown.inTransit,
              },
              {
                label: "Out for delivery",
                value: stats.data.statusBreakdown.outForDelivery,
              },
              { label: "Delivered", value: stats.data.delivered },
              { label: "Failed", value: stats.data.failed },
              { label: "Cancelled", value: stats.data.cancelled },
            ]
              .filter((r) => r.value > 0)
              .map((row) => {
                const pct =
                  stats.data!.totalAssigned === 0
                    ? 0
                    : Math.round((row.value / stats.data!.totalAssigned) * 100);
                return (
                  <div key={row.label} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="font-medium">
                        {row.value} · {pct}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      )}

      {/* -------------------------- Recent tasks ------------------------- */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base">Recent tasks</CardTitle>
          <Link
            href="/provider/deliveries"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>

        <CardContent className="pt-0">
          {recent.isLoading ? (
            <TableSkeleton rows={5} columns={4} />
          ) : recent.isError ? (
            <ErrorBlock onRetry={recent.refetch} />
          ) : recentFive.length === 0 ? (
            <EmptyState
              icon={Truck}
              title="No deliveries assigned yet"
              description="New assignments will show up here when an admin assigns them to you."
            />
          ) : (
            <DataTable<Delivery>
              rows={recentFive}
              columns={columns}
              getRowKey={(d) => d.id}
              onRowClick={(d) => router.push(`/provider/deliveries/${d.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ErrorBlock({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm">
        <p className="font-medium text-destructive">Couldn`t load data</p>
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
