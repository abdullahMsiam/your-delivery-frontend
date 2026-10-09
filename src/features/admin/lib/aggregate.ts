import type { Delivery } from "@/src/types";

/* -------------------------------------------------------------------------- */
/*                            Monthly aggregation                             */
/* -------------------------------------------------------------------------- */

export interface MonthlyBucket {
  month: string; // "2026-10"
  label: string; // "Oct 2026"
  deliveries: number;
  revenue: number; // sum of paid amounts
}

export function aggregateByMonth(deliveries: Delivery[]): MonthlyBucket[] {
  const map = new Map<string, MonthlyBucket>();

  for (const d of deliveries) {
    const date = new Date(d.createdAt);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}`;
    const label = date.toLocaleDateString(undefined, {
      month: "short",
      year: "numeric",
    });

    if (!map.has(month)) {
      map.set(month, { month, label, deliveries: 0, revenue: 0 });
    }
    const bucket = map.get(month)!;
    bucket.deliveries += 1;
    if (d.payment?.status === "PAID") {
      bucket.revenue += Number(d.payment.amount);
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.month.localeCompare(b.month),
  );
}

/* -------------------------------------------------------------------------- */
/*                              Top customers                                 */
/* -------------------------------------------------------------------------- */

export interface TopCustomer {
  id: string;
  name: string;
  phone: string;
  deliveries: number;
  spent: number;
}

export function aggregateTopCustomers(
  deliveries: Delivery[],
  limit = 5,
): TopCustomer[] {
  const map = new Map<string, TopCustomer>();

  for (const d of deliveries) {
    if (!d.customer) continue;
    const id = d.customer.id;
    if (!map.has(id)) {
      map.set(id, {
        id,
        name: d.customer.name,
        phone: d.customer.phone,
        deliveries: 0,
        spent: 0,
      });
    }
    const c = map.get(id)!;
    c.deliveries += 1;
    if (d.payment?.status === "PAID") {
      c.spent += Number(d.payment.amount);
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.deliveries - a.deliveries)
    .slice(0, limit);
}

/* -------------------------------------------------------------------------- */
/*                               Top agents                                   */
/* -------------------------------------------------------------------------- */

export interface TopAgent {
  id: string;
  name: string;
  phone: string;
  deliveries: number;
  delivered: number;
  failed: number;
}

export function aggregateTopAgents(
  deliveries: Delivery[],
  limit = 5,
): TopAgent[] {
  const map = new Map<string, TopAgent>();

  for (const d of deliveries) {
    if (!d.agent) continue;
    const id = d.agent.id;
    if (!map.has(id)) {
      map.set(id, {
        id,
        name: d.agent.name,
        phone: d.agent.phone,
        deliveries: 0,
        delivered: 0,
        failed: 0,
      });
    }
    const a = map.get(id)!;
    a.deliveries += 1;
    if (d.status === "DELIVERED") a.delivered += 1;
    if (d.status === "FAILED") a.failed += 1;
  }

  return Array.from(map.values())
    .sort((a, b) => b.deliveries - a.deliveries)
    .slice(0, limit);
}

/* -------------------------------------------------------------------------- */
/*                              Summary metrics                               */
/* -------------------------------------------------------------------------- */

export function computeSummary(deliveries: Delivery[]) {
  let delivered = 0;
  let cancelled = 0;
  let failed = 0;
  let revenue = 0;

  for (const d of deliveries) {
    if (d.status === "DELIVERED") delivered += 1;
    if (d.status === "CANCELLED") cancelled += 1;
    if (d.status === "FAILED") failed += 1;
    if (d.payment?.status === "PAID") {
      revenue += Number(d.payment.amount);
    }
  }

  const total = deliveries.length;
  const cancelRate = total === 0 ? 0 : (cancelled / total) * 100;

  return { total, delivered, cancelled, failed, revenue, cancelRate };
}
