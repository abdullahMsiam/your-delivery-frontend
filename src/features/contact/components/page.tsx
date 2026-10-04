"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Send, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

/* -------------------------------------------------------------------------- */
/*                                   Schema                                   */
/* -------------------------------------------------------------------------- */

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(120, "Subject must be at most 120 characters"),
  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message must be at most 2000 characters"),
});

type ContactValues = z.infer<typeof contactSchema>;

/* -------------------------------------------------------------------------- */
/*                                   Form                                     */
/* -------------------------------------------------------------------------- */

export function ContactForm() {
  const [sent, setSent] = React.useState(false);

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
    mode: "onBlur",
  });

  const { control, formState, reset } = form;
  const submitting = formState.isSubmitting;
  const messageValue = form.watch("message");
  const remaining = 2000 - (messageValue?.length ?? 0);

  async function onSubmit(_values: ContactValues) {
    // Simulate a network call — there's no /contact endpoint on the backend.
    await new Promise((r) => setTimeout(r, 900));
    toast.success(
      "Message sent — we'll get back to you within 1 business day.",
    );
    setSent(true);
    reset();
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card p-10 text-center shadow-sm">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="mt-5 text-lg font-semibold tracking-tight">
          Message received
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Thanks for reaching out. Our team typically replies within one
          business day.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setSent(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      {/* Name */}
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor={field.name}>Your name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Taylor Example"
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
              autoCapitalize="none"
              spellCheck={false}
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

      {/* Subject */}
      <Controller
        name="subject"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor={field.name}>Subject</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="How can we help?"
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

      {/* Message */}
      <Controller
        name="message"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor={field.name}>Message</FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              placeholder="Tell us a bit more…"
              rows={6}
              disabled={submitting}
              aria-invalid={fieldState.invalid}
              className="resize-none"
            />
            <div className="flex items-center justify-between text-xs">
              {fieldState.invalid && fieldState.error ? (
                <FieldError errors={[fieldState.error]} />
              ) : (
                <span className="text-muted-foreground">
                  Please include any relevant tracking IDs.
                </span>
              )}
              <span
                className={
                  remaining < 200 ? "text-destructive" : "text-muted-foreground"
                }
              >
                {remaining} left
              </span>
            </div>
          </Field>
        )}
      />

      <Button
        type="submit"
        size="lg"
        className="w-full h-11 gap-2"
        disabled={submitting}
      >
        <Send className="h-4 w-4" />
        {submitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
