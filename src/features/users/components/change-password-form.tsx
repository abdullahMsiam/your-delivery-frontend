"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useChangePassword } from "@/src/features/users/hooks/use-update-profile";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be at most 100 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: "New password must differ from current",
    path: ["newPassword"],
  });

type Values = z.infer<typeof schema>;

export function ChangePasswordForm() {
  const change = useChangePassword();
  const [show, setShow] = React.useState({
    current: false,
    next: false,
    confirm: false,
  });

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const { control, formState, reset } = form;
  const submitting = change.isPending;

  async function onSubmit(values: Values) {
    await change.mutateAsync({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
    reset();
  }

  function toggle(key: keyof typeof show) {
    setShow((s) => ({ ...s, [key]: !s[key] }));
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <Controller
        name="currentPassword"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor={field.name}>Current password</FieldLabel>
            <div className="relative">
              <Input
                {...field}
                id={field.name}
                type={show.current ? "text" : "password"}
                autoComplete="current-password"
                disabled={submitting}
                aria-invalid={fieldState.invalid}
                className="h-11 pr-11"
              />
              <PasswordToggle
                shown={show.current}
                onToggle={() => toggle("current")}
              />
            </div>
            {fieldState.invalid && fieldState.error && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      <Controller
        name="newPassword"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor={field.name}>New password</FieldLabel>
            <div className="relative">
              <Input
                {...field}
                id={field.name}
                type={show.next ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                disabled={submitting}
                aria-invalid={fieldState.invalid}
                className="h-11 pr-11"
              />
              <PasswordToggle
                shown={show.next}
                onToggle={() => toggle("next")}
              />
            </div>
            {fieldState.invalid && fieldState.error && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor={field.name}>Confirm new password</FieldLabel>
            <div className="relative">
              <Input
                {...field}
                id={field.name}
                type={show.confirm ? "text" : "password"}
                autoComplete="new-password"
                disabled={submitting}
                aria-invalid={fieldState.invalid}
                className="h-11 pr-11"
              />
              <PasswordToggle
                shown={show.confirm}
                onToggle={() => toggle("confirm")}
              />
            </div>
            {fieldState.invalid && fieldState.error && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      <Button type="submit" disabled={submitting} className="gap-2">
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating…
          </>
        ) : (
          <>
            <KeyRound className="h-4 w-4" />
            Change password
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        Note: your current session stays active after changing your password.
      </p>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Password toggle                               */
/* -------------------------------------------------------------------------- */

function PasswordToggle({
  shown,
  onToggle,
}: {
  shown: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? "Hide password" : "Show password"}
      tabIndex={-1}
      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
}
