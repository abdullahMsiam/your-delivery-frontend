import type { Metadata } from "next";
import { RoleGuard } from "@/components/layout/role-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/src/types";

export const metadata: Metadata = { title: "Dashboard" };

export default function CustomerDashboardPage() {
  return (
    <RoleGuard allow={[UserRole.CUSTOMER]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">
            A snapshot of your delivery activity.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Coming soon</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            This dashboard will show stats and your recent deliveries.
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
