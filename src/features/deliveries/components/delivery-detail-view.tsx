"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Scale,
  Truck,
  User,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DeliveryStatusBadge,
  PaymentStatusBadge,
} from "@/components/shared/status-badge";
import { CopyButton } from "@/components/shared/copy-button";
import { StatusTimeline } from "@/src/features/tracking/components/status-timeline";
import { CancelDeliveryDialog } from "@/src/features/deliveries/components/cancel-delivery-dialog";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DeliveryDetail } from "@/src/types";

interface Props {
  delivery: DeliveryDetail;
}

const CANCELLABLE_STATUSES = ["PENDING", "ASSIGNED"] as const;

export function DeliveryDetailView({ delivery }: Props) {
  const router = useRouter();
  const canCancel = (CANCELLABLE_STATUSES as readonly string[]).includes(
    delivery.status,
  );
  const canPayStripe =
    delivery.payment?.method === "STRIPE" &&
    delivery.payment?.status !== "PAID" &&
    delivery.payment?.status !== "CANCELLED" &&
    delivery.payment?.status !== "REFUNDED";

  async function handlePayNow() {
    // Full Stripe flow lands in Section 6.
    toast.info("Payment flow coming in the next section.");
  }

  return (
    <div className="space-y-6">
      {/* -------------------------- Back + Actions -------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/deliveries"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to deliveries
        </Link>

        <div className="flex items-center gap-2">
          {canPayStripe && (
            <Button onClick={handlePayNow} className="gap-2">
              <CreditCard className="h-4 w-4" />
              Pay now
            </Button>
          )}
          {canCancel && (
            <CancelDeliveryDialog
              deliveryId={delivery.id}
              trackingId={delivery.trackingId}
              onSuccess={() => router.refresh()}
            />
          )}
        </div>
      </div>

      {/* -------------------------- Header card ---------------------------- */}
      <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-background to-primary/5 px-6 sm:px-8 py-6 border-b border-border/60">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Tracking ID
              </p>
              <div className="mt-1 flex items-center gap-2">
                <p className="font-mono text-lg font-semibold">
                  {delivery.trackingId}
                </p>
                <CopyButton value={delivery.trackingId} label="" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Created {formatDateTime(delivery.createdAt)}
              </p>
            </div>
            <DeliveryStatusBadge
              status={delivery.status}
              className="text-sm px-3 py-1"
            />
          </div>
        </div>
      </Card>

      {/* -------------------------- Parcel card ---------------------------- */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Parcel details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={Package} label="Type" value={delivery.parcelType} />
          <Stat
            icon={Scale}
            label="Weight"
            value={`${Number(delivery.weight).toFixed(2)} kg`}
          />
          <Stat
            icon={CreditCard}
            label="Delivery charge"
            value={formatCurrency(delivery.deliveryCharge)}
          />
          <Stat
            icon={Wallet}
            label="Cash on delivery"
            value={
              Number(delivery.codAmount) > 0
                ? formatCurrency(delivery.codAmount)
                : "—"
            }
          />
        </CardContent>
      </Card>

      {/* -------------------------- Route card ----------------------------- */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Route</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 md:grid-cols-2">
            <AddressBlock
              title="Pickup from"
              name={delivery.pickupAddress.name}
              phone={delivery.pickupAddress.phone}
              addressLine={delivery.pickupAddress.addressLine}
              city={delivery.pickupAddress.city}
              postalCode={delivery.pickupAddress.postalCode}
            />
            <AddressBlock
              title="Deliver to"
              name={delivery.deliveryAddress.name}
              phone={delivery.deliveryAddress.phone}
              addressLine={delivery.deliveryAddress.addressLine}
              city={delivery.deliveryAddress.city}
              postalCode={delivery.deliveryAddress.postalCode}
            />
          </div>
        </CardContent>
      </Card>

      {/* -------------------------- Payment card --------------------------- */}
      {delivery.payment && (
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {delivery.payment.method === "STRIPE" ? (
                    <CreditCard className="h-5 w-5" />
                  ) : (
                    <Wallet className="h-5 w-5" />
                  )}
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Method
                  </p>
                  <p className="font-medium">
                    {delivery.payment.method === "STRIPE"
                      ? "Online (Stripe)"
                      : "Cash on delivery"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Amount
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(delivery.payment.amount)}
                </p>
              </div>

              <PaymentStatusBadge status={delivery.payment.status} />
            </div>

            {delivery.payment.paidAt && (
              <p className="text-xs text-muted-foreground">
                Paid on {formatDateTime(delivery.payment.paidAt)}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* -------------------------- Agent card ----------------------------- */}
      {delivery.agent && (
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Delivery agent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Truck className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{delivery.agent.name}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  {delivery.agent.phone}
                </p>
              </div>
              <a
                href={`tel:${delivery.agent.phone}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "gap-2",
                )}
              >
                <Phone className="h-3.5 w-3.5" />
                Call
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* -------------------------- Timeline ------------------------------- */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Status history</CardTitle>
        </CardHeader>
        <CardContent>
          <StatusTimeline
            entries={delivery.statusHistory}
            currentStatus={delivery.status}
          />
        </CardContent>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Address block                                 */
/* -------------------------------------------------------------------------- */

function AddressBlock({
  title,
  name,
  phone,
  addressLine,
  city,
  postalCode,
}: {
  title: string;
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 text-primary" />
        {title}
      </div>
      <div className="space-y-0.5 text-sm">
        <p className="font-medium">{name}</p>
        <p className="text-muted-foreground flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5" />
          {phone}
        </p>
        <p className="text-muted-foreground pt-1">{addressLine}</p>
        <p className="text-muted-foreground">
          {city}, {postalCode}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Stat                                     */
/* -------------------------------------------------------------------------- */

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 font-medium truncate">{value}</p>
      </div>
    </div>
  );
}
