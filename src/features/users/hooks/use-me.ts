"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "@/lib/api/users";
import { queryKeys } from "@/lib/query-keys";

export function useMe() {
  return useQuery({
    queryKey: queryKeys.users.me,
    queryFn: fetchMe,
    staleTime: 60_000,
  });
}
