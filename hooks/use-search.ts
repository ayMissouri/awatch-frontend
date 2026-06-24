import { useQuery } from "@tanstack/react-query"
import { discoverApi } from "@/lib/api"

export function useSearch(query: string, type?: "movie" | "tv") {
  const q = query.trim()
  return useQuery({
    queryKey: ["search", q, type ?? "all"],
    queryFn: () => discoverApi.search(q, type),
    enabled: q.length >= 2,
    staleTime: 60_000,
  })
}
