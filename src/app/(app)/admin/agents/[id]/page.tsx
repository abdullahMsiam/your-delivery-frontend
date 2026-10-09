"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
  TrendingUp,
  ExternalLink,
} from "lucide-react";

import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { UserAvatar } from "@/components/shared/user-avatar";
import { RoleBadge } from "@/components/shared/role-badge";
import { StatsSkeleton, CardSkeleton } from "@/components/shared/skeletons";
import { StatusBreakdownChart } from "@/src/features/agent/components/charts/status-breakdown-chart";
import {
  useAdminAgent,
  useAdminAgentStatistics,
} from "@/src/features/admin/hooks/use-admin-agent-statistics";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function AdminAgentDetailPage() {
  return (
    <RoleGuard allow={[UserRole.ADMIN]}>
      <AgentDetail />
    </RoleGuard>
  );
}

function AgentDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const agent = useAdminAgent(id);
  const stats = useAdminAgentStatistics(id);

  const isLoading = agent.isLoading || stats.isLoading;
  const isError = agent.isError || stats.isError;

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to users
      </Link>

      {/* Error */}
      {isError && (
        <Card className="rounded-2xl border-destructive/30">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-destructive font-medium">
              Couldn&apos;t load agent data
            </p>
            <Button
              variant="outline"
              onClick={() => {
                agent.refetch();
                stats.refetch();
              }}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {isLoading && !isError && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <CardSkeleton />
            <div className="lg:col-span-2">
              <StatsSkeleton count={4} />
            </div>
          </div>
          <CardSkeleton />
        </div>
      )}

      {/* Content */}
      {!isLoading && !isError && agent.data && stats.data && (
        <>
          {/* Identity + Stats */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Identity card */}
            <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 px-6 py-8 border-b border-border/60">
                <div className="flex flex-col items-center text-center gap-3">
                  <UserAvatar
                    name={agent.data.name}
                    size="lg"
                    className="h-20 w-20 text-2xl"
                  />
                  <div>
                    <p className="text-lg font-semibold tracking-tight">
                      {agent.data.name}
                    </p>
                    <div className="mt-1 flex items-center justify-center gap-2">
                      <RoleBadge role={agent.data.role} />
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          agent.data.isActive
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {agent.data.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <InfoRow label="Email" value={agent.data.email} />
                <InfoRow label="Phone" value={agent.data.phone} mono />
                <InfoRow
                  label="Joined"
                  value={formatDate(agent.data.createdAt)}
                />

                <div className="pt-2">
                  <Link
                    href={`/admin/users`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "w-full gap-2",
                    )}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Manage in users
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Stats cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <StatCard
                  icon={Package}
                  label="Total assigned"
                  value={stats.data.statistics.totalAssigned}
                  tone="primary"
                />
                <StatCard
                  icon={Clock}
                  label="Active now"
                  value={stats.data.statistics.activeDeliveries}
                  tone="warning"
                />
                <StatCard
                  icon={CheckCircle2}
                  label="Delivered"
                  value={stats.data.statistics.delivered}
                  tone="success"
                />
                <StatCard
                  icon={TrendingUp}
                  label="Success rate"
                  value={`${stats.data.statistics.successRate}%`}
                  hint={`${stats.data.statistics.completedDeliveries} completed`}
                  tone={
                    stats.data.statistics.completedDeliveries === 0
                      ? "default"
                      : stats.data.statistics.successRate >= 80
                        ? "success"
                        : stats.data.statistics.successRate >= 50
                          ? "warning"
                          : "danger"
                  }
                />
              </div>
            </div>
          </div>

          {/* Status breakdown chart */}
          <StatusBreakdownChart statistics={stats.data.statistics} />

          {/* Failure / cancellation note */}
          {stats.data.statistics.failed + stats.data.statistics.cancelled >
            0 && (
            <Card className="rounded-2xl border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Edge cases</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3">
                <MiniStat
                  label="Failed"
                  value={stats.data.statistics.failed}
                  tone="danger"
                />
                <MiniStat
                  label="Cancelled"
                  value={stats.data.statistics.cancelled}
                  tone="muted"
                />
                <MiniStat
                  label="Completed"
                  value={stats.data.statistics.completedDeliveries}
                  tone="default"
                />
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Sub-components                                 */
/* -------------------------------------------------------------------------- */

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "font-medium text-right truncate",
          mono && "font-mono text-xs",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "danger" | "muted";
}) {
  const toneClass = {
    default: "text-foreground",
    danger: "text-destructive",
    muted: "text-muted-foreground",
  }[tone];

  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p
        className={cn("mt-1 text-2xl font-semibold tracking-tight", toneClass)}
      >
        {value}
      </p>
    </div>
  );
}
