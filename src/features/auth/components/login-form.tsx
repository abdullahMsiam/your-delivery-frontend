"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";

import { ApiError } from "@/lib/api-client";
import { homeRouteForRole } from "@/lib/routes";
import { DEMO_ACCOUNTS, type DemoAccount } from "@/lib/demo-accounts";
import { DemoLoginButton } from "@/components/layout/demo-login-button";
import { useAuth } from "@/src/hooks/useAuth";

/* -------------------------------------------------------------------------- */
/*                                   Schema                                   */
/* -------------------------------------------------------------------------- */

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

/* -------------------------------------------------------------------------- */
/*                                   Form                                     */
/* -------------------------------------------------------------------------- */

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const { login } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const { control, formState } = form;
  const submitting = formState.isSubmitting;

  const goAfterLogin = React.useCallback(
    (role: Parameters<typeof homeRouteForRole>[0]) => {
      const target =
        next && next.startsWith("/") ? next : homeRouteForRole(role);
      router.replace(target);
    },
    [next, router],
  );

  async function onSubmit(values: LoginValues) {
    try {
      const user = await login(values.email, values.password);
      toast.success(`Welcome back, ${user.name}`);
      goAfterLogin(user.role);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Something went wrong";
      toast.error(message);
    }
  }

  async function handleDemoLogin(account: DemoAccount) {
    try {
      const user = await login(account.email, account.password);
      toast.success(`Logged in as ${user.role}`);
      goAfterLogin(user.role);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Demo login failed";
      toast.error(message);
    }
  }

  /* ------------------- Ordered demo accounts for layout ---------------- */
  // Top row: Admin + Customer. Bottom row: Agent.
  const topRow = DEMO_ACCOUNTS.filter((a) => a.role !== "AGENT");
  const bottomRow = DEMO_ACCOUNTS.filter((a) => a.role === "AGENT");

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Welcome back 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                disabled={submitting}
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.invalid ? `${field.name}-error` : undefined
                }
                className="h-11"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError
                  id={`${field.name}-error`}
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id={field.name}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={submitting}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? `${field.name}-error` : undefined
                  }
                  className="h-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {fieldState.invalid && fieldState.error && (
                <FieldError
                  id={`${field.name}-error`}
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />

        <Button
          type="submit"
          className="w-full h-11"
          disabled={submitting}
        >
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          or continue with demo
        </span>
      </div>

      {/* Demo logins */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {topRow.map((account) => (
            <DemoLoginButton
              key={account.role}
              account={account}
              onLogin={handleDemoLogin}
              disabled={submitting}
            />
          ))}
        </div>

        {bottomRow.map((account) => (
          <DemoLoginButton
            key={account.role}
            account={account}
            onLogin={handleDemoLogin}
            disabled={submitting}
            fullWidth
          />
        ))}
      </div>

      {/* Register link */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}