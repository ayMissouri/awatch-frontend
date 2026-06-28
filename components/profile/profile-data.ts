import { detailHref, imageUrl } from "@/lib/utils";
import { t } from "@/i18n";
import type {
  CalendarEntry,
  LabelCount,
  ProfileStats,
  UserEvent,
  WatchlistItem,
  WrappedStats,
} from "@/lib/api";
import {
  isReleased,
  isUpNext,
  nextEpisode,
  type ReleaseLookup,
} from "@/lib/watchlist-status";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function num(n: number) {
  return n.toLocaleString("en-US");
}

function epLabel(season: number, episode: number) {
  return `S${pad(season)} · E${pad(episode)}`;
}

export function handleFromUsername(username: string): string {
  const slug = username.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
  return slug || "you";
}

export function formatMemberSince(createdAtMs?: number): string | null {
  if (!createdAtMs) return null;
  return new Date(createdAtMs).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function pickBackdrop(
  events: UserEvent[],
  items: WatchlistItem[],
): string | undefined {
  const byId = new Map(items.map((i) => [i.id, i] as const));
  for (const ev of events) {
    const watched =
      ev.event_type === "episode_watch" || ev.event_type === "movie_watch";
    const finished =
      ev.event_type === "status_change" && ev.metadata?.to === "watched";
    if (!watched && !finished) continue;
    const url = imageUrl(ev.item_id ? byId.get(ev.item_id)?.backdrop_path : undefined, "w1280");
    if (url) return url;
  }
  return undefined;
}

export type StatKey =
  | "titlesTracked"
  | "episodesWatched"
  | "watchTime"
  | "finishRate"
  | "currentStreak"
  | "thisYear";

export interface ProfileStat {
  key: StatKey;
  value: string;
  unit?: string;
  meta: string;
}

export function buildStats(args: {
  stats?: ProfileStats;
  wrapped?: WrappedStats;
  items: WatchlistItem[];
  total: number;
  shows: number;
  films: number;
  completed: number;
  year: number;
}): ProfileStat[] {
  const { stats, wrapped, items, total, shows, films, completed, year } = args;
  const episodesWatched = items.reduce((sum, i) => sum + (i.episodes_watched ?? 0), 0);
  const showsCompleted = items.filter(
    (i) => i.type === "tv" && i.status === "watched",
  ).length;
  const minutes = stats?.watch_time_minutes ?? 0;
  const watchHours = Math.round(minutes / 60);
  const watchDays = Math.round(minutes / 1440);
  const finishRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const streak = stats?.current_streak_days ?? 0;
  const m = t.profile.statMeta;
  const u = t.profile.units;

  return [
    { key: "titlesTracked", value: num(total), meta: m.showsFilms(shows, films) },
    {
      key: "episodesWatched",
      value: num(episodesWatched),
      meta: m.showsCompleted(showsCompleted),
    },
    { key: "watchTime", value: num(watchHours), unit: u.hours(watchHours), meta: m.approxDays(watchDays) },
    {
      key: "finishRate",
      value: String(finishRate),
      unit: u.percent,
      meta: m.ofCompleted(completed, total),
    },
    {
      key: "currentStreak",
      value: String(streak),
      unit: u.days(streak),
      meta: m.best(stats?.longest_streak_days ?? 0),
    },
    { key: "thisYear", value: num(wrapped?.unique_titles ?? 0), meta: m.titlesInYear(year) },
  ];
}

export type UpNextKind = "nextEpisode" | "newSeason" | "fromWatchlist";

export interface UpNextItem {
  id: string;
  type: "tv" | "movie";
  title: string;
  poster?: string;
  kind: UpNextKind;
  detail: string;
}

export function buildUpNext(items: WatchlistItem[], releases: ReleaseLookup): UpNextItem[] {
  return items
    .filter(isUpNext)
    .filter((it) => isReleased(it, releases))
    .slice(0, 4)
    .map((it) => {
      const started = it.type === "tv" && (it.episodes_watched ?? 0) > 0;
      const next = started ? nextEpisode(it) : null;
      return {
        id: it.imdb_id || it.id,
        type: it.type,
        title: it.title,
        poster: imageUrl(it.poster_path, "w342"),
        kind: started ? "nextEpisode" : "fromWatchlist",
        detail: next ? epLabel(next.season, next.episode) : "",
      };
    });
}

export type ActivityType = "watched" | "finished" | "paused";
export type ActivityBucket = "today" | "thisWeek" | "earlier";

export interface ActivityEntry {
  type: ActivityType;
  bucket: ActivityBucket;
  title: string;
  poster?: string;
  sub: string;
  when: string;
}

export const ACTIVITY_BUCKET_ORDER: ActivityBucket[] = ["today", "thisWeek", "earlier"];

function verbFor(ev: UserEvent): ActivityType | null {
  switch (ev.event_type) {
    case "movie_watch":
    case "episode_watch":
      return "watched";
    case "status_change": {
      const to = ev.metadata?.to;
      if (to === "watched") return "finished";
      if (to === "paused") return "paused";
      return null;
    }
    default:
      return null;
  }
}

function startOfDay(ms: number) {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function bucketFor(occurredMs: number, now: number): ActivityBucket {
  const today = startOfDay(now);
  if (occurredMs >= today) return "today";
  if (occurredMs >= today - 6 * 86_400_000) return "thisWeek";
  return "earlier";
}

function whenFor(occurredMs: number, now: number, bucket: ActivityBucket): string {
  const d = new Date(occurredMs);
  const w = t.profile.activity.when;
  if (bucket === "today") {
    const mins = Math.max(0, Math.round((now - occurredMs) / 60_000));
    if (mins < 1) return w.now;
    if (mins < 60) return w.minsAgo(mins);
    return w.hoursAgo(Math.round(mins / 60));
  }
  if (bucket === "thisWeek") {
    const day = d.toLocaleDateString("en-US", { weekday: "short" });
    const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return `${day} · ${time}`;
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function subFor(ev: UserEvent, verb: ActivityType): string {
  const s = t.profile.activity.sub;
  switch (verb) {
    case "finished":
      return s.finished;
    case "paused":
      return s.paused;
    case "watched":
      if (ev.event_type === "episode_watch") {
        const ep = epLabel(ev.season ?? 0, ev.episode ?? 0);
        const delta = Number(ev.metadata?.delta ?? 1);
        return delta > 1 ? s.episodes(delta, ep) : ep;
      }
      return ev.release_year ? s.film(ev.release_year) : s.filmShort;
  }
}

export function posterLookup(items: WatchlistItem[]): Map<string, string | undefined> {
  const m = new Map<string, string | undefined>();
  for (const it of items) {
    const url = imageUrl(it.poster_path, "w342");
    m.set(it.id, url);
    if (it.imdb_id) m.set(it.imdb_id, url);
  }
  return m;
}

export function buildActivity(
  events: UserEvent[],
  posters: Map<string, string | undefined>,
  now: number,
  limit = 12,
): ActivityEntry[] {
  const out: ActivityEntry[] = [];
  for (const ev of events) {
    const verb = verbFor(ev);
    if (!verb) continue;
    const bucket = bucketFor(ev.occurred_at, now);
    const poster =
      (ev.item_id && posters.get(ev.item_id)) ||
      (ev.imdb_id && posters.get(ev.imdb_id)) ||
      undefined;
    out.push({
      type: verb,
      bucket,
      title: ev.title || t.profile.activity.untitled,
      poster,
      sub: subFor(ev, verb),
      when: whenFor(ev.occurred_at, now, bucket),
    });
    if (out.length >= limit) break;
  }
  return out;
}

export const ACTIVITY_VERB_COLOR: Record<ActivityType, string> = {
  watched: "text-marquee",
  finished: "text-[#7ec19a]",
  paused: "text-[#e0b04e]",
};

export type ActivityFilter = ActivityType | "all";

export function activityTypeOf(ev: UserEvent): ActivityType | null {
  return verbFor(ev);
}

export interface ActivityDayEntry {
  type: ActivityType;
  title: string;
  poster?: string;
  sub: string;
  time: string;
  href?: string;
}

export interface ActivityDay {
  key: string;
  label: string;
  date: string;
  isToday: boolean;
  summary: string;
  entries: ActivityDayEntry[];
}

interface DayCounts {
  episodes: number;
  films: number;
  finished: number;
  paused: number;
}

function dayLabels(dayStart: number, today: number, nowYear: number) {
  const d = new Date(dayStart);
  const dd = t.profile.activity.day;
  if (dayStart === today || dayStart === today - 86_400_000) {
    return {
      label: dayStart === today ? dd.today : dd.yesterday,
      date: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    };
  }
  return {
    label: d.toLocaleDateString("en-US", { weekday: "long" }),
    date: d.toLocaleDateString(
      "en-US",
      d.getFullYear() === nowYear
        ? { month: "short", day: "numeric" }
        : { month: "short", day: "numeric", year: "numeric" },
    ),
  };
}

function daySummary(c: DayCounts): string {
  const s = t.profile.activity.daySummary;
  const parts: string[] = [];
  if (c.episodes) parts.push(s.episodes(c.episodes));
  if (c.films) parts.push(s.films(c.films));
  if (c.finished) parts.push(s.finished(c.finished));
  if (c.paused) parts.push(s.paused(c.paused));
  return parts.join(" · ");
}

function detailHrefFor(ev: UserEvent): string | undefined {
  const id = ev.imdb_id || ev.item_id;
  if (!id) return undefined;
  return detailHref(ev.media_type === "movie" ? "movie" : "tv", id, "from=activity");
}

export function buildActivityDays(
  events: UserEvent[],
  posters: Map<string, string | undefined>,
  now: number,
  filter: ActivityFilter = "all",
): ActivityDay[] {
  const today = startOfDay(now);
  const nowYear = new Date(now).getFullYear();
  const days = new Map<number, ActivityDay>();
  const counts = new Map<number, DayCounts>();
  const order: number[] = [];

  for (const ev of events) {
    const verb = verbFor(ev);
    if (!verb) continue;
    if (filter !== "all" && verb !== filter) continue;

    const dayStart = startOfDay(ev.occurred_at);
    let day = days.get(dayStart);
    if (!day) {
      const { label, date } = dayLabels(dayStart, today, nowYear);
      day = { key: String(dayStart), label, date, isToday: dayStart === today, summary: "", entries: [] };
      days.set(dayStart, day);
      counts.set(dayStart, { episodes: 0, films: 0, finished: 0, paused: 0 });
      order.push(dayStart);
    }

    const poster =
      (ev.item_id && posters.get(ev.item_id)) ||
      (ev.imdb_id && posters.get(ev.imdb_id)) ||
      undefined;
    day.entries.push({
      type: verb,
      title: ev.title || t.profile.activity.untitled,
      poster,
      sub: subFor(ev, verb),
      time: new Date(ev.occurred_at).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      href: detailHrefFor(ev),
    });

    const c = counts.get(dayStart)!;
    if (verb === "watched") {
      if (ev.event_type === "episode_watch") {
        c.episodes += Math.max(1, Number(ev.metadata?.delta ?? 1));
      } else {
        c.films += 1;
      }
    } else if (verb === "finished") {
      c.finished += 1;
    } else if (verb === "paused") {
      c.paused += 1;
    }
  }

  return order.map((k) => {
    const day = days.get(k)!;
    day.summary = daySummary(counts.get(k)!);
    return day;
  });
}

export interface Genre {
  name: string;
  count: number;
  pct: number;
}

export function buildGenres(top?: LabelCount[]): Genre[] {
  if (!top || top.length === 0) return [];
  const max = Math.max(...top.map((g) => g.count), 1);
  return top.slice(0, 6).map((g) => ({
    name: g.label,
    count: g.count,
    pct: Math.round((g.count / max) * 100),
  }));
}

export interface UpcomingItem {
  id: string;
  type: "tv" | "movie";
  dow: string;
  day: string;
  today?: boolean;
  title: string;
  poster?: string;
  sub: string;
  tag: string;
}

export function buildUpcoming(entries: CalendarEntry[], now: number): UpcomingItem[] {
  const today = startOfDay(now);
  const horizon = today + 7 * 86_400_000;
  const tag = t.profile.upcoming.tag;

  return entries
    .filter((e) => !e.released && e.release_date >= today && e.release_date < horizon)
    .sort((a, b) => a.release_date - b.release_date)
    .slice(0, 6)
    .map((e) => {
      const d = new Date(e.release_date);
      const isTv = e.media_type === "tv";
      return {
        id: e.imdb_id || e.item_id,
        type: isTv ? "tv" : "movie",
        dow: d.toLocaleDateString("en-US", { weekday: "short" }),
        day: String(d.getDate()),
        today: e.release_date < today + 86_400_000,
        title: e.title,
        poster: imageUrl(e.poster_path, "w342"),
        sub: isTv
          ? epLabel(e.season ?? 0, e.episode ?? 0)
          : e.episode_title || t.profile.upcoming.streamingRelease,
        tag: !isTv ? tag.premiere : e.episode === 1 ? tag.newSeason : tag.newEpisode,
      };
    });
}
