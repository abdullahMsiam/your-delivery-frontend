"use client";

import * as React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/src/hooks/use-debounce";
import { DeliveryStatus } from "@/src/types";

interface Props {
  values: {
    trackingId: string;
    status: string;
    customerId: string;
    agentId: string;
    dateFrom: string;
    dateTo: string;
  };
  onChange: (patch: Partial<Props["values"]>) => void;
  onClear: () => void;
}

const STATUSES = [
  { value: "all", label: "All statuses" },
  ...Object.values(DeliveryStatus).map((s) => ({
    value: s,
    label: s
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  })),
];

export function AdminDeliveryFilters({ values, onChange, onClear }: Props) {
  const [expanded, setExpanded] = React.useState(false);

  // Debounce tracking ID
  const [localTracking, setLocalTracking] = React.useState(values.trackingId);
  const debouncedTracking = useDebounce(localTracking, 400);

  React.useEffect(() => {
    if (debouncedTracking !== values.trackingId) {
      onChange({ trackingId: debouncedTracking });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTracking]);

  React.useEffect(() => {
    setLocalTracking(values.trackingId);
  }, [values.trackingId]);

  const hasFilters = Boolean(
    values.trackingId ||
    values.status ||
    values.customerId ||
    values.agentId ||
    values.dateFrom ||
    values.dateTo,
  );

  return (
    <div className="space-y-4">
      {/* Top row: search + status + toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={localTracking}
            onChange={(e) => setLocalTracking(e.target.value)}
            placeholder="Search by tracking ID…"
            aria-label="Search by tracking ID"
            className="h-10 pl-9"
          />
        </div>

        <Select
          value={values.status || "all"}
          onValueChange={(v) => {
            if (v == null) return;
            onChange({ status: v === "all" ? "" : v });
          }}
        >
          <SelectTrigger
            className="h-10 sm:w-[180px]"
            aria-label="Filter by status"
          >
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          onClick={() => setExpanded((e) => !e)}
          className="h-10 gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          More
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={onClear}
          disabled={!hasFilters}
          className={cn(
            "h-10 gap-1.5",
            !hasFilters && "opacity-0 pointer-events-none",
          )}
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      </div>

      {/* Expanded filters */}
      {expanded && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2 border-t border-border/60">
          <div className="space-y-1.5">
            <Label htmlFor="customerId" className="text-xs">
              Customer ID
            </Label>
            <Input
              id="customerId"
              value={values.customerId}
              onChange={(e) => onChange({ customerId: e.target.value })}
              placeholder="UUID"
              className="h-10 font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="agentId" className="text-xs">
              Agent ID
            </Label>
            <Input
              id="agentId"
              value={values.agentId}
              onChange={(e) => onChange({ agentId: e.target.value })}
              placeholder="UUID"
              className="h-10 font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dateFrom" className="text-xs">
              From
            </Label>
            <Input
              id="dateFrom"
              type="date"
              value={values.dateFrom}
              onChange={(e) => onChange({ dateFrom: e.target.value })}
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dateTo" className="text-xs">
              To
            </Label>
            <Input
              id="dateTo"
              type="date"
              value={values.dateTo}
              onChange={(e) => onChange({ dateTo: e.target.value })}
              className="h-10"
            />
          </div>
        </div>
      )}
    </div>
  );
}
