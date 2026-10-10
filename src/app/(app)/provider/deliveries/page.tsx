"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Package, PackageSearch, Truck } from "lucide-react";

import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/skeletons";
import { DeliveryStatusBadge } from "@/components/shared/status-badge";
import { DeliveryRouteCell } from "@/src/features/deliveries/components/delivery-row-cells";
import { useAgentDeliveries } from "@/src/features/agent/hooks/use-agent-deliveries";
import { useSearchParamsState } from "@/src/hooks/use-search-params-state";
import { formatCurrency, formatRelative } from "@/lib/format";
import type { Delivery } from "@/src/types";
import { ViewDeliveryButton } from "@/src/features/deliveries/components/view-delivery-button";

export default function AgentDeliveriesPage() {
  return (
    <RoleGuard allow={[UserRole.AGENT]}>
      <AgentDeliveriesList />
    </RoleGuard>
  );
}

const DEFAULTS: Record<string, string> = {
  page: "1",
  limit: "10",
};

function AgentDeliveriesList() {
  const router = useRouter();
  const [filters, setFilters] = useSearchParamsState(DEFAULTS);

  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(filters.limit) || 10));

  const { data, isLoading, isError, refetch } = useAgentDeliveries({
    page,
    limit,
  });

  const deliveries = data?.data ?? [];
  const pagination = data?.pagination;

  const columns: Column<Delivery>[] = [
    {
      key: "identity",
      header: "Delivery",
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
      cellClassName: "min-w-[140px]",
    },
    {
      key: "route",
      header: "Route",
      cell: (d) => <DeliveryRouteCell delivery={d} />,
      cellClassName: "min-w-[200px] hidden md:table-cell",
      headClassName: "hidden md:table-cell",
    },
    {
      key: "customer",
      header: "Customer",
      cell: (d) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-medium truncate">
            {d.pickupAddress.name}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {d.pickupAddress.phone}
          </span>
        </div>
      ),
      cellClassName: "min-w-[160px] hidden lg:table-cell",
      headClassName: "hidden lg:table-cell",
    },
    {
      key: "amount",
      header: "Amount",
      cell: (d) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">
            {formatCurrency(d.deliveryCharge)}
          </span>
          <span className="text-xs text-muted-foreground">
            {d.payment?.method === "COD" ? "COD" : "Online"}
          </span>
        </div>
      ),
      cellClassName: "min-w-[100px] hidden sm:table-cell",
      headClassName: "hidden sm:table-cell",
    },
    {
      key: "status",
      header: "Status",
      cell: (d) => (
        <div className="flex flex-col gap-1 items-start">
          <DeliveryStatusBadge status={d.status} />
          <span className="text-xs text-muted-foreground">
            {formatRelative(d.updatedAt)}
          </span>
        </div>
      ),
      cellClassName: "min-w-[140px]",
    },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      cell: () => <ViewDeliveryButton />,
      headClassName: "text-right w-[1%]",
      cellClassName: "text-right w-[1%] whitespace-nowrap",
    },
  ];

  const hasAny = deliveries.length > 0;

  return (
    <div className="space-y-6">
      {/* ------------------------------ Header ---------------------------- */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Assigned deliveries
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every parcel assigned to you — sorted newest first.
          </p>
        </div>
      </div>

      {/* ------------------------------- List ------------------------------ */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Deliveries</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <TableSkeleton rows={5} columns={5} />
          ) : isError ? (
            <ErrorBlock onRetry={refetch} />
          ) : !hasAny ? (
            <EmptyState
              icon={Truck}
              title="No deliveries assigned"
              description="You don't have any parcels assigned right now. New ones will appear here automatically."
              className="border-none bg-transparent"
            />
          ) : (
            <>
              <DataTable<Delivery>
                rows={deliveries}
                columns={columns}
                getRowKey={(d) => d.id}
                onRowClick={(d) => router.push(`/provider/deliveries/${d.id}`)}
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
