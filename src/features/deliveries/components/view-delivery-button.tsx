import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Purely presentational button that hints the user can view details.
 * No onClick — the parent <TableRow onRowClick> handles navigation.
 * Rendered inside a clickable row so clicks anywhere (button or row) work.
 */
export function ViewDeliveryButton({ className }: { className?: string }) {
  return (
    <span
      role="presentation"
      aria-hidden
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-md border border-border/70",
        "bg-background px-3 text-xs font-medium",
        "text-muted-foreground transition-colors",
        "group-hover/row:border-primary group-hover/row:text-primary",
        className,
      )}
    >
      <Eye className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">View details</span>
    </span>
  );
}
