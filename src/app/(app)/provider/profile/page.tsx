"use client";

import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
import { ProfileContent } from "@/src/features/users/components/profile-content";

export default function AgentProfilePage() {
  return (
    <RoleGuard allow={[UserRole.AGENT]}>
      <ProfileContent />
    </RoleGuard>
  );
}