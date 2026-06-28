"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Header } from "@/components/home/header";
import { MobileBottomNav } from "@/components/home/mobile-bottom-nav";
import { SeeAll } from "@/components/home/poster-row";
import { ContinueWatchingCard } from "@/components/home/continue-watching-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileBanner } from "@/components/profile/profile-banner";
import { StatsRow, MobileStatsGrid } from "@/components/profile/profile-stats";
import { UpNextGrid, UpNextRail } from "@/components/profile/up-next";
import { MobileContinueList } from "@/components/profile/continue-card";
import { ActivityFeed } from "@/components/profile/activity-feed";
import {
  GenreBreakdown,
  SidebarPanel,
  UpcomingWeek,
} from "@/components/profile/sidebar-panels";
import {
  buildActivity,
  buildGenres,
  buildStats,
  buildUpcoming,
  buildUpNext,
  formatMemberSince,
  pickBackdrop,
  posterLookup,
} from "@/components/profile/profile-data";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useCalendar } from "@/hooks/use-calendar";
import { useEvents, useMe, useProfileStats, useWrapped } from "@/hooks/use-profile";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { buildReleaseLookup, isContinueWatching } from "@/lib/watchlist-status";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { t } from "@/i18n";

function SectionHead({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3.5 flex items-baseline justify-between md:mb-[18px]">
      <h2 className="font-display text-2xl leading-none tracking-[-0.005em] text-foreground md:text-[32px]">
        {title}
      </h2>
      {action}
    </div>
  );
}

function MobileSection({
  title,
  action,
  href,
  className,
  children,
}: {
  title: string;
  action?: string;
  href?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("mt-7", className)}>
      <div className="mb-3.5 flex items-end justify-between gap-3">
        <h2 className="font-display text-[25px] leading-[1.02] tracking-[-0.005em] text-balance text-foreground">
          {title}
        </h2>
        {action && href && (
          <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-1 pb-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {action}
            <ChevronRight size={11} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-[repeat(auto-fit,minmax(170px,1fr))] md:gap-3.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-[116px] w-full md:h-[132px]" />
      ))}
    </div>
  );
}

function MobileStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-px border border-border bg-border">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 bg-[var(--bg-elev)] p-4">
          <Skeleton className="h-2.5 w-20" />
          <Skeleton className="h-7 w-14" />
          <Skeleton className="h-2 w-24" />
        </div>
      ))}
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full" />
      ))}
    </div>
  );
}

