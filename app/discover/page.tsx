"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Film, Search, Tv } from "lucide-react";
import { Header } from "@/components/home/header";
import { MobileBottomNav } from "@/components/home/mobile-bottom-nav";
import { PosterCard } from "@/components/home/poster-card";
import { Segmented } from "@/components/watchlist/segmented";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  ChipRail,
  ModeTabs,
  YearInput,
  type ChipOption,
} from "@/components/discover/discover-filters";
import {
  CURATIONS,
  GENRES,
  NETWORKS,
  NETWORK_LABEL,
  discoverHeading,
  parseDiscoverParams,
  type Curation,
  type DiscoverMode,
  type DiscoverSelection,
  type DiscoverType,
} from "@/components/discover/discover-data";
import { useDiscoverCatalog } from "@/hooks/use-discover";
import { t } from "@/i18n";
import { fromQuery, type Crumb } from "@/lib/breadcrumbs";
import { useAuthStore } from "@/lib/store";
import type { DiscoverItem } from "@/lib/api";

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

const TYPE_ITEMS = [
  { id: "all" as const, label: t.discover.types.all },
  { id: "movie" as const, label: t.discover.types.movies, icon: <Film size={14} /> },
  { id: "tv" as const, label: t.discover.types.shows, icon: <Tv size={14} /> },
];

function ResultCount({ n }: { n: number }) {
  return (
    <span className="font-mono text-[11px] tracking-[0.04em] text-muted-foreground">
      <span className="text-foreground">{n}</span> {t.discover.titlesLabel(n)}
    </span>
  );
}

function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3.5 px-6 py-20 text-center">
      <div className="flex size-14 items-center justify-center border border-border bg-card">
        <Search size={22} className="text-muted-foreground/60" />
      </div>
      <div className="font-display text-[28px] leading-none text-foreground">
        {title}
      </div>
      <div className="max-w-85 text-[13.5px] leading-relaxed text-muted-foreground">
        {hint}
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(168px,1fr))] md:gap-5">
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="aspect-2/3 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-2 w-1/2" />
        </div>
      ))}
    </div>
  );
}

// this seeds the filter state from the URL so the breadcrumb links go to the exact state
export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="min-h-full bg-background" />}>
      <DiscoverContent />
    </Suspense>
  );
}

