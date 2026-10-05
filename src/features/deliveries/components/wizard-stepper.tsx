import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  steps: { title: string; description?: string }[];
  current: number; // 0-indexed
}

export function WizardStepper({ steps, current }: Props) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-1">
      {steps.map((step, i) => {
        const isDone = i < current;
        const isCurrent = i === current;

        return (
          <li
            key={step.title}
            className="flex items-center gap-2 sm:gap-3 shrink-0"
          >
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                isDone && "bg-primary text-primary-foreground",
                isCurrent &&
                  "bg-primary text-primary-foreground ring-4 ring-primary/20",
                !isDone && !isCurrent && "bg-muted text-muted-foreground",
              )}
            >
              {isDone ? <Check className="h-4 w-4" /> : i + 1}
            </span>

            <span
              className={cn(
                "hidden sm:block text-sm font-medium whitespace-nowrap",
                isCurrent ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step.title}
            </span>

            {i < steps.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "hidden sm:block h-px w-8",
                  isDone ? "bg-primary/40" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
