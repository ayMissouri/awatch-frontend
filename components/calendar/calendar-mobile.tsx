"use client";

import { useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Film,
  Grid2x2,
  List,
  RefreshCw,
  Tv,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Segmented } from "@/components/watchlist/segmented";
import { CalendarEmpty } from "./empty-state";
import { ReleaseRow } from "./release-items";
import { useCalendarModel } from "./use-calendar-model";
import {
  type CalendarRelease,
  MONTHS,
  MONTHS_SHORT,
  WEEKDAYS,
  WEEKDAYS_NARROW,
  dateKey,
  sameDay,
  startOfDay,
} from "./calendar-data";
import { cn } from "@/lib/utils";

function MiniMonthGrid({
  month,
  byDay,
  selectedKey,
  onSelect,
  today0,
}: {
  month: Date;
  byDay: Record<string, CalendarRelease[]>;
  selectedKey: string | null;
  onSelect: (key: string) => void;
  today0: Date;
}) {
  const y = month.getFullYear();
  const mo = month.getMonth();
  const firstDow = new Date(y, mo, 1).getDay();
  const numDays = new Date(y, mo + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= numDays; d++) cells.push(new Date(y, mo, d));
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div className="mb-1.5 grid grid-cols-7">
        {WEEKDAYS_NARROW.map((w, i) => (
          <div
            key={i}
            className="text-center font-mono text-[9.5px] tracking-[0.1em] text-muted-foreground/70"
          >
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((date, i) => {
          if (!date) return <div key={`blank-${i}`} />;
          const key = dateKey(date);
          const releases = byDay[key] ?? [];
          const isToday = sameDay(date, today0);
          const isPast = startOfDay(date) < today0;
          const selected = selectedKey === key;
          const dots = releases.slice(0, 3);
          return (
            <button
              key={key}
              type="button"
              onClick={() => releases.length && onSelect(key)}
              className={cn(
                "flex flex-col items-center gap-1 border pt-[5px] pb-1.5 transition-colors",
                selected
                  ? "border-[var(--border-strong)] bg-card"
                  : "border-transparent",
                releases.length
                  ? "cursor-pointer hover:bg-card"
                  : "cursor-default",
                isPast && !selected && "opacity-50",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-[22px] w-6 items-center justify-center font-mono text-[13px] leading-none",
                  isToday
                    ? "bg-marquee font-semibold text-white"
                    : releases.length
                      ? "text-foreground"
                      : "text-muted-foreground/70",
                )}
              >
                {date.getDate()}
              </span>
              <span className="flex h-[5px] items-center gap-[3px]">
                {dots.map((r, j) => (
                  <span
                    key={j}
                    className={cn(
                      "size-[5px] rounded-full",
                      r.media_type === "tv"
                        ? "bg-marquee"
                        : "bg-muted-foreground",
                    )}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DayDetail({
  date,
  releases,
  reminders,
  onRemind,
  today0,
}: {
  date: Date | null;
  releases: CalendarRelease[];
  reminders: Set<number>;
  onRemind: (id: number) => void;
  today0: Date;
}) {
  if (!date) return null;
  return (
    <div>
      <div className="flex items-baseline gap-2.5 border-b border-border pt-1 pb-2.5">
        <span
          className={cn(
            "font-display text-[34px] leading-none",
            sameDay(date, today0) ? "text-marquee" : "text-foreground",
          )}
        >
          {date.getDate()}
        </span>
        <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
          {WEEKDAYS[date.getDay()]} · {MONTHS_SHORT[date.getMonth()]}{" "}
          {date.getFullYear()}
        </span>
        <span className="ml-auto font-mono text-[10px] text-muted-foreground/70">
          {releases.length} release{releases.length === 1 ? "" : "s"}
        </span>
      </div>
      {releases.length === 0 ? (
        <div className="py-7 text-center text-[13px] text-muted-foreground/70">
          Nothing lands on this day.
        </div>
      ) : (
        <div>
          {releases.map((r, i) => (
            <div
              key={r.id}
              className={cn(
                i < releases.length - 1 && "border-b border-border",
              )}
            >
              <ReleaseRow
                r={r}
                reminded={reminders.has(r.id)}
                onRemind={onRemind}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileAgenda({
  releases,
  reminders,
  onRemind,
  today0,
}: {
  releases: CalendarRelease[];
  reminders: Set<number>;
  onRemind: (id: number) => void;
  today0: Date;
}) {
  const groups: { date: Date; items: CalendarRelease[] }[] = [];
  const idx: Record<string, number> = {};
  releases.forEach((r) => {
    const k = dateKey(startOfDay(r.date));
    if (!(k in idx)) {
      idx[k] = groups.length;
      groups.push({ date: startOfDay(r.date), items: [] });
    }
    groups[idx[k]].items.push(r);
  });

  return (
    <div className="flex flex-col gap-[18px]">
      {groups.map((g) => {
        const isToday = sameDay(g.date, today0);
        return (
          <section key={dateKey(g.date)}>
            <div className="mb-1 flex items-baseline gap-[9px]">
              <span
                className={cn(
                  "font-display text-[26px] leading-none",
                  isToday ? "text-marquee" : "text-foreground",
                )}
              >
                {g.date.getDate()}
              </span>
              <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                {WEEKDAYS[g.date.getDay()]} · {MONTHS_SHORT[g.date.getMonth()]}
              </span>
              {isToday && (
                <span className="font-mono text-[9px] tracking-[0.14em] text-marquee uppercase">
                  Today
                </span>
              )}
              <span className="ml-1 h-px flex-1 bg-border" />
            </div>
            <div className="border border-border bg-background">
              {g.items.map((r, i) => (
                <div
                  key={r.id}
                  className={cn("px-2", i && "border-t border-border")}
                >
                  <ReleaseRow
                    r={r}
                    reminded={reminders.has(r.id)}
                    onRemind={onRemind}
                    compact
                  />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function CalendarMobile({
  releases,
  isLoading,
  onRefresh,
  refreshing,
}: {
  releases: CalendarRelease[];
  isLoading: boolean;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const m = useCalendarModel(releases);

  const defaultKey = useMemo(() => {
    const todayKey = dateKey(m.today0);
    if (m.byDay[todayKey]) return todayKey;
    const keys = Object.keys(m.byDay).sort(
      (a, b) => Number(a.split("-")[2]) - Number(b.split("-")[2]),
    );
    const upcoming = keys.find((k) => {
      const [yy, mm, dd] = k.split("-").map(Number);
      return new Date(yy, mm, dd) >= m.today0;
    });
    return upcoming ?? keys[0] ?? null;
  }, [m.byDay, m.today0]);

  const [picked, setPicked] = useState<string | null>(null);
  const selectedKey = picked && m.byDay[picked] ? picked : defaultKey;

  const selDate = selectedKey
    ? (() => {
        const [yy, mm, dd] = selectedKey.split("-").map(Number);
        return new Date(yy, mm, dd);
      })()
    : null;
  const selReleases = selectedKey ? (m.byDay[selectedKey] ?? []) : [];

  return (
    <main className="px-4 pb-7">
      {/* Hero */}
      <div className="pt-[18px] pb-3">
        <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-marquee uppercase">
          Coming up
        </span>
        <h1 className="mt-2 mb-2.5 font-display text-[42px] leading-none text-foreground">
          Calendar
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.04em] text-muted-foreground">
            <span>{m.upcomingCount} upcoming</span>
            <span className="h-[11px] w-px bg-[var(--border-strong)]" />
            <span>from your watchlist</span>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            title="Sync from watchlist"
            className="inline-flex size-[34px] shrink-0 items-center justify-center border border-border bg-card text-muted-foreground transition-colors enabled:hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw size={14} className={cn(refreshing && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Sticky controls */}
      <div className="sticky top-13 z-30 -mx-4 border-b border-border bg-background px-4 pt-2 pb-3">
        <div className="mb-2.5 flex items-center gap-2">
          <div className="flex h-[34px] shrink-0 border border-border bg-card">
            <button
              type="button"
              onClick={() => m.setMonthIdx(Math.max(0, m.monthIdx - 1))}
              disabled={m.monthIdx === 0}
              title="Previous month"
              className="inline-flex size-[34px] items-center justify-center border-r border-border transition-colors enabled:hover:bg-white/[0.04] disabled:opacity-35"
            >
              <ChevronLeft size={15} className="text-muted-foreground" />
            </button>
            <button
              type="button"
              onClick={() =>
                m.setMonthIdx(Math.min(m.months.length - 1, m.monthIdx + 1))
              }
              disabled={m.monthIdx === m.months.length - 1}
              title="Next month"
              className="inline-flex size-[34px] items-center justify-center transition-colors enabled:hover:bg-white/[0.04] disabled:opacity-35"
            >
              <ChevronRight size={15} className="text-muted-foreground" />
            </button>
          </div>
          <h2 className="flex min-w-0 flex-1 items-baseline gap-2 font-display text-2xl leading-none text-foreground">
            <span className="truncate">{MONTHS[m.month.getMonth()]}</span>
            <span className="font-mono text-xs text-muted-foreground/70">
              {m.month.getFullYear()}
            </span>
          </h2>
          <Segmented
            value={m.view}
            onChange={m.setView}
            items={[
              { id: "month", icon: <Grid2x2 size={14} />, title: "Month grid" },
              { id: "agenda", icon: <List size={14} />, title: "Agenda" },
            ]}
          />
        </div>
        <Segmented
          value={m.typeFilter}
          onChange={m.setTypeFilter}
          items={[
            { id: "all", label: "All" },
            { id: "tv", label: "Episodes", icon: <Tv size={14} /> },
            { id: "movie", label: "Movies", icon: <Film size={14} /> },
          ]}
        />
      </div>

      {/* Content */}
      <div className="pt-4">
        {isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : m.view === "month" ? (
          m.monthCount === 0 ? (
            <CalendarEmpty
              icon={CalendarIcon}
              title="Nothing this month"
              hint="No releases from your watchlist land in this month. Try another month or the agenda."
            />
          ) : (
            <div className="flex flex-col gap-5">
              <MiniMonthGrid
                month={m.month}
                byDay={m.byDay}
                selectedKey={selectedKey}
                onSelect={setPicked}
                today0={m.today0}
              />
              <DayDetail
                date={selDate}
                releases={selReleases}
                reminders={m.reminders}
                onRemind={m.toggleRemind}
                today0={m.today0}
              />
            </div>
          )
        ) : m.agenda.length === 0 ? (
          <CalendarEmpty
            icon={CalendarIcon}
            title="Nothing upcoming"
            hint="Nothing from your watchlist has an announced date yet. Hit sync to check for newly scheduled releases."
          />
        ) : (
          <MobileAgenda
            releases={m.agenda}
            reminders={m.reminders}
            onRemind={m.toggleRemind}
            today0={m.today0}
          />
        )}
      </div>
    </main>
  );
}
