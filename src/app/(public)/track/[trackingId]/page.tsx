import type { Metadata } from "next";
import Link from "next/link";
import { PackageX, Search } from "lucide-react";
import { Container } from "@/components/shared/container";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchTracking } from "@/lib/api/public-tracking";
import { cn } from "@/lib/utils";
import { TrackingResult } from "@/src/features/tracking/components/tracking-result";
import { TrackingInput } from "@/src/features/tracking/components/tracking-input";

interface PageProps {
  params: Promise<{ trackingId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { trackingId } = await params;
  return {
    title: `Track ${trackingId}`,
    description: `Live status for parcel ${trackingId}.`,
    // Keep tracking pages out of search engines
    robots: { index: false, follow: false },
  };
}

export default async function TrackDetailPage({ params }: PageProps) {
  const { trackingId } = await params;

  if (!trackingId || trackingId.length < 3) {
    return <NotFoundCard trackingId={trackingId ?? ""} reason="invalid" />;
  }

  let data = null;
  try {
    data = await fetchTracking(trackingId);
  } catch (err) {
    // Let the error boundary / error.tsx handle unexpected failures
    throw err;
  }

  if (!data) {
    return <NotFoundCard trackingId={trackingId} reason="not-found" />;
  }

  return (
    <Container className="py-14 sm:py-20 max-w-4xl">
      {/* Header */}
      <div className="space-y-4 text-center mb-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Search className="h-3.5 w-3.5" />
          Public tracking
        </span>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
          Tracking your parcel
        </h1>
        <p className="mx-auto max-w-xl text-sm text-muted-foreground">
          Live status pulled directly from our delivery network.
        </p>
      </div>

      <TrackingResult data={data} />

      {/* Bottom: quick re-search */}
      <div className="mt-12">
        <p className="mb-3 text-center text-sm text-muted-foreground">
          Track another parcel
        </p>
        <TrackingInput />
      </div>
    </Container>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Not found / invalid                            */
/* -------------------------------------------------------------------------- */

function NotFoundCard({
  trackingId,
  reason,
}: {
  trackingId: string;
  reason: "invalid" | "not-found";
}) {
  const title =
    reason === "invalid" ? "Invalid tracking ID" : "Tracking ID not found";
  const description =
    reason === "invalid"
      ? "Please double-check the ID and try again."
      : `We couldn't find any parcel with the tracking ID "${trackingId}". It may have been mistyped, or the booking might not be registered yet.`;

  return (
    <Container className="py-20 max-w-xl">
      <Card className="rounded-2xl border-dashed shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <PackageX className="h-7 w-7" />
          </span>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground max-w-sm text-pretty">
              {description}
            </p>
          </div>

          <div className="w-full max-w-sm pt-3">
            <TrackingInput defaultValue={trackingId} />
          </div>

          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "mt-1",
            )}
          >
            Need help? Contact support
          </Link>
        </CardContent>
      </Card>
    </Container>
  );
}
