"use client";

import Link from "next/link";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/shared/user-avatar";
import { RoleBadge } from "@/components/shared/role-badge";

import { homeRouteForRole } from "@/lib/routes";
import { useUser } from "@/src/hooks/useAuth";
import { useLogout } from "@/src/hooks/useLogout";

export function UserMenu() {
  const user = useUser();
  const { doLogout, pending } = useLogout();

  if (!user) return null;

  const home = homeRouteForRole(user.role);

  const notifHref =
    user.role === "ADMIN"
      ? "/admin/notifications"
      : user.role === "AGENT"
        ? "/provider/notifications"
        : "/dashboard/notifications";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto gap-2 px-1.5 py-1.5 rounded-full hover:bg-accent"
        >
          <UserAvatar name={user.name} size="md" />
          <span className="hidden sm:flex flex-col items-start leading-tight pr-2">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {user.role}
            </span>
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-3 py-3">
          <UserAvatar name={user.name} size="lg" />
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-sm font-medium truncate">{user.name}</span>
            <span className="text-xs text-muted-foreground truncate">
              {user.email}
            </span>
            <RoleBadge role={user.role} className="w-fit mt-1" />
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={home} className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={notifHref} className="cursor-pointer">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href={
              user.role === "ADMIN"
                ? "/admin"
                : user.role === "AGENT"
                  ? "/provider/profile"
                  : "/dashboard/profile"
            }
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            Profile & settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={pending}
          onSelect={(e) => {
            e.preventDefault();
            void doLogout();
          }}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {pending ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
