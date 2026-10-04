import { Container } from "@/components/shared/container";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container className="py-14 sm:py-20 max-w-4xl space-y-6">
      <div className="text-center space-y-4 mb-10">
        <Skeleton className="mx-auto h-6 w-32 rounded-full" />
        <Skeleton className="mx-auto h-9 w-72" />
        <Skeleton className="mx-auto h-4 w-96" />
      </div>

      <Card className="rounded-2xl border-border/60 overflow-hidden">
        <div className="border-b border-border/60 p-6 sm:p-8 space-y-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-56" />
        </div>
        <CardContent className="p-6 sm:p-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/60">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </Container>
  );
}
