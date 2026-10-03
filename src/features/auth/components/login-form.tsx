"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const { control, formState } = form;
  const submitting = formState.isSubmitting;

  /* -------------------------- Redirect helper -------------------------- */
  const goAfterLogin = React.useCallback(
    (role: Parameters<typeof homeRouteForRole>[0]) => {
      const target =
        next && next.startsWith("/") ? next : homeRouteForRole(role);
      router.replace(target);
    },
    [next, router],
  );

  /* --------------------------- Standard login -------------------------- */
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

  /* ----------------------------- Demo login ---------------------------- */
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

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl">Welcome Back 👋</CardTitle>
        <CardDescription>Login to your account</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ------------------------------ Form ------------------------------ */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* Email */}
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
                  disabled={submitting}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? `${field.name}-error` : undefined
                  }
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

          {/* Password */}
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={submitting}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? `${field.name}-error` : undefined
                  }
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

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Logging in…" : "Login"}
          </Button>
        </form>

        {/* --------------------------- Divider ------------------------------ */}
        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            OR
          </span>
        </div>

        {/* -------------------------- Demo logins -------------------------- */}
        <div className="space-y-3">
          <p className="text-center text-sm font-medium text-muted-foreground">
            🚀 Quick Demo Login
          </p>

          <div className="grid grid-cols-2 gap-3">
            {DEMO_ACCOUNTS.filter((a) => a.role !== "AGENT").map((account) => (
              <DemoLoginButton
                key={account.role}
                account={account}
                onLogin={handleDemoLogin}
                disabled={submitting}
              />
            ))}
          </div>

          {/* Agent spans full width — matches the mockup from the brief */}
          {DEMO_ACCOUNTS.filter((a) => a.role === "AGENT").map((account) => (
            <DemoLoginButton
              key={account.role}
              account={account}
              onLogin={handleDemoLogin}
              disabled={submitting}
            />
          ))}
        </div>
      </CardContent>

      <CardFooter className="justify-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="ml-1 font-medium text-primary hover:underline"
        >
          Register
        </Link>
      </CardFooter>
    </Card>
  );
}