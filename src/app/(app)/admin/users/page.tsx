"use client";

import { useRouter } from "next/navigation";
import { Users as UsersIcon, UserX } from "lucide-react";

import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/skeletons";
import { RoleBadge } from "@/components/shared/role-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { ChangeRoleDialog } from "@/src/features/admin/components/change-role-dialog";
import { ToggleUserActiveDialog } from "@/src/features/admin/components/toggle-user-active-dialog";
import { useAdminUsers } from "@/src/features/admin/hooks/use-admin-users";
import { useSearchParamsState } from "@/src/hooks/use-search-params-state";
import { useUser } from "@/src/hooks/useAuth";
import { formatDate } from "@/lib/format";
import type { User } from "@/src/types";

export default function AdminUsersPage() {
  return (
    <RoleGuard allow={[UserRole.ADMIN]}>
      <AdminUsersList />
    </RoleGuard>
  );
}

const DEFAULTS: Record<string, string> = {
  page: "1",
  limit: "10",
  role: "",
};

function AdminUsersList() {
  const router = useRouter();
  const currentUser = useUser();
  const [filters, setFilters] = useSearchParamsState(DEFAULTS);

  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(filters.limit) || 10));

  const { data, isLoading, isError, refetch } = useAdminUsers({
    page,
    limit,
    role: (filters.role as UserRole) || undefined,
    // Note: isActive filter has a backend bug where isActive=false
    // is parsed as true. We skip it entirely.
  });

  const users = data?.users ?? [];
  const pagination = data?.pagination;

  const columns: Column<User>[] = [
    {
      key: "identity",
      header: "User",
      cell: (u) => (
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar name={u.name} size="sm" />
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-medium truncate">{u.name}</span>
            <span className="text-xs text-muted-foreground truncate">
              {u.email}
            </span>
          </div>
        </div>
      ),
      cellClassName: "min-w-[220px]",
    },
    {
      key: "phone",
      header: "Phone",
      cell: (u) => (
        <span className="text-xs text-muted-foreground font-mono">
          {u.phone}
        </span>
      ),
      cellClassName: "hidden md:table-cell",
      headClassName: "hidden md:table-cell",
    },
    {
      key: "role",
      header: "Role",
      cell: (u) => <RoleBadge role={u.role} />,
    },
    {
      key: "status",
      header: "Status",
      cell: (u) => (
        <Badge
          variant="outline"
          className={
            u.isActive
              ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30"
              : "bg-muted text-muted-foreground border-border"
          }
        >
          {u.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
      cellClassName: "hidden sm:table-cell",
      headClassName: "hidden sm:table-cell",
    },
    {
      key: "joined",
      header: "Joined",
      cell: (u) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(u.createdAt)}
        </span>
      ),
      cellClassName: "hidden lg:table-cell",
      headClassName: "hidden lg:table-cell",
    },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      cell: (u) => (
        <div className="flex items-center gap-1 justify-end">
          <ChangeRoleDialog user={u} currentAdminId={currentUser?.id ?? ""} />
          <ToggleUserActiveDialog
            user={u}
            currentAdminId={currentUser?.id ?? ""}
          />
        </div>
      ),
      headClassName: "text-right",
      cellClassName: "text-right whitespace-nowrap",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage customers, agents, and administrators.
        </p>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <Select
              value={filters.role || "all"}
              onValueChange={(v) => {
                if (v == null) return;
                setFilters({ role: v === "all" ? "" : v });
              }}
            >
              <SelectTrigger
                className="h-10 sm:w-[200px]"
                aria-label="Filter by role"
              >
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="CUSTOMER">Customers</SelectItem>
                <SelectItem value="AGENT">Agents</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
              </SelectContent>
            </Select>

            {filters.role && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({ role: "" })}
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="pt-6">
          {isLoading ? (
            <TableSkeleton rows={6} columns={6} />
          ) : isError ? (
            <ErrorBlock onRetry={refetch} />
          ) : users.length === 0 ? (
            <EmptyState
              icon={filters.role ? UserX : UsersIcon}
              title={
                filters.role ? "No users match this filter" : "No users yet"
              }
              description={
                filters.role
                  ? "Try a different role."
                  : "Register users will appear here."
              }
              className="border-none bg-transparent"
            />
          ) : (
            <>
              <DataTable<User>
                rows={users}
                columns={columns}
                getRowKey={(u) => u.id}
              />
              {pagination && (
                <Pagination pagination={pagination} className="mt-4" />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ErrorBlock({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm">
        <p className="font-medium text-destructive">Couldn&apos;t load users</p>
        <p className="text-muted-foreground">
          Please check your connection and try again.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}
