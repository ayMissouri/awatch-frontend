import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { authApi, eventsApi, statsApi, type Me } from "@/lib/api"
import { useAuthStore } from "@/lib/store"

function syncStore(me: Me) {
  const cur = useAuthStore.getState().user
  if (
    !cur ||
    cur.avatar !== me.avatar ||
    cur.username !== me.username ||
    cur.display_name !== me.display_name
  ) {
    useAuthStore.getState().setUser({
      id: me.id,
      username: me.username,
      avatar: me.avatar,
      display_name: me.display_name,
    })
  }
}

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.token !== null)
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const me = await authApi.me()
      syncStore(me)
      return me
    },
    enabled: isAuthenticated,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (displayName: string) => authApi.updateMe(displayName),
    onSuccess: (me) => {
      syncStore(me)
      queryClient.setQueryData(["me"], me)
    },
  })
}

export function useProfileStats() {
  const isAuthenticated = useAuthStore((s) => s.token !== null)
  return useQuery({
    queryKey: ["stats", "profile"],
    queryFn: statsApi.profile,
    enabled: isAuthenticated,
  })
}

export function useWrapped(year?: number) {
  const isAuthenticated = useAuthStore((s) => s.token !== null)
  return useQuery({
    queryKey: ["stats", "wrapped", year ?? "current"],
    queryFn: () => statsApi.wrapped(year),
    enabled: isAuthenticated,
  })
}

export function useEvents(limit = 50, range?: { from?: number; to?: number }) {
  const isAuthenticated = useAuthStore((s) => s.token !== null)
  const from = range?.from ?? 0
  const to = range?.to ?? 0
  return useQuery({
    queryKey: ["events", limit, from, to],
    queryFn: () =>
      eventsApi.list({ limit, from: from || undefined, to: to || undefined }),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  })
}
