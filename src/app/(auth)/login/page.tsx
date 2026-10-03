import { LoginForm } from "@/src/features/auth/components/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to Your Delivery to track and manage your parcels.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <LoginForm/>
    </main>
  );
}
