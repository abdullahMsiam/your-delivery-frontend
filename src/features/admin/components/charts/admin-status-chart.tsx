"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer } from "@/components/shared/charts/chart-container";
import { ChartTooltip } from "@/components/shared/charts/chart-tooltip";
import { DELIVERY_STATUS_META } from "@/src/types";
import type { AdminDashboard } from "@/src/types";
import { ChartEmpty } from "@/components/shared/charts/charts-empty";

/** Map status → a fill color that looks "designed". */
const STATUS_FILL: Record<string, string> = {
  PENDING: "hsl(38 92% 50%)",
  ASSIGNED: "hsl(217 91% 60%)",
  PICKED_UP: "hsl(239 84% 67%)",
  IN_TRANSIT: "hsl(271 91% 65%)",
  OUT_FOR_DELIVERY: "hsl(192 91% 45%)",
  DELIVERED: "hsl(142 71% 45%)",
  CANCELLED: "hsl(220 9% 46%)",
  FAILED: "hsl(0 84% 60%)",
};

interface Props {
  deliveries: AdminDashboard["deliveries"];
}

export function AdminStatusChart({ deliveries }: Props) {
  const data = useMemo(() => {
    return [
      {
        status: "PENDING",
        label: DELIVERY_STATUS_META.PENDING.label,
        count: deliveries.pending,
      },
      {
        status: "ASSIGNED",
        label: DELIVERY_STATUS_META.ASSIGNED.label,
        count: deliveries.assigned,
      },
      {
        status: "PICKED_UP",
        label: DELIVERY_STATUS_META.PICKED_UP.label,
        count: deliveries.pickedUp,
      },
      {
        status: "IN_TRANSIT",
        label: DELIVERY_STATUS_META.IN_TRANSIT.label,
        count: deliveries.inTransit,
      },
      {
        status: "OUT_FOR_DELIVERY",
        label: DELIVERY_STATUS_META.OUT_FOR_DELIVERY.label,
        count: deliveries.outForDelivery,
      },
      {
        status: "DELIVERED",
        label: DELIVERY_STATUS_META.DELIVERED.label,
        count: deliveries.delivered,
      },
      {
        status: "CANCELLED",
        label: DELIVERY_STATUS_META.CANCELLED.label,
        count: deliveries.cancelled,
      },
      {
        status: "FAILED",
        label: DELIVERY_STATUS_META.FAILED.label,
        count: deliveries.failed,
      },
    ];
  }, [deliveries]);

  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <ChartContainer
      title="Deliveries by status"
      description={`${total} total deliveries`}
    >
      {total === 0 ? (
        <ChartEmpty label="No deliveries yet" />
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
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
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                width={30}
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
              <Bar dataKey="count" name="Count" radius={[6, 6, 0, 0]}>
                {data.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={STATUS_FILL[entry.status] ?? "hsl(var(--primary))"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartContainer>
  );
}
