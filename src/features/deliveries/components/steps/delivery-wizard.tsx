"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WizardStepper } from "@/src/features/deliveries/components/wizard-stepper";
import { StepPickup } from "@/src/features/deliveries/components/steps/step-pickup";
import { StepDelivery } from "@/src/features/deliveries/components/steps/step-delivery";
import { StepParcel } from "@/src/features/deliveries/components/steps/step-parcel";
import { StepPayment } from "@/src/features/deliveries/components/steps/step-payment";
import { StepReview } from "@/src/features/deliveries/components/steps/step-review";
import { useWizardStore } from "@/src/features/deliveries/store/wizard-store";
import { createDelivery } from "@/lib/api/deliveries";
import { queryKeys } from "@/lib/query-keys";
import { ApiError } from "@/lib/api-client";
import type { AddressInput, CreateDeliveryInput } from "@/src/types";

/* -------------------------------------------------------------------------- */
/*                                   Steps                                    */
/* -------------------------------------------------------------------------- */

const STEPS = [
  { title: "Pickup" },
  { title: "Delivery" },
  { title: "Parcel" },
  { title: "Payment" },
  { title: "Review" },
] as const;

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

export function DeliveryWizard() {
  const router = useRouter();
  const qc = useQueryClient();
  const [current, setCurrent] = React.useState(0);

  const wizard = useWizardStore();

  /* ----------------------------- next / back ---------------------------- */

  const goNext = React.useCallback(() => {
    setCurrent((c) => Math.min(c + 1, STEPS.length - 1));
  }, []);

  const goBack = React.useCallback(() => {
    setCurrent((c) => Math.max(c - 1, 0));
  }, []);

  /* --------------------------- step submission -------------------------- */

  // Step 1
  const handlePickupNext = (values: AddressInput) => {
    wizard.setPickupAddress(values);
    goNext();
  };

  // Step 2
  const handleDeliveryNext = (values: AddressInput) => {
    wizard.setDeliveryAddress(values);
    goNext();
  };

  // Step 3
  const handleParcelNext = (values: {
    parcelType: string;
    weight: number;
    deliveryCharge: number;
    codAmount?: number;
  }) => {
    wizard.setParcel({
      parcelType: values.parcelType,
      weight: values.weight,
      deliveryCharge: values.deliveryCharge,
      codAmount: values.codAmount ?? "",
    });
    goNext();
  };

  // Step 4 — payment is a controlled radio, no form; navigation handled below
  const handlePaymentNext = () => {
    goNext();
  };

  /* ------------------------------ submission ---------------------------- */

  const createMutation = useMutation({
    mutationFn: (payload: CreateDeliveryInput) => createDelivery(payload),
    onSuccess: (delivery) => {
      toast.success(`Delivery created — ${delivery.trackingId}`);
      // Refresh lists so the new delivery appears immediately
      qc.invalidateQueries({ queryKey: queryKeys.deliveries.all });
      wizard.reset();
      router.replace(`/dashboard/deliveries/${delivery.id}`);
    },
    onError: (err) => {
      const message =
        err instanceof ApiError ? err.message : "Could not create delivery";
      toast.error(message);
      // Keep user on review step so they can fix and retry
    },
  });

  const handleSubmit = () => {
    // Guard: prevent submission if wizard state is incomplete
    if (
      !wizard.pickupAddress.name ||
      !wizard.deliveryAddress.name ||
      !wizard.parcelType ||
      wizard.weight === "" ||
      wizard.deliveryCharge === ""
    ) {
      toast.error("Please complete all required fields.");
      // Send user back to the first incomplete step
      if (!wizard.pickupAddress.name) setCurrent(0);
      else if (!wizard.deliveryAddress.name) setCurrent(1);
      else if (!wizard.parcelType) setCurrent(2);
      return;
    }

    const payload: CreateDeliveryInput = {
      pickupAddress: wizard.pickupAddress,
      deliveryAddress: wizard.deliveryAddress,
      parcelType: wizard.parcelType,
      weight: Number(wizard.weight),
      deliveryCharge: Number(wizard.deliveryCharge),
      codAmount: wizard.codAmount === "" ? undefined : Number(wizard.codAmount),
      paymentMethod: wizard.paymentMethod,
    };

    createMutation.mutate(payload);
  };

  /* ------------------------------ finalize ------------------------------ */

  const isLastStep = current === STEPS.length - 1;
  const isSubmitting = createMutation.isPending;

  return (
    <div className="space-y-8">
      {/* ------------------------------ Header ----------------------------- */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create a delivery
        </h1>
        <p className="text-sm text-muted-foreground">
          Fill in the details below. Your progress is saved automatically.
        </p>
      </div>

      {/* ------------------------------ Stepper ---------------------------- */}
      <WizardStepper steps={STEPS} current={current} />

      {/* ------------------------------- Step ------------------------------ */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardContent className="p-6 sm:p-8">
          {current === 0 && (
            <StepPickup
              defaultValues={wizard.pickupAddress}
              onNext={handlePickupNext}
            />
          )}
          {current === 1 && (
            <StepDelivery
              defaultValues={wizard.deliveryAddress}
              onNext={handleDeliveryNext}
            />
          )}
          {current === 2 && (
            <StepParcel
              defaultValues={{
                parcelType: wizard.parcelType,
                weight: wizard.weight,
                deliveryCharge: wizard.deliveryCharge,
                codAmount: wizard.codAmount,
              }}
              onNext={handleParcelNext}
            />
          )}
          {current === 3 && (
            <StepPayment
              value={wizard.paymentMethod}
              onChange={wizard.setPaymentMethod}
            />
          )}
          {current === 4 && (
            <StepReview
              pickupAddress={wizard.pickupAddress}
              deliveryAddress={wizard.deliveryAddress}
              parcel={{
                parcelType: wizard.parcelType,
                weight: wizard.weight,
                deliveryCharge: wizard.deliveryCharge,
                codAmount: wizard.codAmount,
              }}
              paymentMethod={wizard.paymentMethod}
            />
          )}
        </CardContent>
      </Card>

      {/* --------------------------- Navigation ---------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={goBack}
          disabled={current === 0 || isSubmitting}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        {!isLastStep ? (
          current === 3 ? (
            // Payment step — no form, direct navigation
            <Button type="button" onClick={handlePaymentNext} className="gap-2">
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            // Other steps — submit the internal form
            <Button type="submit" form="wizard-step-form" className="gap-2">
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          )
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2 min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating…
              </>
            ) : (
              "Create delivery"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
