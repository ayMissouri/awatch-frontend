import type { CalendarEntry } from "@/lib/api";

// A calendar entry with its release date parsed into a Date for grouping/sorting.
export interface CalendarRelease extends CalendarEntry {
  date: Date;
}

export type CalendarView = "month" | "agenda";
export type CalendarType = "all" | "tv" | "movie";

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEKDAYS_NARROW = ["S", "M", "T", "W", "T", "F", "S"];
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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
      return `S${r.season} · E${r.episode}`;
    return "New episode";
  }
  return "Premiere";
}

export function releaseSub(r: CalendarRelease): string {
  return r.media_type === "tv" ? (r.episode_title ?? "") : "";
}
