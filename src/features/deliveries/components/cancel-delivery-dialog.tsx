"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, XCircle } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
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
import { cancelDelivery } from "@/lib/api/deliveries";
import { queryKeys } from "@/lib/query-keys";
import { ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface Props {
  deliveryId: string;
  trackingId: string;
  /** Called after a successful cancel — use to navigate away or refetch. */
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export function CancelDeliveryDialog({
  deliveryId,
  trackingId,
  onSuccess,
  children,
}: Props) {
  const qc = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [note, setNote] = React.useState("");

  const mutation = useMutation({
    mutationFn: () => cancelDelivery(deliveryId, note.trim()),
    onSuccess: () => {
      toast.success("Delivery cancelled");
      qc.invalidateQueries({ queryKey: queryKeys.deliveries.all });
      setOpen(false);
      onSuccess?.();
    },
    onError: (err) => {
      const message =
        err instanceof ApiError ? err.message : "Could not cancel delivery";
      toast.error(message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "gap-2 text-destructive hover:text-destructive",
        )}
      >
        <XCircle className="h-4 w-4" />
        Cancel delivery
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel this delivery?</DialogTitle>
          <DialogDescription>
            This will cancel <span className="font-mono">{trackingId}</span>.
            You can add an optional reason below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="cancel-note" className="text-sm">
            Reason{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </Label>
          <Textarea
            id="cancel-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Changed my mind, wrong address…"
            rows={3}
            maxLength={500}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground text-right">
            {500 - note.length} left
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={mutation.isPending}
          >
            Keep delivery
          </Button>
          <Button
            variant="destructive"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="gap-2"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {mutation.isPending ? "Cancelling…" : "Yes, cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
