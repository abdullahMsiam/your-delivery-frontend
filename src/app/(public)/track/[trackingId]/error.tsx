"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

export default function TrackingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Could send to an error reporting service here
    console.error(error);
  }, [error]);

  return (
    <Container className="py-20 max-w-xl">
      <Card className="rounded-2xl border-destructive/30 shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-7 w-7" />
          </span>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">
              Couldn`t fetch tracking info
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Something went wrong while contacting our delivery network. Please
              try again in a moment.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Try again
            </Button>
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
            >
              <Home className="h-4 w-4" />
              Go home
            </Link>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
