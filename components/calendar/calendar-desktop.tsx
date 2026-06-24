"use client";

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
import { AgendaView } from "./agenda-view";
import { CalendarEmpty } from "./empty-state";
import { MonthGrid } from "./month-grid";
import { useCalendarModel } from "./use-calendar-model";
import { type CalendarRelease, MONTHS, MONTHS_SHORT } from "./calendar-data";
import { cn } from "@/lib/utils";

export function CalendarDesktop({
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

  return (
    <main className="mx-auto max-w-295 px-5 pt-9 pb-16 md:px-8">
      {/* Hero */}
      <div className="mb-7 flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-marquee uppercase">
            Coming up
          </span>
          <h1 className="mt-2.5 font-display text-[44px] leading-none tracking-[-0.01em] text-foreground md:text-[64px]">
            On the calendar
          </h1>
          <p className="mt-3.5 max-w-115 text-[14.5px] leading-relaxed text-muted-foreground">
            Premieres and new episodes from your watchlist, by the date they
            land.
          </p>
        </div>
        <div className="text-right">
          <div className="font-mono text-3xl leading-none text-foreground">
            {m.upcomingCount}
          </div>
          <div className="mt-1.5 font-mono text-[10px] tracking-[0.1em] text-muted-foreground/70 uppercase">
            upcoming
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-13 z-40 mb-6 border-b border-border bg-background pt-2 pb-4 md:top-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {m.view === "month" ? (
            <div className="flex items-center gap-2.5">
              <div className="flex border border-border bg-card">
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
              <h2 className="flex items-baseline gap-2.5 font-display text-3xl leading-none text-foreground">
                {MONTHS[m.month.getMonth()]}
                <span className="font-mono text-sm text-muted-foreground/70">
                  {m.month.getFullYear()}
                </span>
              </h2>
              {m.monthIdx !== 0 && (
                <button
                  type="button"
                  onClick={() => m.setMonthIdx(0)}
                  className="h-[30px] border border-border bg-card px-3 text-[12.5px] font-medium text-muted-foreground transition-colors hover:border-white/25 hover:text-foreground"
                >
                  Today
                </button>
              )}
              <span className="ml-1 font-mono text-[11px] text-muted-foreground/70">
                {m.monthCount} release{m.monthCount === 1 ? "" : "s"}
              </span>
            </div>
          ) : (
            <h2 className="flex items-baseline gap-3 font-display text-3xl leading-none text-foreground">
              Upcoming
              <span className="font-mono text-[13px] text-muted-foreground/70">
                from {MONTHS_SHORT[m.today0.getMonth()]} {m.today0.getDate()}
              </span>
            </h2>
          )}

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              title="Sync from watchlist"
              className="inline-flex size-[34px] items-center justify-center border border-border bg-card text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={cn(refreshing && "animate-spin")}
              />
            </button>
            <Segmented
              value={m.typeFilter}
              onChange={m.setTypeFilter}
              items={[
                { id: "all", label: "All" },
                { id: "tv", label: "Episodes", icon: <Tv size={14} /> },
                { id: "movie", label: "Movies", icon: <Film size={14} /> },
              ]}
            />
            <Segmented
              value={m.view}
              onChange={m.setView}
              items={[
                {
                  id: "month",
                  icon: <Grid2x2 size={14} />,
                  title: "Month grid",
                },
                { id: "agenda", icon: <List size={14} />, title: "Agenda" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <Skeleton className="h-150 w-full" />
      ) : m.view === "month" ? (
        m.monthCount === 0 ? (
          <CalendarEmpty
            icon={CalendarIcon}
            title="Nothing this month"
            hint="No releases from your watchlist land in this month. Jump to another month or switch to the agenda."
          />
        ) : (
          <MonthGrid
            month={m.month}
            byDay={m.byDay}
            reminders={m.reminders}
            onRemind={m.toggleRemind}
          />
        )
      ) : m.agenda.length === 0 ? (
        <CalendarEmpty
          icon={CalendarIcon}
          title="Nothing upcoming"
          hint="Nothing from your watchlist has an announced date yet. Hit sync to check for newly scheduled releases."
        />
      ) : (
        <AgendaView
          releases={m.agenda}
          reminders={m.reminders}
          onRemind={m.toggleRemind}
        />
      )}
    </main>
  );
}
