import Link from "next/link";
import { ArrowLeft, Home, PackageSearch, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container className="py-20 min-h-[80vh] flex items-center justify-center">
      <Card className="max-w-lg w-full rounded-3xl border-border/60 shadow-sm overflow-hidden">
        {/* Header band */}
        <div className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 px-6 sm:px-10 py-10 text-center border-b border-border/60">
          <div
            aria-hidden
            className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
          />
          <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <PackageSearch className="h-8 w-8" />
          </span>

          <p className="relative mt-5 text-6xl font-semibold tracking-tight text-primary">
            404
          </p>
          <h1 className="relative mt-2 text-2xl font-semibold tracking-tight">
            We couldn&apos;t find that page
          </h1>
          <p className="relative mt-3 text-sm text-muted-foreground max-w-sm mx-auto text-pretty">
            The page you&apos;re looking for might have moved, been renamed, or
            never existed. Let&apos;s get you back on track.
          </p>
        </div>

        {/* Actions */}
        <CardContent className="p-6 sm:p-8 space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/" className={cn(buttonVariants(), "gap-2 h-11")}>
              <Home className="h-4 w-4" />
              Go to home
            </Link>
            <Link
              href="/track"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "gap-2 h-11",
              )}
            >
              <Search className="h-4 w-4" />
              Track a parcel
            </Link>
          </div>

          {/* Helpful links */}
          <div className="pt-4 border-t border-border/60">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
              Popular pages
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { href: "/services", label: "Services" },
                { href: "/pricing", label: "Pricing" },
                { href: "/contact", label: "Contact" },
                { href: "/about", label: "About" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-medium hover:bg-muted"
                >
                  {l.label}
                  <ArrowLeft className="h-3 w-3 rotate-180 opacity-60" />
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
