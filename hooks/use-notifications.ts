import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { notificationsApi } from "@/lib/api"
import { useAuthStore } from "@/lib/store"

export function useNotifications() {
  const isAuthenticated = useAuthStore((s) => s.token !== null)

  return useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsApi.getAll,
    enabled: isAuthenticated,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => notificationsApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  })
}
