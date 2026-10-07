"use client";

import type { ReactNode } from "react";

interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string;
}

interface Props {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: ReactNode;
  /** Format the numeric value for display. */
  valueFormatter?: (value: number, name?: string) => string;
  /** Format the label (typically a date or category). */
  labelFormatter?: (label: string) => string;
}

export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
  labelFormatter,
}: Props) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border/70 bg-popover px-3 py-2 shadow-md">
      {label != null && (
        <p className="text-xs font-medium text-muted-foreground">
          {labelFormatter ? labelFormatter(String(label)) : String(label)}
        </p>
      )}
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-medium">
          {entry.name && (
            <span className="text-muted-foreground">{entry.name}: </span>
          )}
          {valueFormatter
            ? valueFormatter(Number(entry.value), entry.name)
            : entry.value}
        </p>
      ))}
    </div>
  );
}
