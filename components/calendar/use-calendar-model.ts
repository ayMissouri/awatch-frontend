"use client";

import { useCallback, useMemo, useState } from "react";
import {
  type CalendarRelease,
  type CalendarType,
  type CalendarView,
  dateKey,
  startOfDay,
} from "./calendar-data";

export function useCalendarModel(releases: CalendarRelease[]) {
  const today0 = useMemo(() => startOfDay(new Date()), []);

  const [view, setView] = useState<CalendarView>("month");
  const [typeFilter, setTypeFilter] = useState<CalendarType>("all");
  const [monthIdx, setMonthIdx] = useState(0);
  const [reminders, setReminders] = useState<Set<number>>(() => new Set());

  // only show current month and above
  const months = useMemo(() => {
    const first = new Date(today0.getFullYear(), today0.getMonth(), 1);
    const out = [first];
    if (releases.length) {
      const last = releases[releases.length - 1].date;
      const lastM = new Date(last.getFullYear(), last.getMonth(), 1);
      const cur = new Date(first);
      while (cur < lastM) {
        cur.setMonth(cur.getMonth() + 1);
        out.push(new Date(cur));
      }
    }
    return out;
  }, [releases, today0]);

  const safeMonthIdx = Math.min(monthIdx, months.length - 1);
  const month = months[safeMonthIdx];

  const byDay = useMemo(() => {
    const map: Record<string, CalendarRelease[]> = {};
    releases
      .filter(
        (r) =>
          r.date.getFullYear() === month.getFullYear() &&
          r.date.getMonth() === month.getMonth() &&
          (typeFilter === "all" || r.media_type === typeFilter),
      )
      .forEach((r) => {
        const k = dateKey(startOfDay(r.date));
        (map[k] = map[k] ?? []).push(r);
      });
    return map;
  }, [releases, month, typeFilter]);

  const agenda = useMemo(
    () =>
      releases.filter(
        (r) =>
          startOfDay(r.date) >= today0 &&
          (typeFilter === "all" || r.media_type === typeFilter),
      ),
    [releases, typeFilter, today0],
  );

  const monthCount = useMemo(
    () => Object.values(byDay).reduce((a, b) => a + b.length, 0),
    [byDay],
  );

  const toggleRemind = useCallback(
    (id: number) =>
      setReminders((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      }),
    [],
  );

  return {
    today0,
    view,
    setView,
    typeFilter,
    setTypeFilter,
    monthIdx: safeMonthIdx,
    setMonthIdx,
    months,
    month,
    reminders,
    toggleRemind,
    byDay,
    agenda,
    monthCount,
    upcomingCount: agenda.length,
  };
}
