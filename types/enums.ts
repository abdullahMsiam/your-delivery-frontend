export const UserRole = {
  CUSTOMER: "CUSTOMER",
  AGENT: "AGENT",
  ADMIN: "ADMIN",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const DeliveryStatus = {
  PENDING: "PENDING",
  ASSIGNED: "ASSIGNED",
  PICKED_UP: "PICKED_UP",
  IN_TRANSIT: "IN_TRANSIT",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  FAILED: "FAILED",
} as const;
export type DeliveryStatus =
  (typeof DeliveryStatus)[keyof typeof DeliveryStatus];

export const PaymentMethod = {
  STRIPE: "STRIPE",
  COD: "COD",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PaymentStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  PAID: "PAID",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const NotificationType = {
  DELIVERY_ASSIGNED: "DELIVERY_ASSIGNED",
  DELIVERY_STATUS_UPDATED: "DELIVERY_STATUS_UPDATED",
  DELIVERY_DELIVERED: "DELIVERY_DELIVERED",
  DELIVERY_CANCELLED: "DELIVERY_CANCELLED",
  PAYMENT_PAID: "PAYMENT_PAID",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  COD_PAYMENT_RECEIVED: "COD_PAYMENT_RECEIVED",
} as const;
export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

/**
 * Human-readable labels + Tailwind classes for status badges.
 * Kept here so UI stays consistent everywhere.
 */
export const DELIVERY_STATUS_META: Record<
  DeliveryStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900",
  },
  ASSIGNED: {
    label: "Assigned",
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-900",
  },
  PICKED_UP: {
    label: "Picked Up",
    className:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900",
  },
  IN_TRANSIT: {
    label: "In Transit",
    className:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-900",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    className:
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900",
  },
  DELIVERED: {
    label: "Delivered",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-900",
  },
  CANCELLED: {
    label: "Cancelled",
    className:
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
  },
  FAILED: {
    label: "Failed",
    className:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900",
  },
};

export const PAYMENT_STATUS_META: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900",
  },
  PROCESSING: {
    label: "Processing",
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-900",
  },
  PAID: {
    label: "Paid",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-900",
  },
  FAILED: {
    label: "Failed",
    className:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900",
  },
  CANCELLED: {
    label: "Cancelled",
    className:
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
  },
  REFUNDED: {
    label: "Refunded",
    className:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-900",
  },
};

export const USER_ROLE_META: Record<
  UserRole,
  { label: string; className: string }
> = {
  CUSTOMER: {
    label: "Customer",
    className:
      "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  },
  AGENT: {
    label: "Agent",
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-900",
  },
  ADMIN: {
    label: "Admin",
    className:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900",
  },
};
