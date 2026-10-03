"use client";

import * as React from "react";
import { Briefcase, ShieldCheck, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DemoAccount } from "@/lib/demo-accounts";

interface Props {
  account: DemoAccount;
  onLogin: (account: DemoAccount) => Promise<void>;
  disabled?: boolean;
  fullWidth?: boolean;
}

const iconFor = {
  admin: ShieldCheck,
  customer: UserIcon,
  agent: Briefcase,
} as const;

export function DemoLoginButton({
  account,
  onLogin,
  disabled,
  fullWidth,
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const Icon = iconFor[account.icon];

  async function handleClick() {
    setLoading(true);
    try {
      await onLogin(account);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled || loading}
      onClick={handleClick}
      className={cn(
        "group h-auto gap-2 border-2 py-4 transition-colors",
        "hover:border-primary hover:bg-primary/5",
        "focus-visible:border-primary",
        fullWidth ? "w-full flex-row justify-center" : "flex-col"
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-md bg-primary/10 text-primary transition-colors",
          "group-hover:bg-primary/15",
          fullWidth ? "h-8 w-8" : "h-10 w-10"
        )}
      >
        <Icon className={cn(fullWidth ? "h-4 w-4" : "h-5 w-5")} />
      </span>

      <span className="flex flex-col items-center leading-tight">
        <span className="text-sm font-medium">
          {loading ? "Signing in…" : account.label}
        </span>
        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
          Demo login
        </span>
      </span>
    </Button>
  );
}