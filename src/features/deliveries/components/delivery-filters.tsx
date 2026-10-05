"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  trackingId: string;
  status: string;
  onTrackingIdChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onClear: () => void;
}

const STATUSES: { value: string; label: string }[] = [
  { value: "all", label: "All statuses" },
  ...Object.values(DeliveryStatus).map((s) => ({
    value: s,
    label: s
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  })),
];

export function DeliveryFilters({
  trackingId,
  status,
  onTrackingIdChange,
  onStatusChange,
  onClear,
}: Props) {
  const [localSearch, setLocalSearch] = React.useState(trackingId);
  const debouncedSearch = useDebounce(localSearch, 400);

  // Push debounced value to URL
  React.useEffect(() => {
    if (debouncedSearch !== trackingId) {
      onTrackingIdChange(debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Keep local in sync if URL is externally cleared
  React.useEffect(() => {
    setLocalSearch(trackingId);
  }, [trackingId]);

  const hasFilters = Boolean(trackingId) || (status && status !== "all");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1 min-w-0">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search by tracking ID…"
          aria-label="Search by tracking ID"
          className="h-10 pl-9"
        />
      </div>

      <Select
        value={status || "all"}
        onValueChange={(v) => {
          if (v == null) return;
          onStatusChange(v === "all" ? "" : v);
        }}
      >
        <SelectTrigger
          className="h-10 sm:w-[200px]"
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
  );
}
