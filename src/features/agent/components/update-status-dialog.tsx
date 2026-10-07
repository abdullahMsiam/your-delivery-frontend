"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateAgentDeliveryStatus } from "@/lib/api/agent";
import { queryKeys } from "@/lib/query-keys";
import { ApiError } from "@/lib/api-client";
import { DELIVERY_STATUS_META, type DeliveryStatus } from "@/src/types";

interface Props {
  deliveryId: string;
  trackingId: string;
  nextStatus: DeliveryStatus;
  label: string;
  description: string;
  variant?: "default" | "destructive" | "outline";
  /** Called with the updated delivery on success. */
  onSuccess?: () => void;
}

export function UpdateStatusDialog({
  deliveryId,
  trackingId,
  nextStatus,
  label,
  description,
  variant = "default",
  onSuccess,
}: Props) {
  const qc = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [note, setNote] = React.useState("");

  const mutation = useMutation({
    mutationFn: () =>
      updateAgentDeliveryStatus(deliveryId, {
        status: nextStatus,
        note: note.trim() || undefined,
      }),
    onSuccess: () => {
      toast.success(`Marked as ${DELIVERY_STATUS_META[nextStatus].label}`);
      qc.invalidateQueries({ queryKey: queryKeys.agent.deliveries() });
      qc.invalidateQueries({ queryKey: queryKeys.agent.statistics });
      qc.invalidateQueries({ queryKey: queryKeys.deliveries.all });
      setOpen(false);
      setNote("");
      onSuccess?.();
    },
    onError: (err) => {
      const message =
        err instanceof ApiError ? err.message : "Could not update status";
      toast.error(message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={
          variant === "destructive"
            ? "inline-flex h-11 items-center gap-2 rounded-md bg-destructive px-6 text-sm font-medium text-destructive-foreground shadow-xs hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            : variant === "outline"
              ? "inline-flex h-11 items-center gap-2 rounded-md border border-input bg-background px-6 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              : "inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        }
      >
        {label}
        <ArrowRight className="h-4 w-4" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm status change</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tracking ID</span>
              <span className="font-mono font-medium">{trackingId}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-muted-foreground">New status</span>
              <span className="font-medium">
                {DELIVERY_STATUS_META[nextStatus].label}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status-note" className="text-sm">
              Note{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="status-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Recipient asked to leave at front desk"
              rows={3}
              maxLength={500}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="gap-2"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {mutation.isPending ? "Updating…" : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
