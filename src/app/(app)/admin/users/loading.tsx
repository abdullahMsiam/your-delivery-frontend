import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/shared/skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-80" />
      </div>

      <Card className="rounded-2xl border-border/60">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-20" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-[200px]" />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/60">
        <CardContent className="pt-6">
          <TableSkeleton rows={6} columns={6} />
        </CardContent>
      </Card>
    </div>
  );
}
