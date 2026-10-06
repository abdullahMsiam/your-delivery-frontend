"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useUpdateProfile } from "@/src/features/users/hooks/use-update-profile";
import type { User } from "@/src/types";

interface Props {
  user: User;
}

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  phone: z
    .string()
    .trim()
    .min(10, "Phone must be at least 10 characters")
    .max(15, "Phone must be at most 15 characters")
    .regex(/^[+\d\s()-]+$/, "Phone can only contain digits and + - ( )"),
});

type Values = z.infer<typeof schema>;

export function EditProfileForm({ user }: Props) {
  const update = useUpdateProfile();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: user.name, phone: user.phone },
    mode: "onBlur",
  });

  const { control, formState, reset, watch } = form;
  const submitting = update.isPending;

  // Track if user has actually changed anything
  const name = watch("name");
  const phone = watch("phone");
  const isDirty = name !== user.name || phone !== user.phone;

  async function onSubmit(values: Values) {
    await update.mutateAsync(values);
    // After success, mark the current values as "clean"
    reset(values);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Your name"
              autoComplete="name"
              disabled={submitting}
              aria-invalid={fieldState.invalid}
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
              disabled={submitting}
              aria-invalid={fieldState.invalid}
              className="h-11"
            />
            {fieldState.invalid && fieldState.error && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      <div className="flex items-center gap-3 pt-1">
        <Button
          type="submit"
          disabled={submitting || !isDirty}
          className="gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save changes
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => reset()}
          disabled={submitting || !isDirty}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
