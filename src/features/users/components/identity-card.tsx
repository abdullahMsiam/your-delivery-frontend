import { CalendarDays, Mail, Phone, User as UserIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/user-avatar";
import { RoleBadge } from "@/components/shared/role-badge";
import { formatDate } from "@/lib/format";
import type { User } from "@/src/types";

export function IdentityCard({ user }: { user: User }) {
  return (
    <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 px-6 py-8 border-b border-border/60">
        <div className="flex items-center gap-4">
          <UserAvatar
            name={user.name}
            size="lg"
            className="h-16 w-16 text-xl"
          />
          <div className="min-w-0">
            <p className="font-semibold tracking-tight truncate">{user.name}</p>
            <div className="mt-1">
              <RoleBadge role={user.role} />
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        <InfoRow icon={Mail} label="Email" value={user.email} />
        <InfoRow icon={Phone} label="Phone" value={user.phone} />
        <InfoRow
          icon={CalendarDays}
          label="Member since"
          value={formatDate(user.createdAt)}
        />
        <InfoRow
          icon={UserIcon}
          label="Account status"
          value={user.isActive ? "Active" : "Inactive"}
        />
      </CardContent>
    </Card>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}
