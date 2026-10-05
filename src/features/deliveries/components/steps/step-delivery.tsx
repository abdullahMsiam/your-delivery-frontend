"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addressSchema,
  type AddressValues,
} from "@/src/features/deliveries/schemas/wizard-schemas";
import { AddressFields } from "@/src/features/deliveries/components/steps/step-pickup";
import type { AddressInput } from "@/src/types";
// import { AddressFields } from "./step-pickup";

interface Props {
  defaultValues: AddressInput;
  onNext: (values: AddressInput) => void;
}

export function StepDelivery({ defaultValues, onNext }: Props) {
  const form = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues,
    mode: "onBlur",
  });

  return (
    <form
      id="wizard-step-form"
      onSubmit={form.handleSubmit(onNext)}
      className="space-y-5"
      noValidate
    >
      <AddressFields control={form.control} />
    </form>
  );
}
