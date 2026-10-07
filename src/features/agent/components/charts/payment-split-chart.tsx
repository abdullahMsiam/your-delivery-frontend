"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { ChartContainer } from "@/components/shared/charts/chart-container";
import { ChartTooltip } from "@/components/shared/charts/chart-tooltip";
import type { Delivery } from "@/src/types";
import { ChartEmpty } from "@/components/shared/charts/charts-empty";

interface Props {
  deliveries: Delivery[];
}

const COLORS = {
  STRIPE: "hsl(var(--primary))",
  COD: "hsl(12 76% 61%)",
};

export function PaymentSplitChart({ deliveries }: Props) {
  const data = useMemo(() => {
    const counts = { STRIPE: 0, COD: 0 };
    deliveries.forEach((d) => {
      if (d.payment?.method) counts[d.payment.method] += 1;
    });
    return [
      { name: "Online (Stripe)", value: counts.STRIPE, key: "STRIPE" as const },
      { name: "Cash on delivery", value: counts.COD, key: "COD" as const },
    ].filter((d) => d.value > 0);
  }, [deliveries]);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <ChartContainer
      title="Payment method"
      description="How your customers are paying"
    >
      {total === 0 ? (
        <ChartEmpty label="No payments to break down" />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 items-center">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={
                    <ChartTooltip
                      valueFormatter={(v) =>
                        `${v} deliver${v === 1 ? "y" : "ies"}`
                      }
                    />
                  }
                />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {data.map((entry) => (
                    <Cell key={entry.key} fill={COLORS[entry.key]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="space-y-3">
            {data.map((entry) => {
              const pct = Math.round((entry.value / total) * 100);
              return (
                <li key={entry.key} className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: COLORS[entry.key] }}
                    aria-hidden
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.value} · {pct}%
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </ChartContainer>
  );
}
