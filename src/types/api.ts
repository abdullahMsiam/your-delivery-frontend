import type {
  DeliveryStatus,
  NotificationType,
  PaymentMethod,
  PaymentStatus,
  UserRole,
} from "./enums";

/* -------------------------------------------------------------------------- */
/*                              Response envelope                             */
/* -------------------------------------------------------------------------- */

export interface ApiResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: ZodIssue[];
}

export interface ZodIssue {
  code: string;
  path: (string | number)[];
  message: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** List endpoints put `data` + `pagination` at the top level. */
export interface PaginatedResponse<T> {
  success: true;
  message: string;
  data: T[];
  pagination: Pagination;
}

/* -------------------------------------------------------------------------- */
/*                                   Users                                    */
/* -------------------------------------------------------------------------- */

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

/* -------------------------------------------------------------------------- */
/*                                   Auth                                     */
/* -------------------------------------------------------------------------- */

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

/* -------------------------------------------------------------------------- */
/*                                 Addresses                                  */
/* -------------------------------------------------------------------------- */
export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
}

/** Payload sent when creating a delivery. */
export interface AddressInput {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
}

/* -------------------------------------------------------------------------- */
/*                                  Payment                                   */
/* -------------------------------------------------------------------------- */

export interface Payment {
  id: string;
  deliveryId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  /** Decimal-as-string. Parse with Number() for display. */
  amount: string;
  stripePaymentId: string | null;
  stripeClientSecret: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

/* -------------------------------------------------------------------------- */
/*                              Status history                                */
/* -------------------------------------------------------------------------- */

export interface HistoryEntry {
  id: string;
  deliveryId: string;
  status: DeliveryStatus;
  note: string | null;
  /** UUID of the user who made the change. */
  updatedBy: string | null;
  createdAt: string;
}

export interface DeliveryHistory {
  deliveryId: string;
  trackingId: string;
  history: HistoryEntry[];
}

/* -------------------------------------------------------------------------- */
/*                                 Delivery                                   */
/* -------------------------------------------------------------------------- */

export interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
}

export interface Delivery {
  id: string;
  trackingId: string;
  customerId: string;
  agentId: string | null;

  pickupAddressId: string;
  deliveryAddressId: string;

  parcelType: string;
  /** Decimal-as-string. */
  weight: string;
  /** Decimal-as-string. */
  deliveryCharge: string;
  /** Decimal-as-string. */
  codAmount: string;

  status: DeliveryStatus;

  createdAt: string;
  updatedAt: string;

  pickupAddress: Address;
  deliveryAddress: Address;

  payment: Payment | null;

  /** Only present on the `/deliveries/{id}` detail endpoint. */
  statusHistory?: HistoryEntry[];
  /** Only present on the `/deliveries/{id}` detail endpoint. */
  agent?: DeliveryAgent | null;
}

export interface DeliveryDetail extends Delivery {
  statusHistory: HistoryEntry[];
  agent: DeliveryAgent | null;
}

export interface CreateDeliveryInput {
  pickupAddress: AddressInput;
  deliveryAddress: AddressInput;
  parcelType: string;
  weight: number;
  deliveryCharge: number;
  codAmount?: number;
  paymentMethod: PaymentMethod;
}

/* -------------------------------------------------------------------------- */
/*                          Public tracking response                          */
/* -------------------------------------------------------------------------- */

export interface TrackingHistoryEntry {
  id: string;
  deliveryId: string;
  status: DeliveryStatus;
  note: string | null;
  /** UUID of the user who made the change */
  updatedBy: string | null;
  createdAt: string;
}

export interface TrackingAddress {
  id: string;
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingPayment {
  id: string;
  deliveryId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  /** decimal-as-string */
  amount: string;
  stripePaymentId: string | null;
  stripeClientSecret: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingResponse {
  id: string;
  trackingId: string;
  customerId: string;
  agentId: string | null;
  pickupAddressId: string;
  deliveryAddressId: string;

  parcelType: string;
  /** decimal-as-string */
  weight: string;
  /** decimal-as-string */
  deliveryCharge: string;
  /** decimal-as-string */
  codAmount: string;
  status: DeliveryStatus;

  createdAt: string;
  updatedAt: string;

  pickupAddress: TrackingAddress;
  deliveryAddress: TrackingAddress;

  statusHistory: TrackingHistoryEntry[];

  payment: TrackingPayment | null;
}

/* -------------------------------------------------------------------------- */
/*                              Delivery input                                */
/* -------------------------------------------------------------------------- */

export interface CreateDeliveryInput {
  pickupAddress: AddressInput;
  deliveryAddress: AddressInput;
  parcelType: string;
  weight: number;
  deliveryCharge: number;
  codAmount?: number;
  paymentMethod: PaymentMethod;
}

/* -------------------------------------------------------------------------- */
/*                             Agent endpoints                                */
/* -------------------------------------------------------------------------- */

// export interface AgentStatistics {
//   totalAssigned: number;
//   activeDeliveries: number;
//   completedDeliveries: number;
//   delivered: number;
//   failed: number;
//   cancelled: number;
//   statusBreakdown: {
//     assigned: number;
//     pickedUp: number;
//     inTransit: number;
//     outForDelivery: number;
//   };
//   successRate: number; // 0–100
// }

export interface AgentStatisticsAgent {
  id: string;
  name: string;
  role: UserRole;
  isActive: boolean;
}

export interface AgentStatisticsNumbers {
  totalAssigned: number;
  activeDeliveries: number;
  completedDeliveries: number;
  delivered: number;
  failed: number;
  cancelled: number;
  statusBreakdown: {
    assigned: number;
    pickedUp: number;
    inTransit: number;
    outForDelivery: number;
  };
  /** 0–100 */
  successRate: number;
}

export interface AgentStatistics {
  agent: AgentStatisticsAgent;
  statistics: AgentStatisticsNumbers;
}

/* -------------------------------------------------------------------------- */
/*                             Admin endpoints                                */
/* -------------------------------------------------------------------------- */

export interface AdminDashboard {
  deliveries: {
    total: number;
    pending: number;
    assigned: number;
    pickedUp: number;
    inTransit: number;
    outForDelivery: number;
    delivered: number;
    cancelled: number;
    failed: number;
  };
  users: {
    totalCustomers: number;
    totalAgents: number;
    activeAgents: number;
    inactiveAgents: number;
  };
  payments: {
    total: number;
    paid: number;
    pending: number;
    processing: number;
    failed: number;
    cancelled: number;
    refunded: number;
    stripe: number;
    cod: number;
  };
  revenue: {
    totalPaid: string;
    totalPending: string;
  };
  recentDeliveries: Delivery[];
  recentUsers: User[];
}

export interface AdminUsersResponse {
  users: User[];
  pagination: Pagination;
}

/* -------------------------------------------------------------------------- */
/*                              Notifications                                 */
/* -------------------------------------------------------------------------- */

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface MarkAllReadResponse {
  updatedCount: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: ZodIssue[];
}

export interface ZodIssue {
  code: string;
  path: (string | number)[];
  message: string;
}
