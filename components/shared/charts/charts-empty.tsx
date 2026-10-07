import { BarChart3 } from "lucide-react";

export function ChartEmpty({
  label = "Not enough data yet",
}: {
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <BarChart3 className="h-5 w-5" />
      </span>
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
