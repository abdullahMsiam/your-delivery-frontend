"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";

interface Props {
  deliveryId: string;
  amount: string; // decimal-as-string from backend
  onSuccessRedirect?: string; // optional override
}

export function PaymentForm({ deliveryId, amount, onSuccessRedirect }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?deliveryId=${deliveryId}`,
      },
      redirect: "if_required", // stay on page for card success; only redirect for 3DS
    });

    if (error) {
      toast.error(error.message ?? "Payment failed. Please try again.");
      setSubmitting(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      toast.success("Payment successful");
      router.replace(
        onSuccessRedirect ??
          `/payment/success?deliveryId=${deliveryId}&pi=${paymentIntent.id}`,
      );
    } else if (paymentIntent?.status === "processing") {
      toast.info("Payment is processing. We'll update your delivery shortly.");
      router.replace(
        `/payment/success?deliveryId=${deliveryId}&pi=${paymentIntent.id}`,
      );
    } else {
      toast.error("Payment did not complete. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      <Button
        type="submit"
        size="lg"
        className="w-full gap-2"
        disabled={!stripe || submitting}
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Pay {formatCurrency(amount)}
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Payments are processed securely by Stripe. We never see your card
        details.
      </p>
    </form>
  );
}
