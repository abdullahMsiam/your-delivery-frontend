"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer } from "@/components/shared/charts/chart-container";
import { ChartTooltip } from "@/components/shared/charts/chart-tooltip";
import { aggregateByMonth } from "@/src/features/admin/lib/aggregate";
import { formatCurrency } from "@/lib/format";
import type { Delivery } from "@/src/types";
import { ChartEmpty } from "@/components/shared/charts/charts-empty";

export function MonthlyRevenueChart({
  deliveries,
}: {
  deliveries: Delivery[];
}) {
  const data = useMemo(() => aggregateByMonth(deliveries), [deliveries]);
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <ChartContainer
      title="Revenue by month"
      description={`${formatCurrency(totalRevenue)} total revenue in range`}
    >
      {data.length === 0 ? (
        <ChartEmpty label="No data in the selected range" />
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                width={60}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--primary))", fillOpacity: 0.06 }}
                content={
                  <ChartTooltip valueFormatter={(v) => formatCurrency(v)} />
                }
              />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="hsl(var(--primary))"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartContainer>
  );
}
