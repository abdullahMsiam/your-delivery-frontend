import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
import { AdminDeliveryDetailView } from "@/src/features/admin/components/admin-delivery-detail-view";
import { fetchAdminDeliveryDetail } from "@/lib/api/deliveries-server";

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

export default async function AdminDeliveryDetailPage({ params }: PageProps) {
  const { id } = await params;

  const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(id)) notFound();

  const delivery = await fetchAdminDeliveryDetail(id);
  if (!delivery) notFound();

  return (
    <RoleGuard allow={[UserRole.ADMIN]}>
      <AdminDeliveryDetailView delivery={delivery} />
    </RoleGuard>
  );
}
