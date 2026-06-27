"use client";

import { LogIn } from "lucide-react";
import { Header } from "@/components/home/header";
import { HomeButton } from "@/components/home/home-button";
import { PosterRow, SeeAll } from "@/components/home/poster-row";
import { Skeleton } from "@/components/ui/skeleton";
import { useDiscoverAll } from "@/hooks/use-discover";
import type { DiscoverItem } from "@/lib/api";
import { t } from "@/i18n";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

const REASSURANCE = t.home.coldOpen.reassurance;

function Hero() {
  return (
    <div className="relative -mt-16 h-120 w-full overflow-hidden bg-neutral-950 pt-16 md:h-170">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.15)_35%,rgba(0,0,0,0.4)_70%,var(--background)_100%)]" />
      <div className="absolute inset-0">
        <div className="mx-auto flex h-full max-w-[1440px] flex-col items-center justify-center gap-4 px-5 text-center md:gap-[22px] md:px-12">
          <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-white/78 uppercase">
            {t.home.coldOpen.eyebrow}
          </span>
          <h1 className="max-w-[1100px] font-display text-[56px] leading-[0.88] tracking-[-0.015em] text-white md:text-[92px] lg:text-[132px]">
            {t.home.coldOpen.titleLine1}
            <span className="italic">{t.home.coldOpen.titleEmphasis}</span>
            <br />
            {t.home.coldOpen.titleLine2}
          </h1>
          <span className="max-w-[540px] text-base leading-relaxed text-white/85">
            {t.home.coldOpen.subtitle}
          </span>
          <div className="mt-3.5 flex w-full flex-col gap-2 md:w-auto md:flex-row md:gap-2.5">
            <HomeButton
              asChild
              variant="primary"
              size="lg"
              href={`${API_URL}/auth/login`}
              className="w-full md:w-auto"
            >
              <LogIn /> {t.home.coldOpen.continueWithDiscord}
            </HomeButton>
            <HomeButton
              variant="outlineLight"
              size="lg"
              className="w-full md:w-auto"
            >
              {t.home.coldOpen.browseWithoutSigningIn}
            </HomeButton>
          </div>
        </div>
      </div>
    </div>
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

export function HomeColdOpen() {
  const { data: discover, isLoading } = useDiscoverAll();

  return (
    <div className="min-h-full bg-background text-foreground">
      <Header user={null} />
      <Hero />

      <div className="mx-auto max-w-[1440px] px-5 pb-20 md:px-12 md:pb-24">
        <section className="mt-9 grid grid-cols-1 border-t border-b border-border md:mt-14 md:grid-cols-3">
          {REASSURANCE.map((item, i) => (
            <div
              key={item.kicker}
              className={`flex flex-col gap-2.5 px-5 py-6 md:px-9 md:py-8 ${i !== 0 ? "border-t md:border-t-0 md:border-l border-border" : ""}`}
            >
              <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-marquee uppercase">
                {item.kicker}
              </span>
              <span className="font-display text-[22px] leading-none tracking-[-0.005em] text-foreground md:text-[26px]">
                {item.title}
              </span>
              <span className="text-[13.5px] leading-relaxed text-muted-foreground">
                {item.desc}
              </span>
            </div>
          ))}
        </section>

        {isLoading || !discover ? (
          <>
            <RailSkeleton />
            <RailSkeleton />
          </>
        ) : (
          <>
            <PosterRow
              title={t.home.rails.popularMovies}
              eyebrow={t.home.rails.thisWeek}
              items={discover.popular_movies.map(toPosterItem)}
              action={
                <SeeAll href="/discover?type=movie">
                  {t.home.rails.allMovies}
                </SeeAll>
              }
            />
            <PosterRow
              title={t.home.rails.popularShows}
              eyebrow={t.home.rails.thisWeek}
              items={discover.popular_shows.map(toPosterItem)}
              action={
                <SeeAll href="/discover?type=tv">
                  {t.home.rails.allShows}
                </SeeAll>
              }
            />
            <PosterRow
              title={t.home.rails.topRatedMovies}
              eyebrow={t.home.rails.allTime}
              items={discover.top_rated_movies.map(toPosterItem)}
              action={
                <SeeAll href="/discover?type=movie&curation=featured">
                  {t.home.rails.allTime}
                </SeeAll>
              }
            />
            <PosterRow
              title={t.home.rails.topRatedShows}
              eyebrow={t.home.rails.allTime}
              items={discover.top_rated_shows.map(toPosterItem)}
              action={
                <SeeAll href="/discover?type=tv&curation=featured">
                  {t.home.rails.allTime}
                </SeeAll>
              }
            />
          </>
        )}

        <section className="mt-9 grid grid-cols-1 gap-6 border-t border-border px-5 py-9 md:mt-18 md:grid-cols-[1fr_auto] md:items-center md:gap-8 md:px-12 md:py-14">
          <div className="flex max-w-[720px] flex-col gap-3">
            <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-marquee uppercase">
              {t.home.coldOpen.ready}
            </span>
            <h2 className="font-display text-[36px] leading-[0.95] tracking-[-0.01em] text-foreground md:text-[56px]">
              {t.home.coldOpen.ctaTitle}
            </h2>
            <span className="text-[14.5px] leading-relaxed text-muted-foreground">
              {t.home.coldOpen.ctaSubtitle}
            </span>
          </div>
          <HomeButton
            asChild
            variant="primary"
            size="xl"
            href={`${API_URL}/auth/login`}
            className="w-full md:w-auto"
          >
            <LogIn /> {t.home.coldOpen.continueWithDiscord}
          </HomeButton>
        </section>
      </div>
    </div>
  );
}
