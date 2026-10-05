"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function DeliveryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="rounded-2xl border-destructive/30 shadow-sm max-w-xl mx-auto">
      <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-7 w-7" />
        </span>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Couldn`t load this delivery</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Something went wrong fetching the delivery details. It may have been
            deleted, or you may not have access.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button onClick={reset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Try again
          </Button>
          <Link
            href="/dashboard/deliveries"
            className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
