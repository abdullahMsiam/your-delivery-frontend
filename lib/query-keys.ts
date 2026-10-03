/**
 * Centralized TanStack Query keys.
 * Every useQuery / invalidateQueries call MUST use these.
 * Add new groups as features are built.
 */
export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },

  deliveries: {
    all: ["deliveries"] as const,
    myList: (params?: Record<string, unknown>) =>
      ["deliveries", "my-list", params ?? {}] as const,
    detail: (id: string) => ["deliveries", "detail", id] as const,
    history: (id: string) => ["deliveries", "history", id] as const,
    track: (trackingId: string) => ["deliveries", "track", trackingId] as const,
  },

  agent: {
    me: ["agent", "me"] as const,
    statistics: ["agent", "statistics"] as const,
    deliveries: (params?: Record<string, unknown>) =>
      ["agent", "deliveries", params ?? {}] as const,
  },

  admin: {
    dashboard: ["admin", "dashboard"] as const,
    deliveries: (params?: Record<string, unknown>) =>
      ["admin", "deliveries", params ?? {}] as const,
    deliveryDetail: (id: string) =>
      ["admin", "deliveries", "detail", id] as const,
    users: (params?: Record<string, unknown>) =>
      ["admin", "users", params ?? {}] as const,
    userDetail: (id: string) => ["admin", "users", "detail", id] as const,
    agentProfile: (id: string) => ["admin", "agents", id] as const,
    agentStatistics: (id: string) =>
      ["admin", "agents", id, "statistics"] as const,
  },

  payments: {
    byDelivery: (deliveryId: string) =>
      ["payments", "by-delivery", deliveryId] as const,
  },

  notifications: {
    all: ["notifications"] as const,
    list: (params?: Record<string, unknown>) =>
      ["notifications", "list", params ?? {}] as const,
    unreadCount: ["notifications", "unread-count"] as const,
  },

  users: {
    me: ["users", "me"] as const,
  },
} as const;
