import { LoginForm } from "@/src/features/auth/components/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to Your Delivery to track and manage your parcels in real time.",
};

export default function LoginPage() {
  return <LoginForm />;
}