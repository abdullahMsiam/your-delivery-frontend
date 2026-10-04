"use client";

import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function AccessDenied({
  title = "Access denied",
  description = "You don't have permission to view this page.",
  homeHref = "/",
  ctaLabel = "Go to dashboard",
}: {
  title?: string;
  description?: string;
  homeHref?: string;
  ctaLabel?: string;
}) {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="max-w-md w-full border-dashed">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="h-7 w-7" />
          </span>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Button variant="outline" onClick={() => router.push(homeHref)}>
            {ctaLabel}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
