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
import type { AgentStatisticsNumbers } from "@/src/types";
import { ChartEmpty } from "@/components/shared/charts/charts-empty";

interface Props {
  statistics: AgentStatisticsNumbers;
}

export function StatusBreakdownChart({ statistics }: Props) {
  const data = useMemo(() => {
    return [
      { status: "Assigned", count: statistics.statusBreakdown.assigned },
      { status: "Picked up", count: statistics.statusBreakdown.pickedUp },
      { status: "In transit", count: statistics.statusBreakdown.inTransit },
      {
        status: "Out for delivery",
        count: statistics.statusBreakdown.outForDelivery,
      },
      { status: "Delivered", count: statistics.delivered },
      { status: "Failed", count: statistics.failed },
      { status: "Cancelled", count: statistics.cancelled },
    ].filter((r) => r.count > 0);
  }, [statistics]);

  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <ChartContainer
      title="Status distribution"
      description="Where your assigned deliveries stand right now"
    >
      {total === 0 ? (
        <ChartEmpty label="No deliveries assigned yet" />
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 24, left: 8, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                horizontal={false}
              />
              <XAxis
                type="number"
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                type="category"
                dataKey="status"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                width={110}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--primary))", fillOpacity: 0.06 }}
                content={
                  <ChartTooltip
                    valueFormatter={(v) =>
                      `${v} deliver${v === 1 ? "y" : "ies"}`
                    }
                  />
                }
              />
              <Bar
                dataKey="count"
                name="Count"
                fill="hsl(var(--primary))"
                radius={[0, 6, 6, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartContainer>
  );
}
