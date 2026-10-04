import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { TrackingInput } from "@/src/features/tracking/components/tracking-input";

export const metadata: Metadata = {
  title: "Track a parcel",
  description: "Enter your tracking ID to see live status.",
};

export default function TrackPage() {
  return (
    <Container className="py-20 max-w-xl text-center space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        Track your parcel
      </h1>
      <p className="text-muted-foreground">
        Enter the tracking ID from your confirmation email.
      </p>
      <TrackingInput size="lg" />
    </Container>
  );
}
