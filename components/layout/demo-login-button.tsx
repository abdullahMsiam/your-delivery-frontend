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
}

const iconFor = {
  admin: ShieldCheck,
  customer: UserIcon,
  agent: Briefcase,
} as const;

export function DemoLoginButton({ account, onLogin, disabled }: Props) {
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
        "h-auto flex-col gap-2 py-4 border-2 hover:border-primary hover:bg-primary/5",
        "transition-colors",
      )}
    >
      <Icon className="h-6 w-6 text-primary" />
      <span className="text-sm font-medium">
        {loading ? "Logging in…" : account.label}
      </span>
      <span className="text-xs text-muted-foreground">Demo Login</span>
    </Button>
  );
}
