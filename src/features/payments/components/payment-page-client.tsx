"use client";

import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import { ArrowLeft, CreditCard } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentForm } from "@/src/features/payments/components/payment-form";
import { getStripe } from "@/lib/stripe";
import { formatCurrency } from "@/lib/format";
import type { DeliveryDetail } from "@/src/types";

interface Props {
  delivery: DeliveryDetail;
  clientSecret: string;
}

export function PaymentPageClient({ delivery, clientSecret }: Props) {
  const stripePromise = getStripe();
  const amount = delivery.payment?.amount ?? "0";

  return (
    <Container className="py-10 max-w-2xl">
      <div className="space-y-6">
        <Link
          href={`/dashboard/deliveries/${delivery.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to delivery
        </Link>

        <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-background to-primary/5 px-6 sm:px-8 py-6 border-b border-border/60">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Paying for
                </p>
                <p className="mt-1 font-mono text-base font-semibold">
                  {delivery.trackingId}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {delivery.pickupAddress.city} →{" "}
                  {delivery.deliveryAddress.city}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Amount
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">
                  {formatCurrency(amount)}
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4 text-primary" />
              Card payment (Stripe test mode)
            </div>

            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#dc2626",
                    borderRadius: "8px",
                  },
                },
              }}
            >
              <PaymentForm deliveryId={delivery.id} amount={amount} />
            </Elements>
          </CardContent>
        </Card>

        <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 p-4 text-sm">
          <p className="font-medium">Test mode</p>
          <p className="mt-1 text-muted-foreground">
            Use card number{" "}
            <span className="font-mono text-foreground">
              4242 4242 4242 4242
            </span>
            , any future expiry, any CVC, any postal code.
          </p>
        </div>
      </div>
    </Container>
  );
}
