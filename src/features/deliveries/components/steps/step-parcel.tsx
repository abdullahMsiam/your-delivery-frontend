"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  parcelSchema,
  type ParcelValues,
} from "@/src/features/deliveries/schemas/wizard-schemas";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface Props {
  defaultValues: {
    parcelType: string;
    weight: number | "";
    deliveryCharge: number | "";
    codAmount: number | "";
  };
  onNext: (values: ParcelValues) => void;
}

/** Coerce empty strings to undefined so Zod .number() handles it correctly. */
function toNumber(v: string) {
  return v === "" ? undefined : Number(v);
}

export function StepParcel({ defaultValues, onNext }: Props) {
  const form = useForm<ParcelValues>({
    resolver: zodResolver(parcelSchema),
    defaultValues: {
      parcelType: defaultValues.parcelType,
      weight:
        defaultValues.weight === "" ? undefined : Number(defaultValues.weight),
      deliveryCharge:
        defaultValues.deliveryCharge === ""
          ? undefined
          : Number(defaultValues.deliveryCharge),
      codAmount:
        defaultValues.codAmount === ""
          ? undefined
          : Number(defaultValues.codAmount),
    },
    mode: "onBlur",
  });

  return (
    <form
      id="wizard-step-form"
      onSubmit={form.handleSubmit(onNext)}
      className="space-y-5"
      noValidate
    >
      <Controller
        name="parcelType"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor={field.name}>Parcel type</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Documents, Package, Fragile, …"
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
          name="weight"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor={field.name}>Weight (kg)</FieldLabel>
              <Input
                id={field.name}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.75"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(toNumber(e.target.value))}
                onBlur={field.onBlur}
                className="h-11"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="deliveryCharge"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor={field.name}>Delivery charge</FieldLabel>
              <Input
                id={field.name}
                type="number"
                step="0.01"
                min="0"
                placeholder="12.50"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(toNumber(e.target.value))}
                onBlur={field.onBlur}
                className="h-11"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </div>

      <Controller
        name="codAmount"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor={field.name}>
              Cash on delivery amount{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </FieldLabel>
            <Input
              id={field.name}
              type="number"
              step="0.01"
              min="0"
              placeholder="0"
              value={field.value ?? ""}
              onChange={(e) => field.onChange(toNumber(e.target.value))}
              onBlur={field.onBlur}
              className="h-11"
            />
            {fieldState.invalid && fieldState.error && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
    </form>
  );
}
