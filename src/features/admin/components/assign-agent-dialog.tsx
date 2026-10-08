"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

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
import { UserAvatar } from "@/components/shared/user-avatar";
import { assignAgent, reassignAgent } from "@/lib/api/admin";
import { queryKeys } from "@/lib/query-keys";
import { ApiError } from "@/lib/api-client";
import { useActiveAgents } from "@/src/features/admin/hooks/use-active-agents";
import { cn } from "@/lib/utils";

interface Props {
  deliveryId: string;
  trackingId: string;
  mode: "assign" | "reassign";
  currentAgentId?: string | null;
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export function AssignAgentDialog({
  deliveryId,
  trackingId,
  mode,
  currentAgentId,
  onSuccess,
}: Props) {
  const qc = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [agentId, setAgentId] = React.useState<string>(currentAgentId ?? "");
  const { data: agents = [], isLoading: agentsLoading } = useActiveAgents();

  const mutation = useMutation({
    mutationFn: () =>
      mode === "assign"
        ? assignAgent(deliveryId, agentId)
        : reassignAgent(deliveryId, agentId),
    onSuccess: () => {
      toast.success(mode === "assign" ? "Agent assigned" : "Agent reassigned");
      qc.invalidateQueries({ queryKey: ["admin"] });
      qc.invalidateQueries({ queryKey: ["deliveries"] });
      setOpen(false);
      onSuccess?.();
    },
    onError: (err) => {
      const message =
        err instanceof ApiError ? err.message : "Could not assign agent";
      toast.error(message);
    },
  });

  const selectedAgent = agents.find((a) => a.id === agentId);
  const canSubmit =
    agentId && agentId !== currentAgentId && !mutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({
            variant: mode === "assign" ? "default" : "outline",
          }),
          "gap-2 h-10",
        )}
      >
        <UserPlus className="h-4 w-4" />
        {mode === "assign" ? "Assign agent" : "Reassign"}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "assign"
              ? "Assign an agent"
              : "Reassign to another agent"}
          </DialogTitle>
          <DialogDescription>
            {mode === "assign"
              ? "Choose an active agent for this delivery."
              : "This will replace the currently assigned agent."}{" "}
            <span className="font-mono text-xs">{trackingId}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="agent">Agent</Label>
            <Select
              value={agentId}
              onValueChange={(v) => {
                if (v != null) setAgentId(v);
              }}
              disabled={agentsLoading}
            >
              <SelectTrigger id="agent" className="h-11">
                <SelectValue
                  placeholder={
                    agentsLoading ? "Loading agents…" : "Choose an agent"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {agents.length === 0 ? (
                  <div className="px-3 py-6 text-sm text-muted-foreground text-center">
                    No active agents available
                  </div>
                ) : (
                  agents.map((a) => (
                    <SelectItem
                      key={a.id}
                      value={a.id}
                      disabled={a.id === currentAgentId}
                    >
                      <div className="flex items-center gap-2">
                        <UserAvatar name={a.name} size="sm" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{a.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {a.phone}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedAgent && (
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3 flex items-center gap-3">
              <UserAvatar name={selectedAgent.name} size="md" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {selectedAgent.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {selectedAgent.email} · {selectedAgent.phone}
                </p>
              </div>
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
            onClick={() => mutation.mutate()}
            disabled={!canSubmit}
            className="gap-2"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {mutation.isPending
              ? "Saving…"
              : mode === "assign"
                ? "Assign"
                : "Reassign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
