"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Scale,
  Truck,
  User,
  Wallet,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DeliveryStatusBadge,
  PaymentStatusBadge,
} from "@/components/shared/status-badge";
import { CopyButton } from "@/components/shared/copy-button";
import { UserAvatar } from "@/components/shared/user-avatar";
import { StatusTimeline } from "@/src/features/tracking/components/status-timeline";
import { AssignAgentDialog } from "@/src/features/admin/components/assign-agent-dialog";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DeliveryDetail } from "@/src/types";
// import { AdminCancelDeliveryDialog } from "./admin-cancel-dialog";
import { AdminCancelDeliveryDialog } from "@/src/features/admin/components/admin-cancel-dialog";
import { AdminDeliveryDetail } from "@/lib/api/deliveries-server";

// interface Props {
//   delivery: DeliveryDetail & {
//     customer?: { id: string; name: string; phone: string } | null;
//     agent?: { id: string; name: string; phone: string } | null;
//   };
// }

interface Props {
  delivery: AdminDeliveryDetail;
}

export function AdminDeliveryDetailView({ delivery }: Props) {
  const router = useRouter();
  const qc = useQueryClient();

  const canAssign = delivery.status === "PENDING";
  const canReassign = delivery.status === "ASSIGNED";
  const canCancel =
    delivery.status !== "DELIVERED" && delivery.status !== "CANCELLED";

  const onAnySuccess = () => {
    router.refresh();
    qc.invalidateQueries({ queryKey: ["admin"] });
    qc.invalidateQueries({ queryKey: ["deliveries"] });
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/admin/deliveries"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all deliveries
      </Link>

      {/* Header card + actions */}
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

        {(canAssign || canReassign || canCancel) && (
          <div className="p-6 sm:p-8 bg-muted/20 flex flex-wrap items-center gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mr-2">
              Actions
            </p>

            {canAssign && (
              <AssignAgentDialog
                deliveryId={delivery.id}
                trackingId={delivery.trackingId}
                mode="assign"
                onSuccess={onAnySuccess}
              />
            )}

            {canReassign && (
              <AssignAgentDialog
                deliveryId={delivery.id}
                trackingId={delivery.trackingId}
                mode="reassign"
                currentAgentId={delivery.agentId}
                onSuccess={onAnySuccess}
              />
            )}

            {canCancel && (
              <AdminCancelDeliveryDialog
                deliveryId={delivery.id}
                trackingId={delivery.trackingId}
                onSuccess={onAnySuccess}
              />
            )}
          </div>
        )}
      </Card>

      {/* People cards: customer + agent */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Customer */}
        {delivery.customer && (
          <Card className="rounded-2xl border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <UserAvatar name={delivery.customer.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {delivery.customer.name}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {delivery.customer.phone}
                  </p>
                </div>
                <a
                  href={`tel:${delivery.customer.phone}`}
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

        {/* Agent */}
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Delivery agent</CardTitle>
          </CardHeader>
          <CardContent>
            {delivery.agent ? (
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Truck className="h-5 w-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{delivery.agent.name}</p>
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
            ) : (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4" />
                </span>
                Not assigned yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Route */}
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

      {/* Parcel + payment */}
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
            label="COD amount"
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
                <span className="text-sm font-medium">
                  {formatCurrency(delivery.payment.amount)}
                </span>
              </div>
              {delivery.payment.paidAt && (
                <span className="text-xs text-muted-foreground">
                  Paid {formatDateTime(delivery.payment.paidAt)}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline */}
      {delivery.statusHistory && delivery.statusHistory.length > 0 && (
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
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Sub-components                                 */
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
