import {
  ArrowRight,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Scale,
  Truck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DeliveryStatusBadge } from "@/components/shared/status-badge";
import { PaymentStatusBadge } from "@/components/shared/status-badge";
import { TrackingResponse } from "@/src/types";
import { StatusTimeline } from "./status-timeline";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function TrackingResult({ data }: { data: TrackingResponse }) {
  return (
    <div className="space-y-6">
      {/* ------------------------------ Header card --------------------------- */}
      <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-background to-primary/5 px-6 sm:px-8 py-6 border-b border-border/60">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Tracking ID
              </p>
              <p className="mt-1 font-mono text-lg font-semibold">
                {data.trackingId}
              </p>
            </div>
            <DeliveryStatusBadge
              status={data.status}
              className="text-sm px-3 py-1"
            />
          </div>
        </div>

        <CardContent className="p-6 sm:p-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={Package} label="Parcel type" value={data.parcelType} />
          <Stat
            icon={Scale}
            label="Weight"
            value={`${Number(data.weight).toFixed(2)} kg`}
          />
          <Stat
            icon={Clock}
            label="Booked"
            value={formatDate(data.createdAt)}
          />
          <Stat
            icon={Clock}
            label="Last update"
            value={formatDate(data.updatedAt)}
          />
        </CardContent>
      </Card>

      {/* ------------------------------ Route card ---------------------------- */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Route
          </p>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Pickup */}
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Pickup</span>
              </div>
              <p className="mt-1 font-medium">
                {data.pickupAddress.city}, {data.pickupAddress.postalCode}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                {data.pickupAddress.addressLine}
              </p>
            </div>

            {/* Divider */}
            <div className="hidden sm:flex flex-1 items-center justify-center text-muted-foreground">
              <span className="flex-1 border-t border-dashed" />
              <Truck className="mx-2 h-4 w-4 text-primary" />
              <span className="flex-1 border-t border-dashed" />
            </div>

            {/* Delivery */}
            <div className="flex-1 sm:text-right">
              <div className="flex sm:justify-end items-center gap-2 text-sm text-muted-foreground">
                <span>Delivery</span>
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-1 font-medium">
                {data.deliveryAddress.city}, {data.deliveryAddress.postalCode}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                {data.deliveryAddress.addressLine}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------ Payment card -------------------------- */}
      {data.payment && (
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Payment
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CreditCard className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">Method</p>
                  <p className="font-medium">
                    {data.payment.method === "STRIPE"
                      ? "Online (Stripe)"
                      : "Cash on delivery"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground text-right">
                  Amount
                </p>
                <p className="font-medium text-right">
                  ${Number(data.payment.amount).toFixed(2)}
                </p>
              </div>

              <PaymentStatusBadge status={data.payment.status} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* ------------------------------ Timeline ----------------------------- */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Delivery history
          </p>
          <div className="mt-6">
            <StatusTimeline
              entries={data.statusHistory ?? []}
              currentStatus={data.status}
            />
          </div>
        </CardContent>
      </Card>
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
