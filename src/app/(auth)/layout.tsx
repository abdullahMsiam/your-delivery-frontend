import Link from "next/link";
import { Package, ShieldCheck, Truck, Zap } from "lucide-react";
import { Brand } from "@/components/layout/brand";

const highlights = [
  {
    icon: Truck,
    title: "Real-time tracking",
    description: "Know exactly where every parcel is, at every step.",
  },
  {
    icon: Zap,
    title: "Same-day dispatch",
    description: "Book a pickup in minutes and get moving right away.",
  },
  {
    icon: ShieldCheck,
    title: "Secure payments",
    description: "Pay with Stripe or cash on delivery — your choice.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ------------------------------- Brand panel ------------------------------- */}
      <aside className="relative hidden lg:flex flex-col justify-between bg-primary text-primary-foreground p-10 xl:p-14">
        <div>
          <Brand className="text-primary-foreground [&_span:first-child]:bg-primary-foreground [&_span:first-child]:text-primary" />
          <p className="mt-3 text-primary-foreground/80 max-w-sm">
            Fast, reliable parcel delivery — from your door to theirs.
          </p>
        </div>

        <ul className="space-y-6 max-w-md">
          {highlights.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-primary-foreground/80">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p className="text-sm text-primary-foreground/70">
          © {new Date().getFullYear()} Your Delivery. All rights reserved.
        </p>
      </aside>

      {/* ------------------------------ Form area ------------------------------ */}
      <main className="flex flex-col">
        {/* Mobile header with brand */}
        <header className="lg:hidden px-6 pt-8">
          <Brand />
        </header>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">{children}</div>
        </div>

        {/* Mobile footer link */}
        <footer className="lg:hidden px-6 pb-8 text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            ← Back to home
          </Link>
        </footer>
      </main>
    </div>
  );
}
