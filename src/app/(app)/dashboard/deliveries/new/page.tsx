import type { Metadata } from "next";
import { RoleGuard } from "@/components/layout/role-guard";
import { UserRole } from "@/src/types";
import { DeliveryWizard } from "@/src/features/deliveries/components/steps/delivery-wizard";

export const metadata: Metadata = {
  title: "Create a delivery",
  description: "Book a new pickup and delivery in a few steps.",
};

export default function NewDeliveryPage() {
  return (
    <RoleGuard allow={[UserRole.CUSTOMER]}>
      <DeliveryWizard />
    </RoleGuard>
  );
}
