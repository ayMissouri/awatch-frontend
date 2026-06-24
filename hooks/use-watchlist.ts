import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  watchlistApi,
  type UpdateProgressRequest,
  type WatchlistItem,
  type WatchlistQuery,
  type WatchlistStatus,
} from "@/lib/api"
import { useAuthStore } from "@/lib/store"

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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["watchlist"] }),
  })
}

export function useUpdateProgress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: UpdateProgressRequest }) =>
      watchlistApi.updateProgress(id, req),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["watchlist"] }),
  })
}

export function useDeleteWatchlistItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => watchlistApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["watchlist"] }),
  })
}

export function useBulkDeleteWatchlistItems() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => watchlistApi.bulkDelete(ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["watchlist"] }),
  })
}

export function useUpsertWatchlistItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (item: WatchlistItem) => watchlistApi.upsert(item.id, item),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["watchlist"] }),
  })
}

export function useRestoreWatchlistItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (item: WatchlistItem) => watchlistApi.upsert(item.id, item),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["watchlist"] }),
  })
}
