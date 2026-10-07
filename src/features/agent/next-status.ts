import type { DeliveryStatus } from "@/src/types";

interface NextOption {
  status: DeliveryStatus;
  label: string;
  tone: "default" | "success" | "danger";
  description: string;
}

/**
 * The valid next steps from each status, per the API guide:
 * ASSIGNED → PICKED_UP → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED | FAILED
 */
export const NEXT_STEPS: Record<DeliveryStatus, NextOption[]> = {
  PENDING: [], // agent never sees PENDING (admin assigns first)
  ASSIGNED: [
    {
      status: "PICKED_UP",
      label: "Mark as picked up",
      tone: "default",
      description: "Confirm you have collected the parcel from the customer.",
    },
  ],
  PICKED_UP: [
    {
      status: "IN_TRANSIT",
      label: "Start transit",
      tone: "default",
      description: "You're now on the way to the delivery address.",
    },
  ],
  IN_TRANSIT: [
    {
      status: "OUT_FOR_DELIVERY",
      label: "Out for delivery",
      tone: "default",
      description: "You've arrived in the delivery area.",
    },
  ],
  OUT_FOR_DELIVERY: [
    {
      status: "DELIVERED",
      label: "Mark as delivered",
      tone: "success",
      description: "The recipient has received the parcel.",
    },
    {
      status: "FAILED",
      label: "Mark as failed",
      tone: "danger",
      description:
        "Delivery could not be completed (add a reason in the note).",
    },
  ],
  DELIVERED: [],
  CANCELLED: [],
  FAILED: [],
};
