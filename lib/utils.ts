import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { MovieDetail, WatchlistItem, WatchlistStatus } from "@/lib/api"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function detailHref(type: string, id: string, search?: string) {
  const base = type === "movie" ? `/movie/${id}` : `/series/${id}`
  return search ? `${base}?${search}` : base
}

// falls back to the IMDB id when no TMDB id is available so the key is still stable.
export function watchlistId(type: string, tmdbId?: number | null, imdbId?: string): string {
  if (tmdbId) return `${type === "movie" ? "m" : "t"}${tmdbId}`
  return imdbId ?? ""
}

export function imageUrl(value?: string, size = "w342"): string | undefined {
  if (!value) return undefined
  if (/^https?:\/\//i.test(value)) return value
  return `https://image.tmdb.org/t/p/${size}${value}`
}

export function buildWatchlistItem(meta: MovieDetail, status: WatchlistStatus): WatchlistItem {
  return {
    id: watchlistId(meta.type, meta.moviedb_id, meta.imdb_id),
    imdb_id: meta.imdb_id || meta.id,
    tmdb_id: meta.moviedb_id ?? 0,
    type: meta.type === "movie" ? "movie" : "tv",
    title: meta.name,
    poster_path: meta.poster,
    backdrop_path: meta.background,
    status,
    progress: { watched: 0, duration: 0 },
    episodes_watched: 0,
    episodes_total: 0,
    last_updated: Date.now(),
  }
}
