import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent per-parcel pricing. No monthly fees, no hidden charges — pay only for what you ship.",
  openGraph: {
    title: "Pricing — Your Delivery",
    description: "Simple, per-parcel pricing for every delivery.",
    type: "website",
  },
};

/* -------------------------------------------------------------------------- */
/*                                   Data                                     */
/* -------------------------------------------------------------------------- */

const PLANS = [
  {
    name: "Pay as you go",
    price: "from $4",
    unit: "per parcel",
    description:
      "Perfect for occasional senders who just need reliable delivery.",
    features: [
      "Book on demand",
      "Real-time tracking",
      "Email & SMS updates",
      "Stripe or cash on delivery",
      "Standard support",
    ],
    cta: { label: "Get started", href: "/register" },
    highlight: false,
  },
  {
    name: "Business",
    price: "custom",
    unit: "monthly invoicing",
    description: "Built for teams shipping regularly with scheduled pickups.",
    features: [
      "Everything in Pay as you go",
      "Scheduled daily pickups",
      "Bulk booking discounts",
      "Account billing & receipts",
      "Dedicated account manager",
      "Priority support",
    ],
    cta: { label: "Talk to sales", href: "/contact" },
    highlight: true,
  },
];

const FAQ = [
  {
    q: "How is the delivery charge calculated?",
    a: "The charge is based on distance, parcel weight, and the service you pick (standard, express, or inter-city). You'll always see the exact amount before confirming a booking.",
  },
  {
    q: "When do I pay?",
    a: "You can pay online with Stripe at booking, or choose Cash on Delivery and pay when the parcel reaches the recipient.",
  },
  {
    q: "Do you charge for failed deliveries?",
    a: "If a delivery fails because the recipient isn't available, we attempt a second delivery at no extra charge. If it fails again, standard return fees apply.",
  },
  {
    q: "Are parcels insured?",
    a: "Yes — every parcel is tracked and covered against loss or damage up to a standard limit. Higher coverage is available on request for high-value items.",
  },
  {
    q: "Can I get a refund?",
    a: "If a parcel isn't delivered within its promised window, you can request a partial refund through your dashboard. Refunds are processed within 5 business days.",
  },
];

/* -------------------------------------------------------------------------- */
/*                                   Page                                     */
/* -------------------------------------------------------------------------- */

export default function PricingPage() {
  return (
    <>
      {/* ============================== HERO ============================== */}
      <section>
        <Container className="py-20 sm:py-24">
          <SectionHeading
            eyebrow="Pricing"
            title="Simple, per-parcel pricing"
            description="No monthly fees, no hidden charges. Pay only for what you ship."
          />
        </Container>
      </section>

      {/* ============================== PLANS ============================== */}
      <section className="bg-muted/30 border-y border-border/60">
        <Container className="py-20 sm:py-24">
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {PLANS.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  "rounded-2xl shadow-sm transition-shadow hover:shadow-md relative",
                  plan.highlight
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border/60",
                )}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                    Most popular
                  </span>
                )}

                <CardHeader className="space-y-2 pb-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {plan.unit}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Check className="h-3 w-3" />
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.cta.href}
                    className={cn(
                      buttonVariants({
                        variant: plan.highlight ? "default" : "outline",
                        size: "lg",
                      }),
                      "w-full gap-2",
                    )}
                  >
                    {plan.cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* =============================== FAQ =============================== */}
      <section>
        <Container className="py-20 sm:py-24 max-w-3xl">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions, answered"
            description="Everything you might want to know before you book."
          />

          <Accordion type="single" collapsible className="mt-12">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-medium">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </section>
    </>
  );
}
