import { ArrowRight, MapPin } from "lucide-react";
import { DeliveryStatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatRelative } from "@/lib/format";
import type { Delivery } from "@/src/types";

/** Tracking ID + parcel type. */
export function DeliveryIdentityCell({ delivery }: { delivery: Delivery }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="font-mono text-xs font-semibold truncate">
        {delivery.trackingId}
      </span>
      <span className="text-xs text-muted-foreground truncate">
        {delivery.parcelType} · {Number(delivery.weight).toFixed(2)} kg
      </span>
    </div>
  );
}

/** Pickup → Delivery mini route. */
export function DeliveryRouteCell({ delivery }: { delivery: Delivery }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
      <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
      <span className="truncate">{delivery.pickupAddress.city}</span>
      <ArrowRight className="h-3 w-3 shrink-0 opacity-50" />
      <span className="truncate">{delivery.deliveryAddress.city}</span>
    </div>
  );
}

/** Amount + payment status. */
export function DeliveryAmountCell({ delivery }: { delivery: Delivery }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-medium">
        {formatCurrency(delivery.deliveryCharge)}
      </span>
      <span className="text-xs text-muted-foreground">
        {delivery.payment?.method === "COD"
          ? "Cash on delivery"
          : "Online payment"}
      </span>
    </div>
  );
}

/** Status + created-at relative. */
export function DeliveryStatusCell({ delivery }: { delivery: Delivery }) {
  return (
    <div className="flex flex-col gap-1 items-start">
      <DeliveryStatusBadge status={delivery.status} />
      <span className="text-xs text-muted-foreground">
        {formatRelative(delivery.createdAt)}
      </span>
    </div>
  );
}
