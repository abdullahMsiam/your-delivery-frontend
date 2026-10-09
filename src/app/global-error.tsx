"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log for observability. In production, forward to Sentry or similar.
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <Container className="min-h-screen py-20 flex items-center justify-center">
          <Card className="max-w-lg w-full rounded-3xl border-destructive/30 shadow-sm overflow-hidden">
            <div className="relative bg-gradient-to-br from-destructive/10 via-background to-destructive/5 px-6 sm:px-10 py-10 text-center border-b border-destructive/20">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
                <AlertTriangle className="h-8 w-8" />
              </span>

              <h1 className="mt-5 text-2xl font-semibold tracking-tight">
                Something went wrong
              </h1>
              <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto text-pretty">
                An unexpected error broke the page. You can try again, or head
                back home.
              </p>

              {error.digest && (
                <p className="mt-4 text-xs text-muted-foreground font-mono">
                  Error ID: {error.digest}
                </p>
              )}
            </div>

            <CardContent className="p-6 sm:p-8 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Button onClick={reset} className="gap-2 h-11">
                  <RotateCcw className="h-4 w-4" />
                  Try again
                </Button>
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "gap-2 h-11",
                  )}
                >
                  <Home className="h-4 w-4" />
                  Go to home
                </Link>
              </div>

              <details className="text-xs text-muted-foreground pt-2">
                <summary className="cursor-pointer hover:text-foreground">
                  Technical details
                </summary>
                <pre className="mt-3 overflow-x-auto rounded-lg bg-muted/50 p-3 text-[11px] leading-relaxed">
                  {error.message}
                </pre>
              </details>
            </CardContent>
          </Card>
        </Container>
      </body>
    </html>
  );
}
