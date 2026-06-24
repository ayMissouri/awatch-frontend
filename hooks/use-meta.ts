import { useQuery } from "@tanstack/react-query"
import { metaApi, watchlistApi, type WatchlistItem } from "@/lib/api"
import { useAuthStore } from "@/lib/store"

const HOUR = 1000 * 60 * 60

export function useMovieMeta(id: string) {
  return useQuery({
    queryKey: ["meta", "movie", id],
    queryFn: () => metaApi.movie(id),
    enabled: !!id,
    staleTime: HOUR,
  })
}

export function useSeriesMeta(id: string) {
  return useQuery({
    queryKey: ["meta", "series", id],
    queryFn: () => metaApi.series(id),
    enabled: !!id,
    staleTime: HOUR,
  })
}

export function useWatchlistItem(id: string) {
  const isAuthenticated = useAuthStore((s) => s.token !== null)
  return useQuery<WatchlistItem | null>({
    queryKey: ["watchlist", "item", id],
    queryFn: async () => {
      try {
        return await watchlistApi.getOne(id)
      } catch {
        return null
      }
    },
    enabled: isAuthenticated && !!id,
    retry: false,
  })
}
