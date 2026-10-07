"use client";

import { useMemo } from "react";
import {
  CheckCircle2,
  CircleDollarSign,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatsSkeleton, CardSkeleton } from "@/components/shared/skeletons";
import { DeliveriesOverTimeChart } from "@/src/features/agent/components/charts/deliveries-over-time-chart";
import { StatusBreakdownChart } from "@/src/features/agent/components/charts/status-breakdown-chart";
import { PaymentSplitChart } from "@/src/features/agent/components/charts/payment-split-chart";
import { useAgentStatistics } from "@/src/features/agent/hooks/use-agent-statistics";
import { useAgentDeliveries } from "@/src/features/agent/hooks/use-agent-deliveries";
import { formatCurrency } from "@/lib/format";

export default function AgentEarningsPage() {
  return (
    <RoleGuard allow={[UserRole.AGENT]}>
      <EarningsContent />
    </RoleGuard>
  );
}

function EarningsContent() {
  const stats = useAgentStatistics();
  const list = useAgentDeliveries({ page: 1, limit: 50 });

  const deliveries = list.data?.data ?? [];

  /* -------------------------- Computed metrics -------------------------- */
  const metrics = useMemo(() => {
    const delivered = deliveries.filter((d) => d.status === "DELIVERED");

    // "Earnings" = deliveryCharge of delivered parcels + COD amounts (money you handled)
    const chargeSum = delivered.reduce(
      (sum, d) => sum + Number(d.deliveryCharge ?? 0),
      0,
    );
    const codCollected = delivered
      .filter(
        (d) =>
          d.payment?.method === "COD" &&
          d.payment?.status === "PAID" &&
          Number(d.codAmount) > 0,
      )
      .reduce((sum, d) => sum + Number(d.codAmount ?? 0), 0);

    const paidOnline = delivered
      .filter((d) => d.payment?.status === "PAID")
      .reduce((sum, d) => sum + Number(d.payment?.amount ?? 0), 0);

    return {
      deliveredCount: delivered.length,
      chargeSum,
      codCollected,
      paidOnline,
      totalPotential: chargeSum + codCollected,
    };
  }, [deliveries]);

  /* ------------------------------ Loading ------------------------------ */
  const isLoading = stats.isLoading || list.isLoading;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Earnings & performance
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A breakdown of your deliveries, earnings, and trends.
        </p>
      </div>

      {/* Stat cards */}
      {isLoading ? (
        <StatsSkeleton count={3} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={CheckCircle2}
            label="Delivered"
            value={metrics.deliveredCount}
            hint={`${stats.data?.completedDeliveries ?? 0} completed total`}
            tone="success"
          />
          <StatCard
            icon={TrendingUp}
            label="Success rate"
            value={`${stats.data?.successRate ?? 0}%`}
            hint="Delivered vs failed"
            tone={
              (stats.data?.successRate ?? 0) >= 80
                ? "success"
                : (stats.data?.successRate ?? 0) >= 50
                  ? "warning"
                  : "default"
            }
          />
          <StatCard
            icon={CircleDollarSign}
            label="Delivery charges"
            value={formatCurrency(metrics.chargeSum)}
            hint="On delivered parcels"
            tone="primary"
          />
        </div>
      )}

      {/* Charts row 1 */}
      {isLoading ? (
        <CardSkeleton />
      ) : (
        <DeliveriesOverTimeChart deliveries={deliveries} days={30} />
      )}

      {/* Charts row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {isLoading || !stats.data ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <StatusBreakdownChart statistics={stats.data} />
            <PaymentSplitChart deliveries={deliveries} />
          </>
        )}
      </div>

      {/* Note on interpretation */}
      <Card className="rounded-2xl border-dashed border-border/60 bg-muted/20">
        <CardContent className="p-5 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">How these numbers work</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>
              <strong>Delivery charges</strong> — sum of delivery charges on
              delivered parcels (your gross handled value).
            </li>
            <li>
              <strong>Cash collected</strong> — COD amounts marked as paid on
              delivered parcels (money you physically handled).
            </li>
            <li>
              <strong>Success rate</strong> — delivered divided by delivered +
              failed.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
