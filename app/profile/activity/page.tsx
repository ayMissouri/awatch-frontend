"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/home/header";
import { MobileBottomNav } from "@/components/home/mobile-bottom-nav";
import {
  ActivityFilters,
  ActivityHistory,
  ActivityHistorySkeleton,
  ChipGroup,
} from "@/components/profile/activity-history";
import {
  activityTypeOf,
  buildActivityDays,
  posterLookup,
  type ActivityFilter,
} from "@/components/profile/profile-data";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useEvents } from "@/hooks/use-profile";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { t } from "@/i18n";

const EVENTS_LIMIT = 200;
const DAYS_PER_PAGE = 12;
const DAY_MS = 86_400_000;

type RangeKey = "7" | "30" | "90" | "all";
const RANGE_DAYS: Record<RangeKey, number | null> = {
  "7": 7,
  "30": 30,
  "90": 90,
  all: null,
};
const DEFAULT_RANGE: RangeKey = "30";
const RANGE_OPTIONS: { value: RangeKey; label: string }[] = [
  { value: "7", label: t.profile.activityPage.range.d7 },
  { value: "30", label: t.profile.activityPage.range.d30 },
  { value: "90", label: t.profile.activityPage.range.d90 },
  { value: "all", label: t.profile.activityPage.range.all },
];

export default function ActivityPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.token !== null);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) router.replace("/");
  }, [hasHydrated, isAuthenticated, router]);

  const [now] = useState(() => Date.now());
  const [filter, setFilter] = useState<ActivityFilter>("all");
  const [rangeKey, setRangeKey] = useState<RangeKey>(DEFAULT_RANGE);
  const [visibleDays, setVisibleDays] = useState(DAYS_PER_PAGE);

  const rangeDays = RANGE_DAYS[rangeKey];
  const from = rangeDays ? now - rangeDays * DAY_MS : undefined;

  const {
    data: events,
    isLoading: eventsLoading,
    isFetching,
  } = useEvents(EVENTS_LIMIT, { from });
  const { data: list } = useWatchlist({
    sort: "last_updated",
    order: "desc",
    per_page: 100,
  });

  const items = useMemo(() => list?.items ?? [], [list]);
  const posters = useMemo(() => posterLookup(items), [items]);
  const allEvents = useMemo(() => events?.items ?? [], [events]);

  const availableTypes = useMemo(() => {
    const set = new Set<string>();
    for (const ev of allEvents) {
      const type = activityTypeOf(ev);
      if (type) set.add(type);
    }
    return set;
  }, [allEvents]);

  const days = useMemo(
    () => buildActivityDays(allEvents, posters, now, filter),
    [allEvents, posters, now, filter],
  );

  const totalEvents = useMemo(
    () => days.reduce((sum, d) => sum + d.entries.length, 0),
    [days],
  );

  const changeFilter = (next: ActivityFilter) => {
    setFilter(next);
    setVisibleDays(DAYS_PER_PAGE);
  };
  const changeRange = (next: RangeKey) => {
    setRangeKey(next);
    setVisibleDays(DAYS_PER_PAGE);
  };

  if (!hasHydrated || !isAuthenticated || !user) return null;

  const shown = days.slice(0, visibleDays);
  const hasMore = days.length > visibleDays;
  const emptyMessage =
    filter !== "all"
      ? t.profile.activityPage.emptyFiltered
      : rangeKey !== "all"
        ? t.profile.activityPage.emptyRange
        : t.profile.activityPage.empty;

  return (
    <div className="min-h-full bg-background pb-24 text-foreground md:pb-0">
      <Header user={user} active="profile" />

      <main className="mx-auto max-w-[820px] px-[18px] pt-6 pb-16 md:px-8 md:pt-10">
        {/* Title */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.06em] text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          <ArrowLeft size={13} />
          {t.profile.activityPage.back}
        </Link>
        <div className="mt-3 flex items-end justify-between gap-4">
          <h1 className="font-display text-[34px] leading-none tracking-[-0.01em] text-foreground md:text-[44px]">
            {t.profile.activityPage.title}
          </h1>
          {!eventsLoading && totalEvents > 0 && (
            <span className="shrink-0 pb-1 font-mono text-[11px] tracking-[0.02em] whitespace-nowrap text-muted-foreground">
              {t.profile.activityPage.subtitle(totalEvents, days.length)}
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <ChipGroup
            value={rangeKey}
            options={RANGE_OPTIONS}
            onChange={changeRange}
            ariaLabel={t.profile.activityPage.range.label}
          />
          <ActivityFilters
            value={filter}
            available={availableTypes}
            onChange={changeFilter}
          />
        </div>

        {/* Timeline */}
        <div
          className={cn(
            "mt-7 md:mt-8",
            isFetching && !eventsLoading && "opacity-60 transition-opacity",
          )}
        >
          {eventsLoading ? (
            <ActivityHistorySkeleton />
          ) : shown.length > 0 ? (
            <>
              <ActivityHistory days={shown} />
              {hasMore && (
                <button
                  type="button"
                  onClick={() => setVisibleDays((v) => v + DAYS_PER_PAGE)}
                  className="mt-8 flex w-full items-center justify-center border border-border py-3 font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase transition-colors hover:border-[var(--border-strong)] hover:text-foreground"
                >
                  {t.profile.activityPage.showMore}
                </button>
              )}
            </>
          ) : (
            <p className="border border-dashed border-border px-4 py-12 text-center text-[13px] text-muted-foreground">
              {emptyMessage}
            </p>
          )}
        </div>
      </main>

      <MobileBottomNav active="you" />
    </div>
  );
}
