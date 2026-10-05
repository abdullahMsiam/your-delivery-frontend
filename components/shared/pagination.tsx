"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pagination as PaginationMeta } from "@/src/types";

interface Props {
  pagination: PaginationMeta;
  className?: string;
}

export function Pagination({ pagination, className }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { page, totalPages } = pagination;
  const canPrev = page > 1;
  const canNext = page < totalPages;

  function goTo(target: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(target));
    router.push(`${pathname}?${params.toString()}`);
  }

  if (totalPages <= 1) return null;

  // Compact page numbers around current page (max 5 buttons)
  const pages: (number | "…")[] = [];
  const window = 2;
  const start = Math.max(1, page - window);
  const end = Math.min(totalPages, page + window);

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("…");
  }
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-between gap-2 pt-4", className)}
    >
      <Button
        variant="outline"
        size="sm"
        disabled={!canPrev}
        onClick={() => goTo(page - 1)}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="hidden sm:flex items-center gap-1">
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="px-2 text-sm text-muted-foreground"
            >
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "default" : "ghost"}
              size="sm"
              className="min-w-9"
              onClick={() => goTo(p)}
            >
              {p}
            </Button>
          ),
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={!canNext}
        onClick={() => goTo(page + 1)}
        className="gap-1"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
