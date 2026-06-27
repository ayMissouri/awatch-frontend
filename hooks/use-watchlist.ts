import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query"
import {
  watchlistApi,
  type UpdateProgressRequest,
  type WatchlistItem,
  type WatchlistQuery,
  type WatchlistStatus,
} from "@/lib/api"
import { useAuthStore } from "@/lib/store"

function invalidateWatchlist(queryClient: QueryClient, also: string[] = []) {
  return Promise.all(
    ["watchlist", ...also].map((key) =>
      queryClient.invalidateQueries({ queryKey: [key] }),
    ),
  )
}

export function useWatchlist(query: WatchlistQuery = {}) {
  const isAuthenticated = useAuthStore((s) => s.token !== null)

  return useQuery({
    queryKey: ["watchlist", query],
    queryFn: () => watchlistApi.getAll(query),
    enabled: isAuthenticated,
  })
}

export function useUpdateWatchlistStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: WatchlistStatus }) =>
      watchlistApi.updateStatus(id, status),
    onSuccess: () => invalidateWatchlist(queryClient, ["calendar"]),
  })
}

export function useUpdateProgress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: UpdateProgressRequest }) =>
      watchlistApi.updateProgress(id, req),
    onSuccess: () => invalidateWatchlist(queryClient, ["calendar"]),
  })
}

export function useDeleteWatchlistItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => watchlistApi.delete(id),
    onSuccess: () => invalidateWatchlist(queryClient, ["calendar"]),
  })
}

export function useBulkDeleteWatchlistItems() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => watchlistApi.bulkDelete(ids),
    onSuccess: () => invalidateWatchlist(queryClient, ["calendar"]),
  })
}

export function useUpsertWatchlistItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (item: WatchlistItem) => watchlistApi.upsert(item.id, item),
    onSuccess: () => invalidateWatchlist(queryClient, ["calendar", "notifications"]),
  })
}

export function useRestoreWatchlistItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (item: WatchlistItem) => watchlistApi.upsert(item.id, item),
    onSuccess: () => invalidateWatchlist(queryClient, ["calendar", "notifications"]),
  })
}
