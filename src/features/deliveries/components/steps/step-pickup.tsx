"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { addressSchema, type AddressValues } from "@/features/deliveries/schemas/wizard-schemas";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { AddressInput } from "@/src/types";

import type { Control } from "react-hook-form";
import { addressSchema, AddressValues } from "../../schemas/wizard-schemas";

interface Props {
  defaultValues: AddressInput;
  onNext: (values: AddressInput) => void;
}

export function StepPickup({ defaultValues, onNext }: Props) {
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

/* -------------------------------------------------------------------------- */
/*                       Reusable address field bundle                        */
/* -------------------------------------------------------------------------- */

export function AddressFields({
  control,
}: {
  control: Control<AddressValues>;
}) {
  return (
    <>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Recipient or sender name"
              autoComplete="name"
              className="h-11"
            />
            {fieldState.invalid && fieldState.error && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      <Controller
        name="phone"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="tel"
              placeholder="+15551234567"
              autoComplete="tel"
              className="h-11"
            />
            {fieldState.invalid && fieldState.error && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      <Controller
        name="addressLine"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor={field.name}>Address</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Street, house, apartment"
              autoComplete="street-address"
              className="h-11"
            />
            {fieldState.invalid && fieldState.error && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Controller
          name="city"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor={field.name}>City</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Dhaka"
                autoComplete="address-level2"
                className="h-11"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="postalCode"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor={field.name}>Postal code</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="1200"
                autoComplete="postal-code"
                className="h-11"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </div>
    </>
  );
}
