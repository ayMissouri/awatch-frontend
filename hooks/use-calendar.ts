import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { calendarApi, type CalendarResponse } from "@/lib/api"
import { useAuthStore } from "@/lib/store"

export function useCalendar() {
  const isAuthenticated = useAuthStore((s) => s.token !== null)

  return useQuery({
    queryKey: ["calendar"],
    queryFn: calendarApi.getAll,
    enabled: isAuthenticated,
  })
}

export function useRefreshCalendar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => calendarApi.refresh(),
    onSuccess: (data: CalendarResponse) => queryClient.setQueryData(["calendar"], data),
  })
}
