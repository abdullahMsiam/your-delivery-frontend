"use client";

import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
import { NotificationsList } from "@/src/features/notifications/components/notifications-list";

export default function AdminNotificationsPage() {
  return (
    <RoleGuard allow={[UserRole.ADMIN]}>
      <NotificationsList
        title="Notifications"
        subtitle="System events and delivery activity."
      />
    </RoleGuard>
  );
}
