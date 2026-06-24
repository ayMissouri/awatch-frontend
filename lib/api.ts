import { useAuthStore } from "@/lib/store"

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = useAuthStore.getState().token

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed: ${res.status}`)
  }

  if (res.status === 204) return undefined as T

  return res.json()
}

// Auth
export const authApi = {
  me: () => apiFetch<{ id: string; username: string; avatar?: string }>("/auth/me"),
}

// Watchlist
export type WatchlistStatus = "watching" | "watched" | "plan_to_watch" | "paused" | "dropped"

export interface WatchlistQuery {
  page?: number
  per_page?: number
  type?: "tv" | "movie"
  status?: WatchlistStatus
  sort?: "last_updated" | "title"
  order?: "asc" | "desc"
}

export interface Progress {
  watched: number
  duration: number
}

export interface EpisodeProgress {
  season: number
  episode: number
  progress: Progress
  last_updated: number
}

export interface WatchlistItem {
  id: string
  tmdb_id?: number
  imdb_id?: string
  type: "tv" | "movie"
  title: string
  poster_path?: string
  backdrop_path?: string
  status: WatchlistStatus
  progress: Progress
  last_season_watched?: number
  last_episode_watched?: number
  episodes_watched?: number
  episodes_total?: number
  show_progress?: Record<string, EpisodeProgress>
  last_updated: number
}

export interface WatchlistResponse {
  items: WatchlistItem[]
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

export interface UpdateProgressRequest {
  progress?: Progress
  show_progress?: Record<string, EpisodeProgress>
  last_season_watched?: number
  last_episode_watched?: number
  episodes_watched?: number
  episodes_total?: number
  status?: WatchlistStatus
  last_updated?: number
}

export const watchlistApi = {
  getAll: (q: WatchlistQuery = {}) => {
    const params = new URLSearchParams()
    if (q.page) params.set("page", String(q.page))
    if (q.per_page) params.set("per_page", String(q.per_page))
    if (q.type) params.set("type", q.type)
    if (q.status) params.set("status", q.status)
    if (q.sort) params.set("sort", q.sort)
    if (q.order) params.set("order", q.order)
    return apiFetch<WatchlistResponse>(`/watchlist?${params}`)
  },

  getOne: (id: string) =>
    apiFetch<WatchlistItem>(`/watchlist/${id}`),

  upsert: (id: string, item: Omit<WatchlistItem, "id">) =>
    apiFetch<void>(`/watchlist/${id}`, {
      method: "PUT",
      body: JSON.stringify(item),
    }),

  updateProgress: (id: string, req: UpdateProgressRequest) =>
    apiFetch<void>(`/watchlist/${id}/progress`, {
      method: "PATCH",
      body: JSON.stringify(req),
    }),

  updateStatus: (id: string, status: WatchlistStatus) =>
    apiFetch<void>(`/watchlist/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/watchlist/${id}`, { method: "DELETE" }),

  bulkDelete: (ids: string[]) =>
    apiFetch<{ deleted: number }>(`/watchlist`, {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    }),
}

// Notifications
export interface Notification {
  id: number
  type: string
  title: string
  body?: string
  poster_path?: string
  link?: string
  read: boolean
  created_at: number
}

export interface NotificationsResponse {
  items: Notification[]
  unread: number
}

export const notificationsApi = {
  getAll: () => apiFetch<NotificationsResponse>("/notifications"),

  markRead: (id: number) =>
    apiFetch<void>(`/notifications/${id}/read`, { method: "PATCH" }),

  markAllRead: () =>
    apiFetch<void>(`/notifications/read-all`, { method: "PATCH" }),
}

// Calendar
export interface CalendarEntry {
  id: number
  item_id: string
  media_type: "tv" | "movie"
  imdb_id?: string
  title: string
  poster_path?: string
  season?: number
  episode?: number
  episode_title?: string
  release_date: number
  released: boolean
  link?: string
}

export interface CalendarResponse {
  items: CalendarEntry[]
}

export const calendarApi = {
  getAll: () => apiFetch<CalendarResponse>("/calendar"),
  refresh: () => apiFetch<CalendarResponse>("/calendar/refresh", { method: "POST" }),
}

// Discover
export interface DiscoverItem {
  id: string
  type: string
  title: string
  poster?: string
  background?: string
  imdb_rating?: string
  year?: string
}

export interface DiscoverAllResponse {
  popular_movies: DiscoverItem[]
  popular_shows: DiscoverItem[]
  top_rated_movies: DiscoverItem[]
  top_rated_shows: DiscoverItem[]
}

export type DiscoverSort = "popular" | "top_rated"
export type DiscoverProvider = "netflix" | "hbomax" | "disney" | "prime" | "appletv"

export interface DiscoverCatalogParams {
  type: "movie" | "series"
  sort?: DiscoverSort
  genre?: string
  year?: string | number
  provider?: DiscoverProvider
}

export const discoverApi = {
  all: () => apiFetch<DiscoverAllResponse>("/discover/all"),
  catalog: ({ type, sort, genre, year, provider }: DiscoverCatalogParams) => {
    const params = new URLSearchParams({ type })
    if (provider) params.set("provider", provider)
    else if (year != null && year !== "") params.set("year", String(year))
    else if (sort) params.set("sort", sort)
    if (genre) params.set("genre", genre)
    return apiFetch<{ items: DiscoverItem[] }>(`/discover?${params}`)
  },
  search: (query: string, type?: "movie" | "tv") => {
    const params = new URLSearchParams({ q: query })
    if (type) params.set("type", type)
    return apiFetch<{ items: DiscoverItem[]; query: string }>(`/search?${params}`)
  },
}

// Meta (details)
export interface Episode {
  id: string
  title: string
  season: number
  episode: number
  released?: string
  thumbnail?: string
  overview?: string
  imdbRating?: string
}

export interface Trailer {
  source: string
  type: string
}

export interface TrailerStream {
  title: string
  ytId: string
}

export interface MetaLink {
  name: string
  category: string
  url: string
}

export interface MovieDetail {
  id: string
  imdb_id: string
  moviedb_id?: number
  type: string
  name: string
  slug?: string
  year?: string
  releaseInfo?: string
  released?: string
  runtime?: string
  country?: string
  description?: string
  genre?: string[]
  genres?: string[]
  cast?: string[]
  director?: string[]
  writer?: string[]
  awards?: string
  imdbRating?: string
  popularity?: number
  poster?: string
  background?: string
  logo?: string
  trailers?: Trailer[]
  trailerStreams?: TrailerStream[]
  videos?: Episode[]
  links?: MetaLink[]
}

export interface SeriesDetail extends MovieDetail {
  status?: string
  tvdb_id?: number
}

export const metaApi = {
  movie: (id: string) => apiFetch<MovieDetail>(`/meta/movie/${id}`),
  series: (id: string) => apiFetch<SeriesDetail>(`/meta/series/${id}`),
}