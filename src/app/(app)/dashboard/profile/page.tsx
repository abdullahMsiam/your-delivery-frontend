"use client";

import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IdentityCard } from "@/src/features/users/components/identity-card";
import { EditProfileForm } from "@/src/features/users/components/edit-profile-form";
import { ChangePasswordForm } from "@/src/features/users/components/change-password-form";
import { useMe } from "@/src/features/users/hooks/use-me";
import { StatsSkeleton, CardSkeleton } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  return (
    <RoleGuard allow={[UserRole.CUSTOMER, UserRole.AGENT, UserRole.ADMIN]}>
      <ProfileContent />
    </RoleGuard>
  );
}

function ProfileContent() {
  const { data: user, isLoading, isError, refetch } = useMe();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Header />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <CardSkeleton />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <StatsSkeleton count={0} />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="space-y-6">
        <Header />
        <Card className="rounded-2xl border-destructive/30">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-destructive font-medium">
              Couldn`t load your profile
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: identity */}
        <div className="lg:col-span-1">
          <IdentityCard user={user} />
        </div>

        {/* Right: forms */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Profile information</CardTitle>
              <p className="text-sm text-muted-foreground">
                Update your name and phone number. Your email can`t be changed.
              </p>
            </CardHeader>
            <CardContent>
              <EditProfileForm user={user} />
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Security</CardTitle>
              <p className="text-sm text-muted-foreground">
                Change your password. Choose something strong.
              </p>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Profile & settings
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your account details and security.
      </p>
    </div>
  );
}