function DiscoverContent() {
  const user = useAuthStore((s) => s.user);
  const searchParams = useSearchParams();

  const [seed] = useState<DiscoverSelection>(() =>
    parseDiscoverParams(new URLSearchParams(searchParams.toString())),
  );
  const [mode, setMode] = useState<DiscoverMode>(seed.mode);
  const [type, setType] = useState<DiscoverType>(seed.type);
  const [genre, setGenre] = useState<string | null>(seed.genre);
  const [curation, setCuration] = useState<Curation>(seed.curation);
  const [year, setYear] = useState<number | null>(seed.year);
  const [provider, setProvider] = useState<string | null>(seed.provider);

  // Switching mode clears the other dimensions' selections (one lens at a time).
  const selectMode = (m: DiscoverMode) => {
    setMode(m);
    setGenre(null);
    setYear(null);
    setProvider(null);
  };
  const clearSelection = () => {
    setGenre(null);
    setYear(null);
    setProvider(null);
  };

  const sel: DiscoverSelection = {
    mode,
    type,
    genre,
    curation,
    year,
    provider,
  };
  const {
    data: results = [],
    isLoading,
    isError,
    refetch,
  } = useDiscoverCatalog(sel);

  const value = mode === "genre" ? genre : mode === "year" ? year : provider;
  const hasSelection = value != null;

  const dimLabel =
    genre ??
    (year != null
      ? String(year)
      : provider
        ? (NETWORK_LABEL[provider] ?? provider)
        : null);
  const crumbs: Crumb[] = [
    {
      label: t.discover.title,
      onClick: () => {
        setMode("genre");
        setType("all");
        setCuration("popular");
        clearSelection();
      },
    },
  ];
  if (type !== "all")
    crumbs.push({
      label: type === "movie" ? t.discover.types.movies : t.discover.types.shows,
      onClick: clearSelection,
    });
  if (dimLabel) crumbs.push({ label: dimLabel });

  const fromCtx = fromQuery({
    from: "discover",
    type,
    curation: mode === "genre" ? curation : undefined,
    genre: mode === "genre" ? genre : undefined,
    year: mode === "year" ? year : undefined,
    provider: mode === "network" ? provider : undefined,
  });

  const dim: {
    options: ChipOption[];
    value: string | null;
    onSelect: (id: string | null) => void;
    allLabel: string;
    withDot: boolean;
  } =
    mode === "network"
      ? {
          options: NETWORKS.map((n) => ({
            id: n.id,
            label: n.label,
            tint: n.tint,
          })),
          value: provider,
          onSelect: setProvider,
          allLabel: t.discover.filters.allNetworks,
          withDot: true,
        }
      : {
          options: GENRES.map((g) => ({ id: g, label: g })),
          value: genre,
          onSelect: setGenre,
          allLabel: t.discover.filters.allGenres,
          withDot: false,
        };

  return (
    <div className="min-h-full bg-background pb-24 text-foreground md:pb-0">
      <Header user={user} active="discover" />

      <main className="mx-auto max-w-[1280px] px-5 pt-9 pb-20 md:px-10 md:pt-10">
        {/* Breadcrumb trail */}
        {crumbs.length > 1 && <Breadcrumbs items={crumbs} className="mb-6" />}

        {/* Head */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-marquee uppercase">
              {t.discover.eyebrow}
            </span>
            <h1 className="mt-3.5 font-display text-[52px] leading-[0.96] tracking-[-0.01em] text-white md:text-[68px] md:leading-[0.98]">
              {t.discover.title}
            </h1>
          </div>
          <p className="mb-1.5 hidden max-w-[350px] text-[14.5px] leading-relaxed text-pretty text-muted-foreground md:block">
            {t.discover.intro}
          </p>
        </div>

        {/* Filter bar */}
        <div className="sticky top-13 z-40 -mx-5 mt-8 flex flex-col gap-4 border-y border-border bg-black/[0.86] px-5 py-5 backdrop-blur-md md:top-16 md:-mx-10 md:mt-9 md:gap-5 md:px-10">
          {/* mode tabs/sub-filters */}
          <div className="flex flex-col gap-3.5 md:flex-row md:items-end md:justify-between md:gap-4">
            <ModeTabs mode={mode} onChange={selectMode} />
            <div className="flex items-center gap-3 overflow-x-auto pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {mode === "genre" && (
                <>
                  <span className="hidden font-mono text-[9.5px] tracking-[0.12em] text-muted-foreground/80 uppercase md:inline">
                    {t.discover.filters.show}
                  </span>
                  <Segmented
                    items={CURATIONS}
                    value={curation}
                    onChange={setCuration}
                  />
                </>
              )}
              <Segmented items={TYPE_ITEMS} value={type} onChange={setType} />
            </div>
          </div>

          {mode === "year" ? (
            <div className="w-full md:w-[220px]">
              <YearInput value={year} onPick={setYear} full />
            </div>
          ) : (
            <ChipRail
              options={dim.options}
              value={dim.value}
              onSelect={dim.onSelect}
              allLabel={dim.allLabel}
              withDot={dim.withDot}
            />
          )}
        </div>

        {/* Results heading */}
        <div className="mt-8 mb-5 flex items-baseline gap-3.5">
          <h2 className="font-display text-2xl leading-none tracking-[-0.005em] whitespace-nowrap text-white md:text-[30px]">
            {discoverHeading(sel)}
          </h2>
          <ResultCount n={results.length} />
          {hasSelection && (
            <button
              type="button"
              onClick={clearSelection}
              className="text-xs font-medium text-muted-foreground/80 underline underline-offset-[3px] transition-colors hover:text-foreground"
            >
              {t.discover.clear}
            </button>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <GridSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-3.5 px-6 py-20 text-center">
            <div className="font-display text-[28px] leading-none text-foreground">
              {t.discover.error.title}
            </div>
            <div className="max-w-85 text-[13.5px] leading-relaxed text-muted-foreground">
              {t.discover.error.hint}
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-1 inline-flex h-9 items-center border border-border bg-card px-4 text-[13px] font-medium text-foreground transition-colors hover:border-white/25"
            >
              {t.discover.error.retry}
            </button>
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            title={t.discover.empty.title}
            hint={t.discover.empty.hint}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(168px,1fr))] md:gap-5">
            {results.map((item) => (
              <PosterCard
                key={item.id}
                item={toPosterItem(item)}
                from={fromCtx}
              />
            ))}
          </div>
        )}
      </main>

      <MobileBottomNav active="discover" />
    </div>
  );
}
