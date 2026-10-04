import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/src/features/contact/components/page";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Your Delivery — for support, sales, or partnership inquiries.",
  openGraph: {
    title: "Contact — Your Delivery",
    description:
      "Reach our team for support, sales, or partnership inquiries.",
    type: "website",
  },
};

/* -------------------------------------------------------------------------- */
/*                                   Data                                     */
/* -------------------------------------------------------------------------- */

const CONTACT_CARDS = [
  {
    icon: Mail,
    title: "Email",
    primary: "support@yourdelivery.com",
    secondary: "We respond within one business day",
  },
  {
    icon: Phone,
    title: "Phone",
    primary: "+1 (555) 123-4567",
    secondary: "Mon–Fri, 9:00 – 18:00",
  },
  {
    icon: MapPin,
    title: "Head office",
    primary: "12 Main Street, Suite 500",
    secondary: "Springfield, IL 62704",
  },
  {
    icon: Clock,
    title: "Support hours",
    primary: "9:00 – 18:00 (Mon–Fri)",
    secondary: "Emergency line 24/7 for active deliveries",
  },
];

/* -------------------------------------------------------------------------- */
/*                                   Page                                     */
/* -------------------------------------------------------------------------- */

export default function ContactPage() {
  return (
    <>
      {/* ============================== HERO ============================== */}
      <section>
        <Container className="py-20 sm:py-24">
          <SectionHeading
            eyebrow="Contact"
            title="We're here to help"
            description="Questions, feedback, or something urgent with a live delivery? Reach the right team below."
          />
        </Container>
      </section>

      {/* =========================== MAIN CONTENT =========================== */}
      <section className="bg-muted/30 border-y border-border/60">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-5">
            {/* Left: info cards */}
            <div className="lg:col-span-2 space-y-4">
              {CONTACT_CARDS.map(({ icon: Icon, title, primary, secondary }) => (
                <Card
                  key={title}
                  className="rounded-2xl border-border/60 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="flex items-start gap-4 p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {title}
                      </p>
                      <p className="mt-1 font-medium truncate">{primary}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {secondary}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right: form */}
            <div className="lg:col-span-3">
              <Card className="rounded-2xl border-border/60 shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-semibold tracking-tight">
                    Send us a message
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Fill in the form below and we`ll get back to you shortly.
                  </p>
                  <div className="mt-6">
                    <ContactForm />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================ MAP BLOCK ============================ */}
      <section>
        <Container className="py-20 sm:py-24">
          <SectionHeading
            eyebrow="Visit us"
            title="Come say hello"
            description="Our head office is open during business hours. Feel free to drop by."
          />

          <Card className="mt-12 overflow-hidden rounded-2xl border-border/60 shadow-sm">
            <div className="relative aspect-[16/8] bg-gradient-to-br from-primary/5 via-muted to-primary/10">
              {/* Simple decorative "map" — no external dependency */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Marker */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <MapPin className="h-6 w-6" />
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary/40"
                  />
                </span>
                <div className="mt-3 rounded-full border border-border/60 bg-background/90 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur">
                  Your Delivery HQ
                </div>
              </div>
            </div>

            <CardContent className="border-t border-border/60 p-6 sm:p-8 grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Address
                </p>
                <p className="mt-1 text-sm">
                  12 Main Street, Suite 500
                  <br />
                  Springfield, IL 62704
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Hours
                </p>
                <p className="mt-1 text-sm">
                  Mon–Fri: 9:00 – 18:00
                  <br />
                  Sat–Sun: Closed
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Reception
                </p>
                <p className="mt-1 text-sm">
                  +1 (555) 123-4567
                  <br />
                  hello@yourdelivery.com
                </p>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>
    </>
  );
}