"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Plus, PackageSearch } from "lucide-react";

import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/skeletons";
import {
  DeliveryAmountCell,
  DeliveryIdentityCell,
  DeliveryRouteCell,
  DeliveryStatusCell,
} from "@/src/features/deliveries/components/delivery-row-cells";
import { DeliveryFilters } from "@/src/features/deliveries/components/delivery-filters";
import { useMyDeliveries } from "@/src/features/deliveries/hooks/use-my-deliveries";
import { useSearchParamsState } from "@/src/hooks/use-search-params-state";
import type { Delivery } from "@/src/types";
import { cn } from "@/lib/utils";

export default function DeliveriesPage() {
  return (
    <RoleGuard allow={[UserRole.CUSTOMER]}>
      <DeliveriesList />
    </RoleGuard>
  );
}

const DEFAULT_PARAMS: Record<string, string> = {
  page: "1",
  limit: "10",
  status: "",
  trackingId: "",
};

function DeliveriesList() {
  const router = useRouter();

  const [filters, setFilters] = useSearchParamsState({
    page: DEFAULT_PARAMS.page,
    limit: DEFAULT_PARAMS.limit,
    status: DEFAULT_PARAMS.status,
    trackingId: DEFAULT_PARAMS.trackingId,
  });

  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(filters.limit) || 10));

  const { data, isLoading, isError, refetch } = useMyDeliveries({
    page,
    limit,
    status: filters.status || undefined,
    trackingId: filters.trackingId || undefined,
  });

  const deliveries = data?.data ?? [];
  const pagination = data?.pagination;
  const hasActiveFilters = Boolean(filters.status || filters.trackingId);

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
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Deliveries</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All your deliveries, filterable and searchable.
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

      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <DeliveryFilters
            trackingId={filters.trackingId}
            status={filters.status}
            onTrackingIdChange={(v: string) => setFilters({ trackingId: v })}
            onStatusChange={(v: string) => setFilters({ status: v })}
            onClear={() => setFilters({ status: "", trackingId: "" })}
          />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="pt-6">
          {isLoading ? (
            <TableSkeleton rows={5} columns={4} />
          ) : isError ? (
            <ErrorBlock onRetry={refetch} />
          ) : deliveries.length === 0 && hasActiveFilters ? (
            <EmptyState
              icon={PackageSearch}
              title="No deliveries match your filters"
              description="Try adjusting your search or clearing the filters."
              className="border-none bg-transparent"
            />
          ) : deliveries.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No deliveries yet"
              description="Book your first delivery to see it here."
              action={{
                label: "Create a delivery",
                href: "/dashboard/deliveries/new",
              }}
              className="border-none bg-transparent"
            />
          ) : (
            <>
              <DataTable<Delivery>
                rows={deliveries}
                columns={columns}
                getRowKey={(d) => d.id}
                onRowClick={(d) => router.push(`/dashboard/deliveries/${d.id}`)}
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
