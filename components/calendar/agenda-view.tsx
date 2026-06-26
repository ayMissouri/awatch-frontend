"use client";

import { t } from "@/i18n";
import { cn } from "@/lib/utils";
import { ReleaseRow } from "./release-items";
import {
  type CalendarRelease,
  MONTHS_SHORT,
  WEEKDAYS,
  dateKey,
  sameDay,
  startOfDay,
} from "./calendar-data";

export function AgendaView({
  releases,
  reminders,
  onRemind,
}: {
  releases: CalendarRelease[];
  reminders: Set<number>;
  onRemind: (id: number) => void;
}) {
  const today0 = startOfDay(new Date());

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
    <div className="flex flex-col gap-7">
      {groups.map((g) => {
        const isToday = sameDay(g.date, today0);
        return (
          <section
            key={dateKey(g.date)}
            className="grid grid-cols-[120px_1fr] items-start gap-7"
          >
            <div className="sticky top-33 flex flex-col gap-0.5">
              <span
                className={cn(
                  "font-display text-[40px] leading-[0.9]",
                  isToday ? "text-marquee" : "text-foreground",
                )}
              >
                {g.date.getDate()}
              </span>
              <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                {WEEKDAYS[g.date.getDay()]} · {MONTHS_SHORT[g.date.getMonth()]}
              </span>
              {isToday && (
                <span className="mt-1 font-mono text-[9px] tracking-[0.14em] text-marquee uppercase">
                  {t.calendar.agenda.today}
                </span>
              )}
            </div>
            <div className="border border-border bg-background">
              {g.items.map((r, i) => (
                <div key={r.id} className={cn(i && "border-t border-border")}>
                  <ReleaseRow
                    r={r}
                    reminded={reminders.has(r.id)}
                    onRemind={onRemind}
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
