import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
import { DeliveryDetailView } from "@/src/features/deliveries/components/delivery-detail-view";
import { fetchDeliveryDetail } from "@/lib/api/deliveries-server";
// import { fetchDeliveryDetail } from "@/lib/api/deliveries-server";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Delivery ${id.slice(0, 8)}`,
    robots: { index: false, follow: false },
  };
}

export default async function DeliveryDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Validate UUID format early (backend will 404 otherwise, but this is cheaper).
  const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(id)) notFound();

  const delivery = await fetchDeliveryDetail(id);
  if (!delivery) notFound();

  return (
    <RoleGuard allow={[UserRole.CUSTOMER]}>
      <DeliveryDetailView delivery={delivery} />
    </RoleGuard>
  );
}
