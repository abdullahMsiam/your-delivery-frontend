"use client";

import { useRouter } from "next/navigation";
import { PackageSearch, Package } from "lucide-react";

import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/skeletons";
import { DeliveryStatusBadge } from "@/components/shared/status-badge";
import { AdminDeliveryFilters } from "@/src/features/admin/components/admin-delivery-filters";
import { useAdminDeliveries } from "@/src/features/admin/hooks/use-admin-deliveries";
import { useSearchParamsState } from "@/src/hooks/use-search-params-state";
import { formatCurrency, formatRelative } from "@/lib/format";
import type { Delivery } from "@/src/types";

export default function AdminDeliveriesPage() {
  return (
    <RoleGuard allow={[UserRole.ADMIN]}>
      <AdminDeliveriesList />
    </RoleGuard>
  );
}

const DEFAULTS: Record<string, string> = {
  page: "1",
  limit: "10",
  status: "",
  trackingId: "",
  customerId: "",
  agentId: "",
  dateFrom: "",
  dateTo: "",
};

function AdminDeliveriesList() {
  const router = useRouter();
  const [filters, setFilters] = useSearchParamsState(DEFAULTS);

  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(filters.limit) || 10));

  const { data, isLoading, isError, refetch } = useAdminDeliveries({
    page,
    limit,
    status: filters.status || undefined,
    trackingId: filters.trackingId || undefined,
    customerId: filters.customerId || undefined,
    agentId: filters.agentId || undefined,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
  });

  const deliveries = data?.data ?? [];
  const pagination = data?.pagination;
  const hasFilters = Boolean(
    filters.status ||
    filters.trackingId ||
    filters.customerId ||
    filters.agentId ||
    filters.dateFrom ||
    filters.dateTo,
  );

  const columns: Column<Delivery>[] = [
    {
      key: "identity",
      header: "Tracking",
      cell: (d) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="font-mono text-xs font-semibold truncate">
            {d.trackingId}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {d.parcelType} · {Number(d.weight).toFixed(2)} kg
          </span>
        </div>
      ),
      cellClassName: "min-w-[150px]",
    },
    {
      key: "route",
      header: "Route",
      cell: (d) => (
        <span className="text-xs text-muted-foreground">
          {d.pickupAddress.city} → {d.deliveryAddress.city}
        </span>
      ),
      cellClassName: "hidden md:table-cell",
      headClassName: "hidden md:table-cell",
    },
    {
      key: "customer",
      header: "Customer",
      cell: (d) =>
        d.customer ? (
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-medium truncate">
              {d.customer.name}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {d.customer.phone}
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
      cellClassName: "hidden lg:table-cell",
      headClassName: "hidden lg:table-cell",
    },
    {
      key: "agent",
      header: "Agent",
      cell: (d) =>
        d.agent ? (
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-medium truncate">{d.agent.name}</span>
            <span className="text-xs text-muted-foreground truncate">
              {d.agent.phone}
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Unassigned</span>
        ),
      cellClassName: "hidden xl:table-cell",
      headClassName: "hidden xl:table-cell",
    },
    {
      key: "amount",
      header: "Charge",
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
      cell: (d) => (
        <div className="flex flex-col gap-1 items-start">
          <DeliveryStatusBadge status={d.status} />
          <span className="text-xs text-muted-foreground">
            {formatRelative(d.createdAt)}
          </span>
        </div>
      ),
      cellClassName: "min-w-[130px]",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          All deliveries
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search, filter, and manage every delivery across the network.
        </p>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminDeliveryFilters
            values={{
              trackingId: filters.trackingId,
              status: filters.status,
              customerId: filters.customerId,
              agentId: filters.agentId,
              dateFrom: filters.dateFrom,
              dateTo: filters.dateTo,
            }}
            onChange={(patch) => setFilters(patch)}
            onClear={() =>
              setFilters({
                status: "",
                trackingId: "",
                customerId: "",
                agentId: "",
                dateFrom: "",
                dateTo: "",
              })
            }
          />
        </CardContent>
      </Card>

      {/* List */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="pt-6">
          {isLoading ? (
            <TableSkeleton rows={6} columns={6} />
          ) : isError ? (
            <ErrorBlock onRetry={refetch} />
          ) : deliveries.length === 0 && hasFilters ? (
            <EmptyState
              icon={PackageSearch}
              title="No deliveries match your filters"
              description="Try adjusting the search or clearing the filters."
              className="border-none bg-transparent"
            />
          ) : deliveries.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No deliveries yet"
              description="Once customers start booking, deliveries will appear here."
              className="border-none bg-transparent"
            />
          ) : (
            <>
              <DataTable<Delivery>
                rows={deliveries}
                columns={columns}
                getRowKey={(d) => d.id}
                onRowClick={(d) => router.push(`/admin/deliveries/${d.id}`)}
              />
              {pagination && (
                <Pagination pagination={pagination} className="mt-4" />
              )}
            </>
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
