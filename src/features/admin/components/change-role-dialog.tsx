"use client";

import * as React from "react";
import { toast } from "sonner";
import { AlertTriangle, Loader2, ShieldCheck } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RoleBadge } from "@/components/shared/role-badge";
import { useChangeUserRole } from "@/src/features/admin/hooks/use-user-mutations";
import { USER_ROLE_META, UserRole, type User } from "@/src/types";
import { cn } from "@/lib/utils";

interface Props {
  user: User;
  /** The currently logged-in admin's id, to prevent self-role-change. */
  currentAdminId: string;
}

export function ChangeRoleDialog({ user, currentAdminId }: Props) {
  const [open, setOpen] = React.useState(false);
  const [role, setRole] = React.useState<UserRole>(user.role);
  const mutation = useChangeUserRole();

  const isSelf = user.id === currentAdminId;
  const isChanged = role !== user.role;

  // Reset role when dialog closes
  React.useEffect(() => {
    if (!open) setRole(user.role);
  }, [open, user.role]);

  function handleSubmit() {
    if (isSelf) {
      toast.error("You can't change your own role");
      return;
    }
    if (!isChanged) return;

    mutation.mutate(
      { id: user.id, role },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "h-8 gap-1.5 text-xs",
        )}
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        Change role
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change user role</DialogTitle>
          <DialogDescription>
            You&apos;re updating{" "}
            <span className="font-medium text-foreground">{user.name}</span> (
            {user.email}).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Current:</span>
            <RoleBadge role={user.role} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">New role</Label>
            <Select
              value={role}
              onValueChange={(v) => {
                if (v != null) setRole(v as UserRole);
              }}
              disabled={isSelf}
            >
              <SelectTrigger id="role" className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UserRole).map((r) => (
                  <SelectItem key={r} value={r}>
                    {USER_ROLE_META[r].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Warning box for privilege escalation */}
          {(role === "ADMIN" || user.role === "ADMIN") &&
            isChanged &&
            !isSelf && (
              <div className="flex gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3">
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Admin accounts have full system access. Confirm you intend to
                  grant or remove this privilege.
                </p>
              </div>
            )}

          {isSelf && (
            <div className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                You can&apos;t change your own role. Ask another admin.
              </p>
            </div>
          )}
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
            onClick={handleSubmit}
            disabled={!isChanged || mutation.isPending || isSelf}
            className="gap-2"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {mutation.isPending ? "Saving…" : "Change role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
