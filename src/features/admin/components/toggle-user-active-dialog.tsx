"use client";

import * as React from "react";
import { toast } from "sonner";
import { AlertTriangle, Loader2, Power } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToggleUserActive } from "@/src/features/admin/hooks/use-user-mutations";
import { cn } from "@/lib/utils";
import type { User } from "@/src/types";

interface Props {
  user: User;
  currentAdminId: string;
}

export function ToggleUserActiveDialog({ user, currentAdminId }: Props) {
  const [open, setOpen] = React.useState(false);
  const mutation = useToggleUserActive();

  const isSelf = user.id === currentAdminId;
  const willDeactivate = user.isActive;

  function handleSubmit() {
    if (isSelf) {
      toast.error("You can't change your own account status");
      return;
    }

    mutation.mutate(
      { id: user.id, isActive: !user.isActive },
      {
        onSuccess: () => setOpen(false),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({
            variant: "ghost",
            size: "sm",
          }),
          "h-8 gap-1.5 text-xs",
          willDeactivate ? "text-destructive hover:text-destructive" : "",
        )}
      >
        <Power className="h-3.5 w-3.5" />
        {willDeactivate ? "Deactivate" : "Activate"}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {willDeactivate ? "Deactivate" : "Activate"} this user?
          </DialogTitle>
          <DialogDescription>
            {willDeactivate
              ? "They won't be able to log in or refresh tokens. Existing access tokens remain valid until they expire."
              : "They'll be able to log in again and use their account."}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-1 text-sm">
          <p className="font-medium">{user.name}</p>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        {isSelf && (
          <div className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              You can&apos;t change your own account status.
            </p>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant={willDeactivate ? "destructive" : "default"}
            onClick={handleSubmit}
            disabled={mutation.isPending || isSelf}
            className="gap-2"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {mutation.isPending
              ? "Saving…"
              : willDeactivate
                ? "Yes, deactivate"
                : "Yes, activate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
