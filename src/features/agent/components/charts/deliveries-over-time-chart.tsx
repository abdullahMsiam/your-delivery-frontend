"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, subDays } from "date-fns";

import { ChartContainer } from "@/components/shared/charts/chart-container";
import { ChartTooltip } from "@/components/shared/charts/chart-tooltip";
import type { Delivery } from "@/src/types";
import { ChartEmpty } from "@/components/shared/charts/charts-empty";

interface Props {
  deliveries: Delivery[];
  /** Number of days in the window (default 30). */
  days?: number;
}

export function DeliveriesOverTimeChart({ deliveries, days = 30 }: Props) {
  const data = useMemo(() => {
    // Build an empty series for the window
    const start = subDays(new Date(), days - 1);
    start.setHours(0, 0, 0, 0);

    const buckets = new Map<string, number>();
    for (let i = 0; i < days; i++) {
      const d = subDays(new Date(), days - 1 - i);
      buckets.set(format(d, "yyyy-MM-dd"), 0);
    }

    // Fill from deliveries
    deliveries.forEach((d) => {
      const key = format(new Date(d.createdAt), "yyyy-MM-dd");
      if (buckets.has(key)) {
        buckets.set(key, (buckets.get(key) ?? 0) + 1);
      }
    });

    return Array.from(buckets.entries()).map(([date, count]) => ({
      date,
      deliveries: count,
    }));
  }, [deliveries, days]);

  const total = data.reduce((sum, d) => sum + d.deliveries, 0);

  return (
    <ChartContainer
      title="Deliveries over time"
      description={`${total} deliver${total === 1 ? "y" : "ies"} in the last ${days} days`}
    >
      {total === 0 ? (
        <ChartEmpty label="No deliveries in this window yet" />
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillDeliveries" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(v) => format(new Date(v), "MMM d")}
                minTickGap={24}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                width={30}
              />
              <Tooltip
                cursor={{ stroke: "hsl(var(--primary))", strokeOpacity: 0.2 }}
                content={
                  <ChartTooltip
                    labelFormatter={(l) => format(new Date(l), "EEE, MMM d")}
                    valueFormatter={(v) =>
                      `${v} deliver${v === 1 ? "y" : "ies"}`
                    }
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="deliveries"
                name="Deliveries"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#fillDeliveries)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartContainer>
  );
}
