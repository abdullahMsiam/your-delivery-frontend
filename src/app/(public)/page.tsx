import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrackingInput } from "@/src/features/tracking/components/tracking-input";

export const metadata: Metadata = {
  title: "Fast, Reliable Parcel Delivery",
  description:
    "Book a pickup, track in real time, and pay securely. Your Delivery handles parcels of every size with door-to-door precision.",
  openGraph: {
    title: "Your Delivery — Fast, Reliable Parcel Delivery",
    description:
      "Book a pickup, track in real time, and pay securely with Your Delivery.",
    type: "website",
  },
};

/* -------------------------------------------------------------------------- */
/*                                   Data                                     */
/* -------------------------------------------------------------------------- */

const FEATURES = [
  {
    icon: MapPin,
    title: "Live GPS tracking",
    description:
      "Follow your parcel from pickup to delivery with second-by-second updates.",
  },
  {
    icon: Clock,
    title: "Same-day dispatch",
    description:
      "Book a pickup before noon and we'll get your parcel moving the same day.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & insured",
    description:
      "Every parcel is tracked and covered. Know exactly where your package is.",
  },
  {
    icon: CreditCard,
    title: "Flexible payments",
    description:
      "Pay online with Stripe or choose cash on delivery — whichever you prefer.",
  },
  {
    icon: BarChart3,
    title: "Detailed analytics",
    description:
      "Full delivery history and spend reports in your customer dashboard.",
  },
  {
    icon: Users,
    title: "Dedicated agents",
    description:
      "Every parcel is assigned to a vetted delivery agent you can contact.",
  },
];

const STEPS = [
  {
    title: "Book a pickup",
    description:
      "Enter pickup and delivery addresses, parcel details, and pay.",
  },
  {
    title: "We're on the way",
    description: "A verified agent is assigned and picks up your parcel.",
  },
  {
    title: "Track to your door",
    description: "Follow the journey live and get notified at every stage.",
  },
];

const STATS = [
  { value: "50K+", label: "Parcels delivered" },
  { value: "120+", label: "Cities covered" },
  { value: "99.2%", label: "On-time rate" },
  { value: "4.9/5", label: "Customer rating" },
];

/* -------------------------------------------------------------------------- */
/*                                   Page                                     */
/* -------------------------------------------------------------------------- */

export default function HomePage() {
  return (
    <>
      {/* =============================== HERO =============================== */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-gradient-to-b from-primary/10 via-background to-background"
        />
        <Container className="py-20 sm:py-28 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left: copy */}
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                New — now live in 120+ cities
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-balance">
                Delivery that arrives{" "}
                <span className="text-primary">on time</span>, every time.
              </h1>

              <p className="text-lg text-muted-foreground text-pretty max-w-xl">
                Book a pickup in seconds, track your parcel live, and pay
                securely. From documents to parcels, we move it door-to-door.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register"
                  className={cn(buttonVariants({ size: "lg" }), "gap-2")}
                >
                  Send a parcel
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/track"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                  )}
                >
                  Track existing
                </Link>
              </div>

              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                {[
                  "No monthly fees",
                  "Real-time tracking",
                  "Secure payments",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: tracking card */}
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-6 -z-10 rounded-3xl bg-primary/5 blur-2xl"
              />
              <Card className="rounded-2xl shadow-lg border-border/60">
                <CardContent className="p-6 sm:p-8 space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Package className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold">Track a parcel</p>
                      <p className="text-xs text-muted-foreground">
                        Enter your tracking ID to see live status
                      </p>
                    </div>
                  </div>

                  <TrackingInput />

                  <div className="grid grid-cols-3 gap-3 border-t pt-5">
                    {[
                      { icon: Truck, label: "Dispatched" },
                      { icon: MapPin, label: "In transit" },
                      { icon: CheckCircle2, label: "Delivered" },
                    ].map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center gap-1.5 text-center"
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="text-xs text-muted-foreground">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================== STATS =============================== */}
      <section className="border-y border-border/60 bg-muted/30">
        <Container className="py-10">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <dt className="text-3xl font-semibold tracking-tight text-primary">
                  {s.value}
                </dt>
                <dd className="mt-1 text-sm text-muted-foreground">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ============================= FEATURES ============================= */}
      <section id="features">
        <Container className="py-20 sm:py-24">
          <SectionHeading
            eyebrow="Features"
            title="Everything you need to ship with confidence"
            description="From the moment you book a pickup to the second it lands at the door, we've built every detail in."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="rounded-2xl border-border/60 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6 space-y-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-semibold tracking-tight">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* =========================== HOW IT WORKS =========================== */}
      <section className="bg-muted/30 border-y border-border/60">
        <Container className="py-20 sm:py-24">
          <SectionHeading
            eyebrow="How it works"
            title="Three steps from door to door"
            description="No paperwork. No waiting. Just book, send, and track."
          />

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold shadow-sm">
                    {i + 1}
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  {step.description}
                </p>
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden
                    className="hidden md:block absolute top-6 left-full w-8 border-t border-dashed border-border"
                  />
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ================================ CTA =============================== */}
      <section>
        <Container className="py-20 sm:py-24">
          <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground px-6 sm:px-12 py-14 sm:py-16 text-center">
            <div
              aria-hidden
              className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl"
            />

            <div className="relative mx-auto max-w-2xl space-y-6">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
                Ready to send your first parcel?
              </h2>
              <p className="text-primary-foreground/85 text-pretty">
                Create an account in under a minute and book your first delivery
                today. No card required to get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "secondary" }),
                    "gap-2",
                  )}
                >
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10",
                  )}
                >
                  Talk to sales
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
