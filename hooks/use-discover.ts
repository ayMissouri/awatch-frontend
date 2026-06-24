import { useQuery } from "@tanstack/react-query"
import { discoverApi, type DiscoverItem, type DiscoverProvider, type DiscoverSort } from "@/lib/api"
import type { DiscoverSelection } from "@/components/discover/discover-data"

export function useDiscoverAll() {
  return useQuery({
    queryKey: ["discover", "all"],
    queryFn: discoverApi.all,
  })
}

function toApiParams(sel: DiscoverSelection): {
  sort?: DiscoverSort
  genre?: string
  year?: number
  provider?: DiscoverProvider
} {
  if (sel.mode === "genre") {
    return {
      sort: sel.curation === "featured" ? "top_rated" : "popular",
      genre: sel.genre ? sel.genre.toLowerCase() : undefined,
    }
  }
  if (sel.mode === "year") {
    return sel.year ? { year: sel.year } : { sort: "popular" }
  }
  return sel.provider ? { provider: sel.provider as DiscoverProvider } : { sort: "popular" }
}

// Interleave movie + show results so the "All" type filter shows a mix.
function interleave(a: DiscoverItem[], b: DiscoverItem[]): DiscoverItem[] {
  const out: DiscoverItem[] = []
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i]) out.push(a[i])
    if (b[i]) out.push(b[i])
  }
  return out
}

// Fetches one Discover catalog for the active selection. The /discover endpoint
// is per-type, so "All" fans out to movie + series and interleaves the results.
export function useDiscoverCatalog(sel: DiscoverSelection) {
  const params = toApiParams(sel)
  return useQuery({
    queryKey: ["discover", "catalog", sel.type, params],
    queryFn: async (): Promise<DiscoverItem[]> => {
      if (sel.type === "all") {
        const [movies, shows] = await Promise.all([
          discoverApi.catalog({ type: "movie", ...params }),
          discoverApi.catalog({ type: "series", ...params }),
        ])
        return interleave(movies.items, shows.items)
      }
      const res = await discoverApi.catalog({
        type: sel.type === "tv" ? "series" : "movie",
        ...params,
      })
      return res.items
    },
    staleTime: 5 * 60 * 1000,
  })
}
