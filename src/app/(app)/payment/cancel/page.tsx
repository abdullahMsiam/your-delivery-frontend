"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, RefreshCw, XCircle } from "lucide-react";

import { Container } from "@/components/shared/container";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

export default function PaymentCancelPage() {
  return (
    <RoleGuard allow={[UserRole.CUSTOMER]}>
      <Suspense fallback={null}>
        <CancelContent />
      </Suspense>
    </RoleGuard>
  );
}

function CancelContent() {
  const params = useSearchParams();
  const deliveryId = params.get("deliveryId");

  const retryHref = deliveryId
    ? `/dashboard/payments/pay/${deliveryId}`
    : "/dashboard/deliveries";

  const deliveryHref = deliveryId
    ? `/dashboard/deliveries/${deliveryId}`
    : "/dashboard/deliveries";

  return (
    <Container className="py-14 max-w-lg">
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <XCircle className="h-8 w-8" />
          </span>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Payment cancelled
            </h1>
            <p className="text-sm text-muted-foreground max-w-sm text-pretty">
              No worries — nothing was charged. You can retry whenever you`re
              ready, or switch to cash on delivery from the delivery page.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 w-full sm:w-auto">
            {deliveryId && (
              <Link
                href={retryHref}
                className={cn(buttonVariants(), "gap-2 w-full sm:w-auto")}
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </Link>
            )}
            <Link
              href={deliveryHref}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "gap-2 w-full sm:w-auto",
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to delivery
            </Link>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
