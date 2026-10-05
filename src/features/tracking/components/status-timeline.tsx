import { Clock, Package, PackageCheck, Truck, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeliveryStatus, TrackingHistoryEntry } from "@/src/types";

interface Props {
  entries: TrackingHistoryEntry[];
  currentStatus: DeliveryStatus;
}

const ICON_BY_STATUS: Record<
  DeliveryStatus,
  React.ComponentType<{ className?: string }>
> = {
  PENDING: Clock,
  ASSIGNED: Package,
  PICKED_UP: Package,
  IN_TRANSIT: Truck,
  OUT_FOR_DELIVERY: Truck,
  DELIVERED: PackageCheck,
  CANCELLED: XCircle,
  FAILED: XCircle,
};

const TONE_BY_STATUS: Record<DeliveryStatus, { dot: string; icon: string }> = {
  PENDING: {
    dot: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 ring-yellow-500/40",
    icon: "text-yellow-600 dark:text-yellow-400",
  },
  ASSIGNED: {
    dot: "bg-blue-500/20 text-blue-600 dark:text-blue-400 ring-blue-500/40",
    icon: "text-blue-600 dark:text-blue-400",
  },
  PICKED_UP: {
    dot: "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 ring-indigo-500/40",
    icon: "text-indigo-600 dark:text-indigo-400",
  },
  IN_TRANSIT: {
    dot: "bg-purple-500/20 text-purple-600 dark:text-purple-400 ring-purple-500/40",
    icon: "text-purple-600 dark:text-purple-400",
  },
  OUT_FOR_DELIVERY: {
    dot: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 ring-cyan-500/40",
    icon: "text-cyan-600 dark:text-cyan-400",
  },
  DELIVERED: {
    dot: "bg-green-500/20 text-green-600 dark:text-green-400 ring-green-500/40",
    icon: "text-green-600 dark:text-green-400",
  },
  CANCELLED: {
    dot: "bg-muted text-muted-foreground ring-border",
    icon: "text-muted-foreground",
  },
  FAILED: {
    dot: "bg-destructive/15 text-destructive ring-destructive/40",
    icon: "text-destructive",
  },
};

const LABEL: Record<DeliveryStatus, string> = {
  PENDING: "Order placed",
  ASSIGNED: "Agent assigned",
  PICKED_UP: "Picked up",
  IN_TRANSIT: "In transit",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  FAILED: "Delivery failed",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function StatusTimeline({ entries, currentStatus }: Props) {
  const list = Array.isArray(entries) ? entries : [];

  if (!list.length) {
    return (
      <p className="text-sm text-muted-foreground">No history available yet.</p>
    );
  }

  const sorted = [...list].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );

  return (
    <ol className="relative space-y-6">
      <span
        aria-hidden
        className="absolute left-[19px] top-2 bottom-2 w-px bg-border"
      />

      {sorted.map((entry, i) => {
        const Icon = ICON_BY_STATUS[entry.status];
        const tone = TONE_BY_STATUS[entry.status];
        const isCurrent = entry.status === currentStatus && i === 0;

        return (
          <li
            key={entry.id ?? `${entry.status}-${entry.createdAt}-${i}`}
            className="relative flex gap-4"
          >
            <span
              className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-2",
                tone.dot,
                isCurrent && "animate-pulse",
              )}
            >
              <Icon className={cn("h-4 w-4", tone.icon)} />
            </span>

            <div className="flex-1 min-w-0 pt-1.5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="font-medium">{LABEL[entry.status]}</p>
                {isCurrent && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    Current
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatDate(entry.createdAt)}
                </span>
              </div>
              {entry.note && (
                <p className="mt-1 text-sm text-muted-foreground text-pretty">
                  {entry.note}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
