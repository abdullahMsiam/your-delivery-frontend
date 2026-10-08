"use client";

import { CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { AdminDashboard } from "@/src/types";

interface Props {
  revenue: AdminDashboard["revenue"];
  payments: AdminDashboard["payments"];
}

export function RevenueCard({ revenue, payments }: Props) {
  const paid = Number(revenue.totalPaid ?? 0);
  const pending = Number(revenue.totalPending ?? 0);
  const total = paid + pending;
  const paidPct = total === 0 ? 0 : Math.round((paid / total) * 100);

  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Revenue
            </p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">
              {formatCurrency(paid)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Confirmed payments
            </p>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <TrendingUp className="h-5 w-5" />
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${paidPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{paidPct}% collected</span>
            <span>{total === 0 ? "—" : `of ${formatCurrency(total)}`}</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/60">
          <div className="flex items-start gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Paid
              </p>
              <p className="text-sm font-medium truncate">{payments.paid}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-500/15 text-yellow-600 dark:text-yellow-400">
              <Clock className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Pending
              </p>
              <p className="text-sm font-medium truncate">{payments.pending}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
