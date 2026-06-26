import { Bookmark, CircleCheck, Pause, Play, X } from "lucide-react"
import { t } from "@/i18n"
import type { CalendarEntry, WatchlistItem, WatchlistStatus } from "@/lib/api"

export const STATUS_ORDER: WatchlistStatus[] = [
  "watching",
  "plan_to_watch",
  "watched",
  "paused",
  "dropped",
]

export const STATUS_META: Record<
  WatchlistStatus,
  {
    label: string
    icon: typeof Play
    dot: string
    text: string
    tint: string
    border: string
  }
> = {
  watching: {
    label: t.watchlist.status.watching,
    icon: Play,
    dot: "bg-marquee",
    text: "text-marquee",
    tint: "bg-marquee/10",
    border: "border-marquee/35",
  },
  plan_to_watch: {
    label: t.watchlist.status.planned,
    icon: Bookmark,
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
    tint: "bg-white/4",
    border: "border-border",
  },
  watched: {
    label: t.watchlist.status.watched,
    icon: CircleCheck,
    dot: "bg-[#399d57]",
    text: "text-[#7ec19a]",
    tint: "bg-[#399d57]/12",
    border: "border-[#399d57]/35",
  },
  paused: {
    label: t.watchlist.status.paused,
    icon: Pause,
    dot: "bg-[#d79b3c]",
    text: "text-[#e0b04e]",
    tint: "bg-[#d79b3c]/12",
    border: "border-[#d79b3c]/35",
  },
  dropped: {
    label: t.watchlist.status.dropped,
    icon: X,
    dot: "bg-[#e7000b]",
    text: "text-[#e86a62]",
    tint: "bg-[#e7000b]/10",
    border: "border-[#e7000b]/30",
  },
}

export function showStatusFromEpisodes(watched: number, total: number): WatchlistStatus {
  if (total > 0 && watched >= total) return "watched"
  if (watched > 0) return "watching"
  return "plan_to_watch"
}

export function progressInfo(item: WatchlistItem): { pct: number; label: string } {
  if (item.status === "watched") return { pct: 100, label: t.watchlist.progress.finished }

  if (item.type === "tv") {
    const total = item.episodes_total ?? 0
    const watched = item.episodes_watched ?? 0
    const pct = total > 0 ? Math.round((watched / total) * 100) : 0
    if (watched > 0 && item.last_season_watched != null && item.last_episode_watched != null) {
      return {
        pct,
        label: `S${String(item.last_season_watched).padStart(2, "0")} · E${String(item.last_episode_watched).padStart(2, "0")}`,
      }
    }
    return {
      pct,
      label: pct > 0 ? t.watchlist.progress.percentIn(pct) : t.watchlist.progress.notStarted,
    }
  }

  const pct =
    item.progress.duration > 0
      ? Math.round((item.progress.watched / item.progress.duration) * 100)
      : 0
  return {
    pct,
    label: pct > 0 ? t.watchlist.progress.percentIn(pct) : t.watchlist.progress.notStarted,
  }
}

export function progressBarColor(item: WatchlistItem): string {
  if (item.status === "watched") return "bg-[#399d57]"
  if (item.status === "dropped") return "bg-muted-foreground/50"
  return "bg-marquee"
}

export function hasPlaybackProgress(item: WatchlistItem): boolean {
  return item.progress.watched > 0 && item.progress.watched < item.progress.duration
}

export function isContinueWatching(item: WatchlistItem): boolean {
  if (item.status === "watched" || item.status === "dropped") return false
  return hasPlaybackProgress(item)
}

export function isUpNext(item: WatchlistItem): boolean {
  if (item.status === "watched" || item.status === "dropped") return false
  if (hasPlaybackProgress(item)) return false
  if (item.type === "tv") {
    const total = item.episodes_total ?? 0
    const watched = item.episodes_watched ?? 0
    // Unknown total (freshly added) or episodes still remaining.
    return total === 0 || watched < total
  }
  return item.progress.watched === 0
}

export function nextEpisode(item: WatchlistItem): { season: number; episode: number } {
  const watched = item.episodes_watched ?? 0
  if (watched === 0 || item.last_season_watched == null || item.last_episode_watched == null) {
    return { season: 1, episode: 1 }
  }
  return { season: item.last_season_watched, episode: item.last_episode_watched + 1 }
}

export interface ReleaseLookup {
  unreleasedMovies: Set<string>
  futureEpisodeCount: Map<string, number>
  earliestUnaired: Map<string, { season: number; episode: number }>
}

export function buildReleaseLookup(entries: CalendarEntry[]): ReleaseLookup {
  const unreleasedMovies = new Set<string>()
  const futureEpisodeCount = new Map<string, number>()
  const earliestUnaired = new Map<string, { season: number; episode: number }>()
  for (const e of entries) {
    if (e.released) continue
    if (e.media_type === "movie") {
      unreleasedMovies.add(e.item_id)
      continue
    }
    futureEpisodeCount.set(e.item_id, (futureEpisodeCount.get(e.item_id) ?? 0) + 1)
    const ep = { season: e.season ?? 0, episode: e.episode ?? 0 }
    const cur = earliestUnaired.get(e.item_id)
    if (!cur || ep.season < cur.season || (ep.season === cur.season && ep.episode < cur.episode)) {
      earliestUnaired.set(e.item_id, ep)
    }
  }
  return { unreleasedMovies, futureEpisodeCount, earliestUnaired }
}

export function isReleased(item: WatchlistItem, releases: ReleaseLookup): boolean {
  if (item.type === "movie") {
    return !releases.unreleasedMovies.has(item.id)
  }

  const future = releases.futureEpisodeCount.get(item.id) ?? 0
  if (future === 0) return true

  const total = item.episodes_total ?? 0
  if (total > 0) {
    return (item.episodes_watched ?? 0) < total - future
  }

  const earliest = releases.earliestUnaired.get(item.id)
  if (!earliest) return true
  const next = nextEpisode(item)
  return (
    next.season < earliest.season ||
    (next.season === earliest.season && next.episode < earliest.episode)
  )
}
