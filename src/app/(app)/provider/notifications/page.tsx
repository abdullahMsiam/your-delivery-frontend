"use client";

import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
import { NotificationsList } from "@/src/features/notifications/components/notifications-list";

export default function AgentNotificationsPage() {
  return (
    <RoleGuard allow={[UserRole.AGENT]}>
      <NotificationsList
        title="Notifications"
        subtitle="New assignments, status updates, and payment events."
      />
    </RoleGuard>
  );
}
