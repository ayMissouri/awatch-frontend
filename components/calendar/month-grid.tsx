"use client";

import { Popover as PopoverPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import { ReleaseChip, ReleaseRow } from "./release-items";
import {
  type CalendarRelease,
  MONTHS_SHORT,
  WEEKDAYS,
  dateKey,
  sameDay,
  startOfDay,
} from "./calendar-data";

function DayCell({
  date,
  releases,
  isToday,
  isPast,
  reminders,
  onRemind,
}: {
  date: Date;
  releases: CalendarRelease[];
  isToday: boolean;
  isPast: boolean;
  reminders: Set<number>;
  onRemind: (id: number) => void;
}) {
  const hasReleases = releases.length > 0;
  const shown = releases.slice(0, 3);
  const extra = releases.length - shown.length;

  const className = cn(
    "flex min-h-[132px] w-full flex-col gap-1.5 border-r border-b border-border bg-background p-2 text-left transition-colors",
    hasReleases ? "cursor-pointer hover:bg-card" : "cursor-default",
  );

  const inner = (
    <>
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "font-mono text-xs leading-none",
            isToday
              ? "bg-marquee px-1.5 py-[3px] font-semibold text-white"
              : cn(
                  "py-[3px]",
                  isPast ? "text-muted-foreground/70" : "text-foreground",
                ),
          )}
        >
          {date.getDate()}
        </span>
        {hasReleases && (
          <span className="font-mono text-[9.5px] text-muted-foreground/70">
            {releases.length}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        {shown.map((r) => (
          <ReleaseChip key={r.id} r={r} dim={isPast} />
        ))}
        {extra > 0 && (
          <span
            className={cn(
              "pl-1 font-mono text-[9.5px] tracking-[0.04em] text-muted-foreground",
              isPast && "opacity-50",
            )}
          >
            +{extra} more
          </span>
        )}
      </div>
    </>
  );

  if (!hasReleases) return <div className={className}>{inner}</div>;

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button type="button" className={className}>
          {inner}
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          side="bottom"
          sideOffset={-4}
          collisionPadding={16}
          className="z-50 w-80 border border-border bg-popover shadow-[0_24px_64px_-12px_rgb(0_0_0/0.8)] outline-none"
        >
          <div className="flex items-baseline gap-2 border-b border-border px-3.5 py-3">
            <span className="font-display text-[26px] leading-none text-foreground">
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
          <div className="max-h-80 overflow-y-auto p-1.5">
            {releases.map((r) => (
              <ReleaseRow
                key={r.id}
                r={r}
                reminded={reminders.has(r.id)}
                onRemind={onRemind}
                compact
              />
            ))}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export function MonthGrid({
  month,
  byDay,
  reminders,
  onRemind,
}: {
  month: Date;
  byDay: Record<string, CalendarRelease[]>;
  reminders: Set<number>;
  onRemind: (id: number) => void;
}) {
  const y = month.getFullYear();
  const m = month.getMonth();
  const firstDow = new Date(y, m, 1).getDay();
  const numDays = new Date(y, m + 1, 0).getDate();
  const today0 = startOfDay(new Date());

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= numDays; d++) cells.push(new Date(y, m, d));
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="border-t border-l border-border bg-background">
      <div className="grid grid-cols-7">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="border-r border-b border-border bg-white/[0.02] px-2 py-2.5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground/70 uppercase"
          >
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((date, i) =>
          date ? (
            <DayCell
              key={dateKey(date)}
              date={date}
              releases={byDay[dateKey(date)] ?? []}
              isToday={sameDay(date, today0)}
              isPast={startOfDay(date) < today0}
              reminders={reminders}
              onRemind={onRemind}
            />
          ) : (
            <div
              key={`blank-${i}`}
              className="min-h-[132px] border-r border-b border-border"
            />
          ),
        )}
      </div>
    </div>
  );
}
