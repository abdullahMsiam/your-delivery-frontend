import Link from "next/link";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  href?: string;
  className?: string;
  showText?: boolean;
}

export function Brand({ href = "/", className, showText = true }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 font-semibold tracking-tight",
        className,
      )}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Package className="h-5 w-5" />
      </span>
      {showText && <span className="text-lg">Your Delivery</span>}
    </Link>
  );
}
