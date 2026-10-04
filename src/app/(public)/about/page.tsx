import type { Metadata } from "next";
import {
  Building2,
  Heart,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/user-avatar";

export const metadata: Metadata = {
  title: "About",
  description:
    "Your Delivery is on a mission to make door-to-door parcel delivery fast, transparent, and affordable for everyone.",
  openGraph: {
    title: "About — Your Delivery",
    description:
      "Making door-to-door parcel delivery fast, transparent, and affordable.",
    type: "website",
  },
};

/* -------------------------------------------------------------------------- */
/*                                   Data                                     */
/* -------------------------------------------------------------------------- */

const VALUES = [
  {
    icon: Heart,
    title: "Customer first",
    description:
      "Every decision starts with what makes the sender's and recipient's day better.",
  },
  {
    icon: ShieldCheck,
    title: "Reliability",
    description:
      "Parcels are promises. We treat every box, envelope, and package like it matters.",
  },
  {
    icon: Sparkles,
    title: "Transparency",
    description:
      "Real tracking, real pricing, real support. No hidden surprises, ever.",
  },
  {
    icon: Rocket,
    title: "Speed",
    description:
      "We obsess over shaving minutes off every step, from booking to doorstep.",
  },
];

const MILESTONES = [
  {
    year: "2023",
    title: "Founded",
    text: "Started with three agents and one city.",
  },
  {
    year: "2024",
    title: "50K parcels",
    text: "Crossed our first major milestone.",
  },
  {
    year: "2025",
    title: "120+ cities",
    text: "Expanded nationwide with same-day dispatch.",
  },
  {
    year: "2026",
    title: "The next chapter",
    text: "New customer and agent platforms, live.",
  },
];

const TEAM = [
  { name: "Abdullah Rahman", role: "Co-founder & CEO" },
  { name: "Sadia Khan", role: "Co-founder & COO" },
  { name: "Tanvir Hasan", role: "Head of Engineering" },
  { name: "Nadia Islam", role: "Head of Operations" },
];

/* -------------------------------------------------------------------------- */
/*                                   Page                                     */
/* -------------------------------------------------------------------------- */

export default function AboutPage() {
  return (
    <>
      {/* ============================== HERO ============================== */}
      <section>
        <Container className="py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <Target className="h-3.5 w-3.5" />
                Our mission
              </span>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-balance">
                Making delivery feel{" "}
                <span className="text-primary">effortless</span> for everyone.
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                We started Your Delivery because sending a parcel was
                frustrating — opaque pricing, broken tracking, and support that
                never picked up. So we built the opposite.
              </p>
              <p className="text-base text-muted-foreground text-pretty">
                Today, we move tens of thousands of parcels a month across 120+
                cities, with technology that keeps senders, agents, and
                recipients in sync from the moment a pickup is booked.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Building2, label: "120+ cities" },
                { icon: Users, label: "500+ agents" },
                { icon: Rocket, label: "50K+ parcels" },
                { icon: Heart, label: "4.9 rating" },
              ].map(({ icon: Icon, label }) => (
                <Card
                  key={label}
                  className="rounded-2xl border-border/60 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6 space-y-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="font-semibold tracking-tight">{label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ============================= VALUES ============================= */}
      <section className="bg-muted/30 border-y border-border/60">
        <Container className="py-20 sm:py-24">
          <SectionHeading
            eyebrow="What we stand for"
            title="Four values that guide every delivery"
            description="These aren't posters on a wall — they decide what we build, who we hire, and how we ship."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, description }) => (
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

      {/* =========================== TIMELINE ============================ */}
      <section>
        <Container className="py-20 sm:py-24">
          <SectionHeading
            eyebrow="Milestones"
            title="From day one to today"
            description="A few moments that shaped who we are."
          />

          <ol className="mt-14 relative border-l border-border/60 ml-4 sm:mx-auto sm:max-w-2xl space-y-10 pl-8">
            {MILESTONES.map((m) => (
              <li key={m.year} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[41px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-semibold ring-4 ring-background"
                >
                  ●
                </span>
                <span className="text-xs font-medium uppercase tracking-wide text-primary">
                  {m.year}
                </span>
                <h3 className="mt-1 text-lg font-semibold tracking-tight">
                  {m.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{m.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ============================== TEAM ============================= */}
      <section className="bg-muted/30 border-y border-border/60">
        <Container className="py-20 sm:py-24">
          <SectionHeading
            eyebrow="The team"
            title="Small team, big obsession with delivery"
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((person) => (
              <Card
                key={person.name}
                className="rounded-2xl border-border/60 shadow-sm text-center hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6 space-y-3">
                  <UserAvatar
                    name={person.name}
                    size="lg"
                    className="mx-auto"
                  />
                  <div>
                    <p className="font-semibold tracking-tight">
                      {person.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {person.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
