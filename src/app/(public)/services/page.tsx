import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bike,
  Building2,
  FileText,
  Package,
  Plane,
  Truck,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description:
    "From documents to bulky parcels — pick the delivery service that fits your parcel and budget.",
  openGraph: {
    title: "Services — Your Delivery",
    description: "Delivery services for every size, speed, and budget.",
    type: "website",
  },
};

/* -------------------------------------------------------------------------- */
/*                                   Data                                     */
/* -------------------------------------------------------------------------- */

const SERVICES = [
  {
    icon: FileText,
    title: "Document delivery",
    description:
      "Contracts, certificates, and legal papers handled with extra care and same-day options.",
    badge: "Most popular",
  },
  {
    icon: Package,
    title: "Standard parcel",
    description:
      "Everyday boxes and packages under 10kg, delivered within 24–72 hours.",
  },
  {
    icon: Building2,
    title: "Business logistics",
    description:
      "Bulk pickups, scheduled routes, and account billing for growing companies.",
  },
  {
    icon: Bike,
    title: "Same-city express",
    description:
      "Delivered within hours inside the city, ideal for urgent items.",
  },
  {
    icon: Truck,
    title: "Heavy & bulky",
    description:
      "Furniture, appliances, and oversized items with two-person handling.",
  },
  {
    icon: Plane,
    title: "Inter-city air",
    description:
      "Time-critical parcels flown between major cities with same-day dispatch.",
  },
];

const COVERAGE = [
  { region: "Dhaka Metro", cities: "24 zones", time: "Same day" },
  { region: "Chattogram & Sylhet", cities: "18 zones", time: "24 hours" },
  { region: "All divisional cities", cities: "64 districts", time: "48 hours" },
  { region: "Upazila coverage", cities: "120+ areas", time: "72 hours" },
];

/* -------------------------------------------------------------------------- */
/*                                   Page                                     */
/* -------------------------------------------------------------------------- */

export default function ServicesPage() {
  return (
    <>
      {/* ============================== HERO ============================== */}
      <section>
        <Container className="py-20 sm:py-24 text-center">
          <SectionHeading
            eyebrow="Services"
            title={<>Delivery for every size, speed, and budget</>}
            description="Whether it's a one-page letter or a living-room sofa, we have a service that fits. Transparent pricing, tracked end-to-end."
          />
        </Container>
      </section>

      {/* ============================ SERVICES ============================ */}
      <section className="bg-muted/30 border-y border-border/60">
        <Container className="py-20 sm:py-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, description, badge }) => (
              <Card
                key={title}
                className="rounded-2xl border-border/60 shadow-sm hover:shadow-md transition-shadow relative"
              >
                {badge && (
                  <span className="absolute top-4 right-4 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    {badge}
                  </span>
                )}
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

      {/* ============================ COVERAGE ============================ */}
      <section>
        <Container className="py-20 sm:py-24">
          <SectionHeading
            eyebrow="Coverage"
            title="Where we deliver"
            description="Live delivery windows from our network — updated continuously."
          />

          <Card className="mt-14 rounded-2xl border-border/60 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left">
                    <th className="px-6 py-4 font-medium text-muted-foreground">
                      Region
                    </th>
                    <th className="px-6 py-4 font-medium text-muted-foreground">
                      Zones
                    </th>
                    <th className="px-6 py-4 font-medium text-muted-foreground">
                      Typical delivery
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {COVERAGE.map((row) => (
                    <tr key={row.region}>
                      <td className="px-6 py-4 font-medium">{row.region}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {row.cities}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {row.time}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Container>
      </section>

      {/* ================================ CTA =============================== */}
      <section className="bg-muted/30 border-y border-border/60">
        <Container className="py-20 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
            Not sure which service fits?
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Tell us what you`re sending and we`ll recommend the right option.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className={cn(buttonVariants({ size: "lg" }), "gap-2")}
            >
              Talk to us
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
            >
              See pricing
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
