"use client";

import * as React from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { Loader2, ServerCog } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shows a small banner if a request has been in flight for >5s.
 * Specifically tuned for Render free-tier cold starts.
 */
export function ColdStartBanner() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const active = isFetching > 0 || isMutating > 0;

  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }
    const t = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(t);
  }, [active]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-3",
        "rounded-xl border border-border/60 bg-card/95 backdrop-blur px-4 py-3",
        "shadow-lg animate-in fade-in slide-in-from-bottom-2",
      )}
      role="status"
      aria-live="polite"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <ServerCog className="h-4 w-4" />
      </span>
      <div className="text-sm">
        <p className="font-medium">Waking up the server…</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Loader2 className="h-3 w-3 animate-spin" />
          First request may take up to a minute
        </p>
      </div>
    </div>
  );
}
