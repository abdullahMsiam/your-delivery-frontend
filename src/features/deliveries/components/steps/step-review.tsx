"use client";

import {
  ArrowRight,
  CreditCard,
  MapPin,
  Package,
  Scale,
  Wallet,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import type { AddressInput, PaymentMethod } from "@/src/types";

interface Props {
  pickupAddress: AddressInput;
  deliveryAddress: AddressInput;
  parcel: {
    parcelType: string;
    weight: number | "";
    deliveryCharge: number | "";
    codAmount: number | "";
  };
  paymentMethod: PaymentMethod;
}

export function StepReview({
  pickupAddress,
  deliveryAddress,
  parcel,
  paymentMethod,
}: Props) {
  const charge =
    parcel.deliveryCharge === "" ? 0 : Number(parcel.deliveryCharge);

  return (
    <div className="space-y-5">
      {/* Addresses side by side */}
      <div className="grid gap-5 md:grid-cols-2">
        <AddressCard
          title="Pickup from"
          icon={MapPin}
          address={pickupAddress}
        />
        <AddressCard
          title="Deliver to"
          icon={MapPin}
          address={deliveryAddress}
        />
      </div>

      {/* Parcel */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Parcel
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Stat
              icon={Package}
              label="Type"
              value={parcel.parcelType || "—"}
            />
            <Stat
              icon={Scale}
              label="Weight"
              value={
                parcel.weight === ""
                  ? "—"
                  : `${Number(parcel.weight).toFixed(2)} kg`
              }
            />
            <Stat
              icon={CreditCard}
              label="Delivery charge"
              value={formatCurrency(charge)}
            />
          </div>

          {parcel.codAmount !== "" && Number(parcel.codAmount) > 0 && (
            <div className="mt-4 rounded-lg border border-dashed border-border/60 bg-muted/40 p-3 text-sm">
              <span className="text-muted-foreground">Cash on delivery: </span>
              <span className="font-medium">
                {formatCurrency(Number(parcel.codAmount))}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {paymentMethod === "STRIPE" ? (
                <CreditCard className="h-5 w-5" />
              ) : (
                <Wallet className="h-5 w-5" />
              )}
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Payment method
              </p>
              <p className="font-medium">
                {paymentMethod === "STRIPE"
                  ? "Pay online (Stripe)"
                  : "Cash on delivery"}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="font-medium">
            {paymentMethod === "STRIPE"
              ? `Will charge ${formatCurrency(charge)}`
              : "Pay on arrival"}
          </Badge>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        By confirming, you agree to our delivery terms. You can cancel a
        delivery up until it`s picked up.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Address card                                  */
/* -------------------------------------------------------------------------- */

function AddressCard({
  title,
  icon: Icon,
  address,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  address: AddressInput;
}) {
  return (
    <Card className="rounded-2xl border-border/60 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Icon className="h-3.5 w-3.5 text-primary" />
          {title}
        </div>
        <div className="mt-3 space-y-0.5 text-sm">
          <p className="font-medium">{address.name}</p>
          <p className="text-muted-foreground">{address.phone}</p>
          <p className="text-muted-foreground">{address.addressLine}</p>
          <p className="text-muted-foreground">
            {address.city}, {address.postalCode}
          </p>
        </div>
      </CardContent>
    </Card>
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
