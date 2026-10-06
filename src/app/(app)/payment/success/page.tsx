"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  XCircle,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
import { PaymentStatusBadge } from "@/components/shared/status-badge";
import { usePaymentStatus } from "@/src/features/payments/hooks/use-payment-status";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function PaymentSuccessPage() {
  return (
    <RoleGuard allow={[UserRole.CUSTOMER, UserRole.AGENT, UserRole.ADMIN]}>
      <React.Suspense fallback={<LoadingFallback />}>
        <SuccessContent />
      </React.Suspense>
    </RoleGuard>
  );
}

function LoadingFallback() {
  return (
    <Container className="py-14 max-w-lg">
      <Card className="rounded-2xl border-border/60">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </CardContent>
      </Card>
    </Container>
  );
}

function SuccessContent() {
  const params = useSearchParams();
  const deliveryId = params.get("deliveryId");

  const {
    data: payment,
    isLoading,
    isError,
  } = usePaymentStatus({
    deliveryId,
  });

  /* ---------------------------- Missing param ---------------------------- */
  if (!deliveryId) {
    return (
      <MessageCard
        icon={XCircle}
        tone="danger"
        title="Missing delivery reference"
        description="We couldn't determine which payment you're looking at. Open your deliveries to verify."
        primary={{ label: "Go to deliveries", href: "/dashboard/deliveries" }}
      />
    );
  }

  /* ---------------------------- Loading / polling ------------------------ */
  if (isLoading || !payment) {
    return (
      <MessageCard
        icon={Loader2}
        tone="muted"
        spin
        title="Confirming your payment"
        description="This usually takes a few seconds. Please don't close this tab."
      />
    );
  }

  /* ---------------------------- Error ------------------------ */
  if (isError) {
    return (
      <MessageCard
        icon={XCircle}
        tone="danger"
        title="Couldn't load payment status"
        description="Your payment may still have gone through. Check your deliveries for the latest status."
        primary={{
          label: "View delivery",
          href: `/dashboard/deliveries/${deliveryId}`,
        }}
      />
    );
  }

  /* ---------------------------- Paid ---------------------------- */
  if (payment.status === "PAID") {
    return (
      <Container className="py-14 max-w-lg">
        <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-green-500/15 via-background to-green-500/5 px-6 py-10 text-center border-b border-border/60">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight">
              Payment successful
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your delivery is on its way. We`ll keep you posted.
            </p>
          </div>

          <CardContent className="p-6 space-y-5">
            <Row label="Tracking ID" valueClassName="font-mono text-sm">
              {payment.deliveryId.slice(0, 8)}…
            </Row>
            <Row label="Amount">
              <span className="text-lg font-semibold">
                {formatCurrency(payment.amount)}
              </span>
            </Row>
            <Row label="Method">
              {payment.method === "STRIPE"
                ? "Card (Stripe)"
                : "Cash on delivery"}
            </Row>
            {payment.paidAt && (
              <Row label="Paid on">{formatDateTime(payment.paidAt)}</Row>
            )}
            <Row label="Status">
              <PaymentStatusBadge status={payment.status} />
            </Row>
          </CardContent>

          <div className="border-t border-border/60 p-4 flex flex-col sm:flex-row gap-2">
            <Link
              href={`/dashboard/deliveries/${payment.deliveryId}`}
              className={cn(buttonVariants(), "flex-1 gap-2")}
            >
              <CreditCard className="h-4 w-4" />
              View delivery
            </Link>
            <Link
              href="/dashboard/deliveries"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "flex-1 gap-2",
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              All deliveries
            </Link>
          </div>
        </Card>
      </Container>
    );
  }

  /* ---------------------------- Processing ---------------------------- */
  if (payment.status === "PROCESSING" || payment.status === "PENDING") {
    return (
      <MessageCard
        icon={Clock}
        tone="warning"
        title="Payment is processing"
        description="We're waiting for the bank to confirm. This usually takes under a minute — check back on your delivery page."
        primary={{
          label: "View delivery",
          href: `/dashboard/deliveries/${payment.deliveryId}`,
        }}
        secondary={{
          label: "Go to deliveries",
          href: "/dashboard/deliveries",
        }}
      />
    );
  }

  /* ---------------------------- Failed / cancelled / refunded ---------- */
  return (
    <MessageCard
      icon={XCircle}
      tone="danger"
      title="Payment didn't complete"
      description={`Your payment status is "${payment.status}". You can retry the payment from the delivery page.`}
      primary={{
        label: "Retry payment",
        href: `/dashboard/payments/pay/${payment.deliveryId}`,
      }}
      secondary={{
        label: "View delivery",
        href: `/dashboard/deliveries/${payment.deliveryId}`,
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                              Small helpers                                 */
/* -------------------------------------------------------------------------- */

function Row({
  label,
  children,
  valueClassName,
}: {
  label: string;
  children: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium", valueClassName)}>{children}</span>
    </div>
  );
}

function MessageCard({
  icon: Icon,
  title,
  description,
  primary,
  secondary,
  tone = "muted",
  spin = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  tone?: "muted" | "danger" | "warning";
  spin?: boolean;
}) {
  const toneClass = {
    muted: "bg-muted text-muted-foreground",
    danger: "bg-destructive/10 text-destructive",
    warning: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
  }[tone];

  return (
    <Container className="py-14 max-w-lg">
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <span
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full",
              toneClass,
            )}
          >
            <Icon className={cn("h-7 w-7", spin && "animate-spin")} />
          </span>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground max-w-sm text-pretty">
              {description}
            </p>
          </div>

          {(primary || secondary) && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {primary && (
                <Link
                  href={primary.href}
                  className={cn(buttonVariants(), "gap-2")}
                >
                  {primary.label}
                </Link>
              )}
              {secondary && (
                <Link
                  href={secondary.href}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "gap-2",
                  )}
                >
                  {secondary.label}
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
