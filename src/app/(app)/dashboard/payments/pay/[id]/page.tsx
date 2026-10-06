import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
// import { PaymentPageClient } from "@/src/features/payments/components/payment-page-client";
import { isStripeConfigured } from "@/lib/stripe";
import {
  createPaymentIntentServer,
  fetchDeliveryForPay,
} from "@/lib/api/payments-server";
import { cn } from "@/lib/utils";
import { PaymentPageClient } from "@/src/features/payments/components/payment-page-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Pay for delivery",
  robots: { index: false, follow: false },
};

export default async function PayPage({ params }: PageProps) {
  const { id } = await params;

  if (!isStripeConfigured) return <ConfigError />;

  const delivery = await fetchDeliveryForPay(id);
  if (!delivery) notFound();

  if (!delivery.payment) {
    return <NotPayable reason="This delivery has no payment record." />;
  }

  if (delivery.payment.method !== "STRIPE") {
    redirect(`/dashboard/deliveries/${delivery.id}`);
  }

  if (
    delivery.payment.status === "PAID" ||
    delivery.payment.status === "REFUNDED"
  ) {
    redirect(`/payment/success?deliveryId=${delivery.id}`);
  }

  if (delivery.payment.status === "CANCELLED") {
    return (
      <NotPayable reason="This payment has been cancelled. Contact support if this is unexpected." />
    );
  }

  if (delivery.status === "CANCELLED") {
    return (
      <NotPayable reason="This delivery has been cancelled, so there's nothing to pay." />
    );
  }

  if (delivery.status === "FAILED") {
    return (
      <NotPayable reason="This delivery failed. No payment is required." />
    );
  }

  let clientSecret: string;
  try {
    const intent = await createPaymentIntentServer(delivery.id);
    clientSecret = intent.clientSecret;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to initialize payment";
    return <NotPayable reason={message} />;
  }

  return (
    <RoleGuard allow={[UserRole.CUSTOMER]}>
      <PaymentPageClient delivery={delivery} clientSecret={clientSecret} />
    </RoleGuard>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Fallbacks                                     */
/* -------------------------------------------------------------------------- */

function ConfigError() {
  return (
    <Container className="py-20 max-w-xl">
      <Card className="rounded-2xl border-destructive/30 shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-7 w-7" />
          </span>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">
              Payments aren`t configured
            </h2>
            <p className="text-sm text-muted-foreground">
              `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is missing.
            </p>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}

function NotPayable({ reason }: { reason: string }) {
  return (
    <Container className="py-20 max-w-xl">
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Nothing to pay</h2>
            <p className="text-sm text-muted-foreground max-w-sm text-pretty">
              {reason}
            </p>
          </div>
          <Link
            href="/dashboard/deliveries"
            className={cn(buttonVariants({ variant: "outline" }), "mt-2")}
          >
            Back to deliveries
          </Link>
        </CardContent>
      </Card>
    </Container>
  );
}
