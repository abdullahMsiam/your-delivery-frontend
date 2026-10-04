"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function TrackingInput({
  defaultValue = "",
  size = "default",
}: {
  defaultValue?: string;
  size?: "default" | "lg";
}) {
  const router = useRouter();
  const [value, setValue] = React.useState(defaultValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      toast.error("Please enter a tracking ID");
      return;
    }
    router.push(`/track/${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="YD-1234567890-ABC123"
        aria-label="Tracking ID"
        className={size === "lg" ? "h-12" : "h-11"}
        autoCapitalize="characters"
        autoComplete="off"
        spellCheck={false}
      />
      <Button
        type="submit"
        size={size === "lg" ? "lg" : "default"}
        className="gap-2 shrink-0"
      >
        <Search className="h-4 w-4" />
        Track
      </Button>
    </form>
  );
}
