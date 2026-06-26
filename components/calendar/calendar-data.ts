import type { CalendarEntry } from "@/lib/api";
import { t } from "@/i18n";

// A calendar entry with its release date parsed into a Date for grouping/sorting.
export interface CalendarRelease extends CalendarEntry {
  date: Date;
}

export type CalendarView = "month" | "agenda";
export type CalendarType = "all" | "tv" | "movie";

export const WEEKDAYS = t.calendar.weekdaysShort;
export const WEEKDAYS_NARROW = t.calendar.weekdaysNarrow;
export const MONTHS = t.calendar.months;
export const MONTHS_SHORT = t.calendar.monthsShort;

export const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
export const dateKey = (d: Date) =>
  `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

export function toRelease(e: CalendarEntry): CalendarRelease {
  return { ...e, date: new Date(e.release_date) };
}

export function releaseTag(r: CalendarRelease): string {
  if (r.media_type === "tv") {
    if (r.season != null && r.episode != null)
      return t.calendar.release.seasonEpisode(r.season, r.episode);
    return t.calendar.release.newEpisode;
  }
  return t.calendar.release.premiere;
}

export function releaseSub(r: CalendarRelease): string {
  return r.media_type === "tv" ? (r.episode_title ?? "") : "";
}
