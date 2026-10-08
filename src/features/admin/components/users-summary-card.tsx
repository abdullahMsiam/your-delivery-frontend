"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, UserCog, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AdminDashboard } from "@/src/types";

interface Props {
  users: AdminDashboard["users"];
}

export function UsersSummaryCard({ users }: Props) {
  const rows = [
    {
      icon: Users,
      label: "Customers",
      value: users.totalCustomers,
      tone: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
    },
    {
      icon: UserCog,
      label: "Agents",
      value: users.totalAgents,
      tone: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      icon: ShieldCheck,
      label: "Active agents",
      value: users.activeAgents,
      tone: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      icon: ShieldCheck,
      label: "Inactive agents",
      value: users.inactiveAgents,
      tone: "bg-muted text-muted-foreground",
    },
  ];

  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Users
          </p>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Manage
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <ul className="space-y-3">
          {rows.map(({ icon: Icon, label, value, tone }) => (
            <li key={label} className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone}`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex-1 min-w-0 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
