import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DELIVERY_STATUS_META, DeliveryStatus, PAYMENT_STATUS_META, PaymentStatus } from "@/src/types";
;

export function DeliveryStatusBadge({
  status,
  className,
}: {
  status: DeliveryStatus;
  className?: string;
}) {
  const meta = DELIVERY_STATUS_META[status];
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", meta.className, className)}
    >
      {meta.label}
    </Badge>
  );
}

export function PaymentStatusBadge({
  status,
  className,
}: {
  status: PaymentStatus;
  className?: string;
}) {
  const meta = PAYMENT_STATUS_META[status];
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", meta.className, className)}
    >
      {meta.label}
    </Badge>
  );
}