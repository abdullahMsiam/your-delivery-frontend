import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
import { fetchAgentDeliveryDetail, fetchDeliveryDetail } from "@/lib/api/deliveries-server";
import { AgentDeliveryDetailView } from "@/src/features/agent/components/agent-delivery-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Task ${id.slice(0, 8)}`,
    robots: { index: false, follow: false },
  };
}

export default async function AgentDeliveryDetailPage({ params }: PageProps) {
  const { id } = await params;

  const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(id)) notFound();

  const delivery = await fetchAgentDeliveryDetail(id);
  if (!delivery) notFound();

  return (
    <RoleGuard allow={[UserRole.AGENT]}>
      <AgentDeliveryDetailView delivery={delivery} />
    </RoleGuard>
  );
}
