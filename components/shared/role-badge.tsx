import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { USER_ROLE_META, UserRole } from "@/src/types";

export function RoleBadge({
  role,
  className,
}: {
  role: UserRole;
  className?: string;
}) {
  const meta = USER_ROLE_META[role];
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", meta.className, className)}
    >
      {meta.label}
    </Badge>
  );
}
