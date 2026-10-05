"use client";

import { CreditCard, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/src/types";

interface Props {
  value: PaymentMethod;
  onChange: (v: PaymentMethod) => void;
}

const OPTIONS: {
  value: PaymentMethod;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: "STRIPE",
    label: "Pay online",
    description: "Secure card payment via Stripe. Pay now.",
    icon: CreditCard,
  },
  {
    value: "COD",
    label: "Cash on delivery",
    description: "Pay the delivery agent in cash when the parcel arrives.",
    icon: Wallet,
  },
];

export function StepPayment({ value, onChange }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2" role="radiogroup">
      {OPTIONS.map(({ value: v, label, description, icon: Icon }) => {
        const selected = value === v;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(v)}
            className={cn(
              "flex flex-col items-start gap-3 rounded-2xl border-2 p-5 text-left transition-all",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border/60 hover:border-primary/40 hover:bg-muted/40",
            )}
          >
            <span
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl",
                selected
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-primary",
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
            <div className="space-y-1">
              <p className="font-semibold tracking-tight">{label}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
