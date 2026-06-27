"use client";

import { Header } from "@/components/home/header";
import {
  ContinueWatchingCard,
  UpNextCard,
} from "@/components/home/continue-watching-card";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { MobileBottomNav } from "@/components/home/mobile-bottom-nav";
import { CardRow, PosterRow, SeeAll } from "@/components/home/poster-row";
import { Skeleton } from "@/components/ui/skeleton";
import { useCalendar } from "@/hooks/use-calendar";
import { useDiscoverAll } from "@/hooks/use-discover";
import { useWatchlist } from "@/hooks/use-watchlist";
import {
  buildReleaseLookup,
  isContinueWatching,
  isReleased,
  isUpNext,
} from "@/lib/watchlist-status";
import { useAuthStore } from "@/lib/store";
import type { DiscoverAllResponse, DiscoverItem } from "@/lib/api";
import { t } from "@/i18n";

function toPosterItem(item: DiscoverItem) {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    poster: item.poster,
    year: item.year,
    rating: item.imdb_rating,
  };
}

function buildHeroItems(
  discover: DiscoverAllResponse | undefined,
): DiscoverItem[] {
  if (!discover) return [];
  const { popular_movies: movies, popular_shows: shows } = discover;
  const mixed: DiscoverItem[] = [];
  for (
    let i = 0;
    i < Math.max(movies.length, shows.length) && mixed.length < 7;
    i++
  ) {
    if (movies[i] && mixed.length < 7) mixed.push(movies[i]);
    if (shows[i] && mixed.length < 7) mixed.push(shows[i]);
  }
  return mixed;
}

function HeroSkeleton() {
  return (
    <Skeleton className="-mt-16 aspect-21/9 max-h-[640px] min-h-[480px] w-full pt-16" />
  );
}

function RailSkeleton() {
  return (
    <section className="mt-14">
      <Skeleton className="mb-[18px] h-8 w-48" />
      <div className="flex gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-2/3 w-40 shrink-0" />
        ))}
      </div>
    </section>
  );
}

export function HomeSignedIn() {
  const user = useAuthStore((s) => s.user);
  const { data: discover, isLoading: discoverLoading } = useDiscoverAll();
  const { data: watchlist } = useWatchlist({
    sort: "last_updated",
    order: "desc",
    per_page: 12,
  });
  const { data: calendar } = useCalendar();

  const items = watchlist?.items ?? [];
  const releases = buildReleaseLookup(calendar?.items ?? []);
  const continueWatching = items.filter(isContinueWatching).slice(0, 3);
  const upNext = items
    .filter(isUpNext)
    .filter((item) => isReleased(item, releases))
    .slice(0, 6);
  const heroItems = buildHeroItems(discover);

  return (
    <div className="min-h-full bg-background text-foreground">
      <Header user={user} />
      {discoverLoading ? <HeroSkeleton /> : <HeroCarousel items={heroItems} />}

      <div className="mx-auto max-w-[1440px] px-5 pb-20 md:px-12 md:pb-24">
        {continueWatching.length > 0 && (
          <section className="mt-9 md:mt-14">
            <div className="mb-3.5 flex items-baseline justify-between md:mb-[18px]">
              <h2 className="font-display text-2xl leading-none tracking-[-0.005em] text-foreground md:text-[32px]">
                {t.home.rails.continueWatching}
              </h2>
              <SeeAll href="/watchlist" />
            </div>
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-[repeat(auto-fit,minmax(340px,1fr))] md:gap-[18px]">
              {continueWatching.map((item) => (
                <ContinueWatchingCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {upNext.length > 0 && (
          <CardRow title={t.home.rails.upNext} action={<SeeAll href="/watchlist" />}>
            {upNext.map((item) => (
              <UpNextCard key={item.id} item={item} />
            ))}
          </CardRow>
        )}

        {discoverLoading || !discover ? (
          <>
            <RailSkeleton />
            <RailSkeleton />
          </>
        ) : (
          <>
            <PosterRow
              title={t.home.rails.popularMovies}
              items={discover.popular_movies.map(toPosterItem)}
              action={
                <SeeAll href="/discover?type=movie">
                  {t.home.rails.allMovies}
                </SeeAll>
              }
            />
            <PosterRow
              title={t.home.rails.popularShows}
              items={discover.popular_shows.map(toPosterItem)}
              action={
                <SeeAll href="/discover?type=tv">
                  {t.home.rails.allShows}
                </SeeAll>
              }
            />
            <PosterRow
              title={t.home.rails.topRatedMovies}
              items={discover.top_rated_movies.map(toPosterItem)}
              action={
                <SeeAll href="/discover?type=movie&curation=featured">
                  {t.home.rails.allTime}
                </SeeAll>
              }
            />
            <PosterRow
              title={t.home.rails.topRatedShows}
              items={discover.top_rated_shows.map(toPosterItem)}
              action={
                <SeeAll href="/discover?type=tv&curation=featured">
                  {t.home.rails.allTime}
                </SeeAll>
              }
            />
          </>
        )}
      </div>
      <MobileBottomNav />
    </div>
  );
}
