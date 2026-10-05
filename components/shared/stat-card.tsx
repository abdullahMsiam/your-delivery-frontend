import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "primary" | "success" | "warning" | "danger";
  className?: string;
}

const TONE: Record<
  NonNullable<Props["tone"]>,
  { chip: string; value: string }
> = {
  default: {
    chip: "bg-muted text-foreground",
    value: "text-foreground",
  },
  primary: {
    chip: "bg-primary/10 text-primary",
    value: "text-foreground",
  },
  success: {
    chip: "bg-green-500/10 text-green-600 dark:text-green-400",
    value: "text-foreground",
  },
  warning: {
    chip: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
    value: "text-foreground",
  },
  danger: {
    chip: "bg-destructive/10 text-destructive",
    value: "text-foreground",
  },
};

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "primary",
  className,
}: Props) {
  const t = TONE[tone];
  return (
    <Card
      className={cn(
        "rounded-2xl border-border/60 shadow-sm hover:shadow-md transition-shadow",
        className,
      )}
    >
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              t.chip,
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p
            className={cn(
              "mt-1 text-2xl font-semibold tracking-tight",
              t.value,
            )}
          >
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
