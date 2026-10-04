import { RegisterForm } from "@/src/features/auth/components/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create your Your Delivery account to send parcels, track deliveries, and manage payments.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}