function EmptyText({ children }: { children: ReactNode }) {
  return (
    <p className="border border-dashed border-border px-4 py-6 text-center text-[13px] text-muted-foreground">
      {children}
    </p>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.token !== null);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) router.replace("/");
  }, [hasHydrated, isAuthenticated, router]);

  const [now] = useState(() => Date.now());

  const { data: me } = useMe();
  const { data: stats, isLoading: statsLoading } = useProfileStats();
  const { data: wrapped } = useWrapped();
  const { data: events, isLoading: eventsLoading } = useEvents(100);
  const { data: calendar } = useCalendar();

  const { data: list, isLoading: listLoading } = useWatchlist({
    sort: "last_updated",
    order: "desc",
    per_page: 100,
  });
  const { data: totalQ } = useWatchlist({ per_page: 1 });
  const { data: showsQ } = useWatchlist({ type: "tv", per_page: 1 });
  const { data: filmsQ } = useWatchlist({ type: "movie", per_page: 1 });
  const { data: completedQ } = useWatchlist({ status: "watched", per_page: 1 });

  const items = useMemo(() => list?.items ?? [], [list]);
  const releases = useMemo(
    () => buildReleaseLookup(calendar?.items ?? []),
    [calendar],
  );

  const continueWatching = useMemo(
    () => items.filter(isContinueWatching).slice(0, 2),
    [items],
  );
  const upNext = useMemo(() => buildUpNext(items, releases), [items, releases]);
  const genres = useMemo(() => buildGenres(stats?.top_genres), [stats]);
  const activity = useMemo(
    () => buildActivity(events?.items ?? [], posterLookup(items), now),
    [events, items, now],
  );
  const upcoming = useMemo(
    () => buildUpcoming(calendar?.items ?? [], now),
    [calendar, now],
  );
  const backdrop = useMemo(
    () => pickBackdrop(events?.items ?? [], items),
    [events, items],
  );

  if (!hasHydrated || !isAuthenticated || !user) return null;

  const identity = {
    displayName: me?.display_name || user.display_name || user.username,
    username: user.username,
    avatar: me?.avatar ?? user.avatar,
    backdrop,
    memberSince: formatMemberSince(me?.created_at) ?? undefined,
  };

  const statRows = buildStats({
    stats,
    wrapped,
    items,
    total: totalQ?.pagination.total ?? 0,
    shows: showsQ?.pagination.total ?? 0,
    films: filmsQ?.pagination.total ?? 0,
    completed: completedQ?.pagination.total ?? 0,
    year: new Date(now).getFullYear(),
  });

  const statsPending = statsLoading || (!totalQ && listLoading);

  return (
    <div className="min-h-full bg-background pb-24 text-foreground md:pb-0">
      <Header user={user} active="profile" />

      <ProfileBanner user={identity} />

      {isMobile ? (
        <main className="px-[18px] pt-5 pb-6">
          {/* Stats overview */}
          <section>
            {statsPending ? (
              <MobileStatsSkeleton />
            ) : (
              <MobileStatsGrid stats={statRows} />
            )}
          </section>

          {/* Continue watching */}
          {continueWatching.length > 0 && (
            <MobileSection
              title={t.profile.sections.continueWatching}
              action={t.profile.links.watchlist}
              href="/watchlist"
            >
              <MobileContinueList items={continueWatching} />
            </MobileSection>
          )}

          {/* Up next */}
          {upNext.length > 0 && (
            <MobileSection title={t.profile.sections.upNext}>
              <UpNextRail items={upNext} />
            </MobileSection>
          )}

          {/* This week */}
          <MobileSection
            title={t.profile.sections.thisWeek}
            action={t.profile.links.calendar}
            href="/calendar"
          >
            {upcoming.length > 0 ? (
              <UpcomingWeek items={upcoming} />
            ) : (
              <EmptyText>{t.profile.empty.upcoming}</EmptyText>
            )}
          </MobileSection>

          {/* Recent activity */}
          <MobileSection
            title={t.profile.sections.recentActivity}
            action={t.profile.links.fullHistory}
            href="/profile/activity"
          >
            {eventsLoading ? (
              <ActivitySkeleton />
            ) : activity.length > 0 ? (
              <ActivityFeed entries={activity} />
            ) : (
              <EmptyText>{t.profile.empty.activity}</EmptyText>
            )}
          </MobileSection>

          {/* Favorite genres */}
          <MobileSection title={t.profile.sections.favoriteGenres}>
            {genres.length > 0 ? (
              <GenreBreakdown genres={genres} />
            ) : (
              <EmptyText>{t.profile.empty.genres}</EmptyText>
            )}
          </MobileSection>
        </main>
      ) : (
        <main className="mx-auto max-w-[1280px] px-5 pt-9 pb-20 md:px-10 md:pt-11">
          {/* Stats overview */}
          <section>{statsPending ? <StatsSkeleton /> : <StatsRow stats={statRows} />}</section>

          {/* Continue watching */}
          {continueWatching.length > 0 && (
            <section className="mt-12 md:mt-14">
              <SectionHead
                title={t.profile.sections.continueWatching}
                action={<SeeAll href="/watchlist">{t.profile.links.watchlist}</SeeAll>}
              />
              <div className="grid grid-cols-1 gap-2.5 md:grid-cols-[repeat(auto-fit,minmax(380px,1fr))] md:gap-4">
                {continueWatching.map((item) => (
                  <ContinueWatchingCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* Up next */}
          {upNext.length > 0 && (
            <section className="mt-12 md:mt-14">
              <SectionHead title={t.profile.sections.upNext} />
              <UpNextGrid items={upNext} />
            </section>
          )}

          {/* Activity + sidebar */}
          <section className="mt-12 md:mt-14">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(260px,1fr)] lg:gap-14">
              <div>
                <SectionHead
                  title={t.profile.sections.recentActivity}
                  action={<SeeAll href="/profile/activity">{t.profile.links.fullHistory}</SeeAll>}
                />
                {eventsLoading ? (
                  <ActivitySkeleton />
                ) : activity.length > 0 ? (
                  <ActivityFeed entries={activity} />
                ) : (
                  <EmptyText>{t.profile.empty.activity}</EmptyText>
                )}
              </div>
              <aside className="flex flex-col gap-11 lg:sticky lg:top-22 lg:self-start">
                <SidebarPanel title={t.profile.sections.favoriteGenres}>
                  {genres.length > 0 ? (
                    <GenreBreakdown genres={genres} />
                  ) : (
                    <EmptyText>{t.profile.empty.genres}</EmptyText>
                  )}
                </SidebarPanel>
                <SidebarPanel
                  title={t.profile.sections.thisWeek}
                  action={t.profile.links.calendar}
                  href="/calendar"
                >
                  {upcoming.length > 0 ? (
                    <UpcomingWeek items={upcoming} />
                  ) : (
                    <EmptyText>{t.profile.empty.upcoming}</EmptyText>
                  )}
                </SidebarPanel>
              </aside>
            </div>
          </section>
        </main>
      )}

      <MobileBottomNav active="you" />
    </div>
  );
}
