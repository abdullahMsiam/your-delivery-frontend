"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Package, Truck, Users } from "lucide-react";

import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { DeliveryStatusBadge } from "@/components/shared/status-badge";
import { RoleBadge } from "@/components/shared/role-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import {
  StatsSkeleton,
  CardSkeleton,
  TableSkeleton,
} from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";
import { AdminStatusChart } from "@/src/features/admin/components/charts/admin-status-chart";
import { UsersSummaryCard } from "@/src/features/admin/components/users-summary-card";
import { PaymentSplitChart } from "@/src/features/agent/components/charts/payment-split-chart";
import { useAdminDashboard } from "@/src/features/admin/hooks/use-admin-dashboard";
import { formatCurrency, formatRelative } from "@/lib/format";
import type { Delivery, RecentDelivery, RecentUser, User } from "@/src/types";
import { RevenueCard } from "@/src/features/admin/components/revenue";

export default function AdminDashboardPage() {
  return (
    <RoleGuard allow={[UserRole.ADMIN]}>
      <DashboardContent />
    </RoleGuard>
  );
}

function DashboardContent() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Header />
        <StatsSkeleton count={4} />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CardSkeleton />
          </div>
          <CardSkeleton />
        </div>
        <TableSkeleton rows={5} columns={4} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-8">
        <Header />
        <Card className="rounded-2xl border-destructive/30">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-destructive font-medium">
              Couldn&apos;t load dashboard data
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ----------------------------- Derived rows ---------------------------- */

  const activeDeliveries =
    data.deliveries.pending +
    data.deliveries.assigned +
    data.deliveries.pickedUp +
    data.deliveries.inTransit +
    data.deliveries.outForDelivery;

  /* ----------------------------- Table columns --------------------------- */

  const recentDeliveryCols: Column<RecentDelivery>[] = [
    {
      key: "tracking",
      header: "Tracking ID",
      cell: (d) => (
        <span className="font-mono text-xs font-semibold">{d.trackingId}</span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      cell: (d) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-medium truncate">
            {d.customer.name}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {d.customer.phone}
          </span>
        </div>
      ),
      cellClassName: "hidden md:table-cell",
      headClassName: "hidden md:table-cell",
    },
    {
      key: "amount",
      header: "Amount",
      cell: (d) => (
        <span className="text-sm font-medium">
          {formatCurrency(d.deliveryCharge)}
        </span>
      ),
      cellClassName: "hidden sm:table-cell",
      headClassName: "hidden sm:table-cell",
    },
    {
      key: "status",
      header: "Status",
      cell: (d) => <DeliveryStatusBadge status={d.status} />,
    },
    {
      key: "created",
      header: "Created",
      cell: (d) => (
        <span className="text-xs text-muted-foreground">
          {formatRelative(d.createdAt)}
        </span>
      ),
      cellClassName: "hidden lg:table-cell",
      headClassName: "hidden lg:table-cell",
    },
  ];

  return (
    <div className="space-y-8">
      <Header />

      {/* Top stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Package}
          label="Total deliveries"
          value={data.deliveries.total}
          hint={`${data.deliveries.delivered} delivered`}
          tone="primary"
        />
        <StatCard
          icon={Truck}
          label="Active"
          value={activeDeliveries}
          hint="In the pipeline"
          tone="warning"
        />
        <StatCard
          icon={Users}
          label="Total users"
          value={data.users.totalCustomers + data.users.totalAgents}
          hint={`${data.users.totalCustomers} customers · ${data.users.totalAgents} agents`}
          tone="default"
        />
        <StatCard
          icon={CheckCircle2}
          label="Success rate"
          value={
            data.deliveries.delivered + data.deliveries.failed === 0
              ? "—"
              : `${Math.round(
                  (data.deliveries.delivered /
                    (data.deliveries.delivered + data.deliveries.failed)) *
                    100,
                )}%`
          }
          hint={`${data.deliveries.failed} failed`}
          tone="success"
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AdminStatusChart deliveries={data.deliveries} />
        </div>
        <PaymentSplitChart deliveries={data.recentDeliveries} />
      </div>

      {/* Revenue + Users summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueCard revenue={data.revenue} payments={data.payments} />
        <UsersSummaryCard users={data.users} />
      </div>

      {/* Two-column: recent deliveries + recent users */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base">Recent deliveries</CardTitle>
            <Link
              href="/admin/deliveries"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            {data.recentDeliveries.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No deliveries yet
              </p>
            ) : (
              <DataTable<RecentDelivery>
                rows={data.recentDeliveries}
                columns={recentDeliveryCols}
                getRowKey={(d) => d.id}
                onRowClick={(d) => router.push(`/admin/deliveries/${d.id}`)}
              />
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base">Recent users</CardTitle>
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            {data.recentUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No users yet
              </p>
            ) : (
              <ul className="space-y-3">
                {data.recentUsers.map((u: RecentUser) => (
                  <li key={u.id} className="flex items-center gap-3">
                    <UserAvatar name={u.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {u.email}
                      </p>
                    </div>
                    <RoleBadge role={u.role} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Admin dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Operations, revenue, and user activity at a glance.
      </p>
    </div>
  );
}
