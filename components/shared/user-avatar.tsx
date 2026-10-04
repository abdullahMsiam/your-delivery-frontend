import { cn } from "@/lib/utils";

interface Props {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-base",
};

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

export function UserAvatar({ name, className, size = "md" }: Props) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        "bg-primary/10 text-primary font-semibold ring-1 ring-primary/20",
        sizeMap[size],
        className,
      )}
      aria-hidden
    >
      {initialsOf(name)}
    </span>
  );
}
