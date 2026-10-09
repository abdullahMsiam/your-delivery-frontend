import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsSkeleton } from "@/components/shared/skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-32" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/60 overflow-hidden">
          <div className="border-b border-border/60 p-6 flex flex-col items-center gap-3">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <CardContent className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <StatsSkeleton count={4} />
        </div>
      </div>

      <Card className="rounded-2xl border-border/60">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-72 w-full rounded-xl" />
        </CardContent>
      </Card>
    </div>
  );
}
