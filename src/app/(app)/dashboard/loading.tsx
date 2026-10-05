import { Card, CardContent } from "@/components/ui/card";
import { StatsSkeleton, TableSkeleton } from "@/components/shared/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      <StatsSkeleton count={4} />

      <Card className="rounded-2xl border-border/60">
        <CardContent className="p-6 space-y-3">
          <Skeleton className="h-4 w-40" />
          <TableSkeleton rows={5} columns={4} />
        </CardContent>
      </Card>
    </div>
  );
}
