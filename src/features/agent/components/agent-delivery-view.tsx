"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  Phone,
  Scale,
  User,
  Wallet,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DeliveryStatusBadge,
  PaymentStatusBadge,
} from "@/components/shared/status-badge";
import { CopyButton } from "@/components/shared/copy-button";
import { StatusTimeline } from "@/src/features/tracking/components/status-timeline";
import { UpdateStatusDialog } from "@/src/features/agent/components/update-status-dialog";
import { useMarkCodPaid } from "@/src/features/agent/hooks/use-mark-cod-paid";
import { NEXT_STEPS } from "@/src/features/agent/next-status";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { DeliveryDetail, DeliveryStatus } from "@/src/types";

interface Props {
  delivery: DeliveryDetail;
}

export function AgentDeliveryDetailView({ delivery }: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const nextSteps = NEXT_STEPS[delivery.status] ?? [];

  const canMarkCodPaid =
    delivery.status === "DELIVERED" &&
    delivery.payment?.method === "COD" &&
    delivery.payment?.status !== "PAID" &&
    delivery.payment?.status !== "CANCELLED" &&
    delivery.payment?.status !== "REFUNDED";

  const codPaidMutation = useMarkCodPaid();

  const onAnySuccess = () => {
    // Re-fetch the server component → picks up new status from backend
    router.refresh();
    // Also invalidate the agent-side list/detail caches
    qc.invalidateQueries({ queryKey: ["agent"] });
    qc.invalidateQueries({ queryKey: ["deliveries"] });
  };

  return (
    <div className="space-y-6">
      {/* -------------------------- Back ------------------------- */}
      <Link
        href="/provider/deliveries"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to assigned deliveries
      </Link>

      {/* ---------------------- Header card ---------------------- */}
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

        {/* --------------------- Workflow actions ------------------ */}
        {(nextSteps.length > 0 || canMarkCodPaid) && (
          <div className="p-6 sm:p-8 bg-muted/20 border-b border-border/60">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">
              Available actions
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {nextSteps.map((opt) => (
                <UpdateStatusDialog
                  key={opt.status}
                  deliveryId={delivery.id}
                  trackingId={delivery.trackingId}
                  nextStatus={opt.status}
                  label={opt.label}
                  description={opt.description}
                  variant={
                    opt.tone === "danger"
                      ? "destructive"
                      : opt.tone === "success"
                        ? "default"
                        : "outline"
                  }
                  onSuccess={onAnySuccess}
                />
              ))}

              {canMarkCodPaid && (
                <Button
                  variant="default"
                  onClick={() =>
                    codPaidMutation.mutate(delivery.id, {
                      onSuccess: onAnySuccess,
                    })
                  }
                  disabled={codPaidMutation.isPending}
                  className="gap-2"
                >
                  {codPaidMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Recording…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Mark COD paid
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* --------------------- Customer card --------------------- */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{delivery.pickupAddress.name}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                {delivery.pickupAddress.phone}
              </p>
            </div>
            <a
              href={`tel:${delivery.pickupAddress.phone}`}
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

      {/* ---------------------- Route card ----------------------- */}
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

      {/* --------------------- Parcel card ----------------------- */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Parcel & payment</CardTitle>
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
            label="Collect (COD)"
            value={
              Number(delivery.codAmount) > 0
                ? formatCurrency(delivery.codAmount)
                : "—"
            }
          />

          {delivery.payment && (
            <div className="sm:col-span-2 lg:col-span-4 mt-2 pt-4 border-t border-border/60 flex flex-wrap items-center gap-4 justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Payment
                </span>
                <PaymentStatusBadge status={delivery.payment.status} />
                <span className="text-sm text-muted-foreground">
                  {delivery.payment.method === "STRIPE"
                    ? "Online (Stripe)"
                    : "Cash on delivery"}
                </span>
              </div>
              {delivery.payment.paidAt && (
                <span className="text-xs text-muted-foreground">
                  Paid on {formatDateTime(delivery.payment.paidAt)}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* --------------------- Timeline -------------------------- */}
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
/*                            Sub-components                                  */
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
