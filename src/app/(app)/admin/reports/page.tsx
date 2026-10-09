"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Package,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react";

import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatCard } from "@/components/shared/stat-card";
import { StatsSkeleton, CardSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { UserAvatar } from "@/components/shared/user-avatar";
import { MonthlyRevenueChart } from "@/src/features/admin/components/charts/monthly-revenue-chart";
import { useAdminDeliveries } from "@/src/features/admin/hooks/use-admin-deliveries";
import {
  aggregateTopAgents,
  aggregateTopCustomers,
  computeSummary,
} from "@/src/features/admin/lib/aggregate";
import { useSearchParamsState } from "@/src/hooks/use-search-params-state";
import { formatCurrency } from "@/lib/format";
import { downloadCsv, toCsv } from "@/lib/csv";
import type { Delivery } from "@/src/types";
import { toast } from "sonner";

export default function AdminReportsPage() {
  return (
    <RoleGuard allow={[UserRole.ADMIN]}>
      <ReportsContent />
    </RoleGuard>
  );
}

const DEFAULTS: Record<string, string> = {
  dateFrom: "",
  dateTo: "",
};

function ReportsContent() {
  const [filters, setFilters] = useSearchParamsState(DEFAULTS);

  // Fetch a large page for aggregation. Backend caps at 50 per request.
  const { data, isLoading, isError, refetch } = useAdminDeliveries({
    page: 1,
    limit: 50,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
  });

  const deliveries = data?.data ?? [];

  const summary = React.useMemo(() => computeSummary(deliveries), [deliveries]);
  const topCustomers = React.useMemo(
    () => aggregateTopCustomers(deliveries, 5),
    [deliveries],
  );
  const topAgents = React.useMemo(
    () => aggregateTopAgents(deliveries, 5),
    [deliveries],
  );

  /* ------------------------------ CSV export ---------------------------- */
  function handleExport() {
    if (deliveries.length === 0) {
      toast.error("Nothing to export");
      return;
    }
    const csv = toCsv<Delivery>(deliveries, [
      { key: "trackingId", header: "Tracking ID" },
      { key: "status", header: "Status" },
      { key: "parcelType", header: "Parcel Type" },
      {
        key: "weight",
        header: "Weight (kg)",
        format: (v) => Number(v).toFixed(2),
      },
      {
        key: "deliveryCharge",
        header: "Delivery Charge",
        format: (v) => Number(v).toFixed(2),
      },
      {
        key: "codAmount",
        header: "COD Amount",
        format: (v) => Number(v).toFixed(2),
      },
      {
        key: "pickupAddress",
        header: "Pickup City",
        format: (_v, row) => row.pickupAddress.city,
      },
      {
        key: "deliveryAddress",
        header: "Delivery City",
        format: (_v, row) => row.deliveryAddress.city,
      },
      {
        key: "customer",
        header: "Customer",
        format: (_v, row) => row.customer?.name ?? "—",
      },
      {
        key: "agent",
        header: "Agent",
        format: (_v, row) => row.agent?.name ?? "Unassigned",
      },
      {
        key: "payment",
        header: "Payment Method",
        format: (_v, row) => row.payment?.method ?? "—",
      },
      {
        key: "payment",
        header: "Payment Status",
        format: (_v, row) => row.payment?.status ?? "—",
      },
      {
        key: "createdAt",
        header: "Created At",
        format: (v) => new Date(String(v)).toISOString(),
      },
    ]);

    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`deliveries-${stamp}.csv`, csv);
    toast.success(`Exported ${deliveries.length} rows`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Aggregated analytics and CSV export for the selected date range.
          </p>
        </div>

        <Button
          onClick={handleExport}
          disabled={deliveries.length === 0}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Date range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="dateFrom" className="text-xs">
                From
              </Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ dateFrom: e.target.value })}
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dateTo" className="text-xs">
                To
              </Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ dateTo: e.target.value })}
                className="h-10"
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="ghost"
                onClick={() => setFilters({ dateFrom: "", dateTo: "" })}
                disabled={!filters.dateFrom && !filters.dateTo}
              >
                Clear range
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading / error */}
      {isLoading ? (
        <>
          <StatsSkeleton count={4} />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CardSkeleton />
            </div>
            <CardSkeleton />
          </div>
        </>
      ) : isError ? (
        <Card className="rounded-2xl border-destructive/30">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-destructive font-medium">
              Couldn&apos;t load report data
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : deliveries.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No data in this range"
          description="Try adjusting the date range or clearing the filters."
        />
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Package}
              label="Deliveries"
              value={summary.total}
              tone="primary"
            />
            <StatCard
              icon={CheckCircle2}
              label="Delivered"
              value={summary.delivered}
              hint={`${Math.round((summary.delivered / summary.total) * 100)}% of total`}
              tone="success"
            />
            <StatCard
              icon={TrendingUp}
              label="Revenue"
              value={formatCurrency(summary.revenue)}
              hint="Paid payments only"
              tone="primary"
            />
            <StatCard
              icon={summary.cancelRate > 15 ? TrendingDown : XCircle}
              label="Cancellation"
              value={`${summary.cancelRate.toFixed(1)}%`}
              hint={`${summary.cancelled} cancelled`}
              tone={summary.cancelRate > 15 ? "danger" : "default"}
            />
          </div>

          {/* Revenue chart + edge stats */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <MonthlyRevenueChart deliveries={deliveries} />
            </div>

            <Card className="rounded-2xl border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Edge cases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <EdgeRow
                  label="Failed deliveries"
                  value={summary.failed}
                  tone={summary.failed > 0 ? "danger" : "default"}
                />
                <EdgeRow
                  label="Cancelled"
                  value={summary.cancelled}
                  tone={summary.cancelled > 0 ? "warning" : "default"}
                />
                <EdgeRow
                  label="Delivered"
                  value={summary.delivered}
                  tone="success"
                />
                <div className="pt-2 border-t border-border/60">
                  <EdgeRow
                    label="Total"
                    value={summary.total}
                    tone="default"
                    emphasize
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top customers + top agents */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="rounded-2xl border-border/60 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base">Top customers</CardTitle>
                <Link
                  href="/admin/users?role=CUSTOMER"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Manage
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </CardHeader>
              <CardContent className="pt-0">
                {topCustomers.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No customer data in range
                  </p>
                ) : (
                  <ul className="divide-y divide-border/60">
                    {topCustomers.map((c, i) => (
                      <li key={c.id} className="flex items-center gap-3 py-3">
                        <span className="w-5 text-xs font-medium text-muted-foreground">
                          #{i + 1}
                        </span>
                        <UserAvatar name={c.name} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {c.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {c.phone}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{c.deliveries}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(c.spent)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base">Top agents</CardTitle>
                <Link
                  href="/admin/users?role=AGENT"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Manage
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </CardHeader>
              <CardContent className="pt-0">
                {topAgents.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No agent data in range
                  </p>
                ) : (
                  <ul className="divide-y divide-border/60">
                    {topAgents.map((a, i) => (
                      <li key={a.id} className="flex items-center gap-3 py-3">
                        <span className="w-5 text-xs font-medium text-muted-foreground">
                          #{i + 1}
                        </span>
                        <UserAvatar name={a.name} size="sm" />
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/admin/agents/${a.id}`}
                            className="text-sm font-medium truncate hover:text-primary hover:underline"
                          >
                            {a.name}
                          </Link>
                          <p className="text-xs text-muted-foreground truncate">
                            {a.phone}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{a.deliveries}</p>
                          <p className="text-xs text-muted-foreground">
                            {a.delivered}✓ · {a.failed}✗
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Range info */}
          <p className="text-xs text-muted-foreground text-center pt-2">
            Showing data from {deliveries.length} deliveries
            {data?.pagination.total && data.pagination.total > deliveries.length
              ? ` (limited to ${deliveries.length} of ${data.pagination.total})`
              : ""}
          </p>
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Sub-components                                */
/* -------------------------------------------------------------------------- */

function EdgeRow({
  label,
  value,
  tone = "default",
  emphasize = false,
}: {
  label: string;
  value: number;
  tone?: "default" | "success" | "warning" | "danger";
  emphasize?: boolean;
}) {
  const toneClass = {
    default: "text-foreground",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    danger: "text-destructive",
  }[tone];

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("font-medium", toneClass, emphasize && "text-lg")}>
        {value}
      </span>
    </div>
  );
}

// Tiny import alias so we don't forget it
import { cn } from "@/lib/utils";
