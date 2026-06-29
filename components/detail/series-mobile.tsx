/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck, ChevronRight } from "lucide-react";
import { HomeIconButton } from "@/components/home/home-button";
import {
  useDeleteWatchlistItem,
  useUpdateProgress,
  useUpsertWatchlistItem,
} from "@/hooks/use-watchlist";
import { buildWatchlistItem } from "@/lib/utils";
import { showStatusFromEpisodes } from "@/lib/watchlist-status";
import {
  DPAD,
  MACTIONBAR_H,
  MActionBar,
  MCastScroll,
  MEpisodeRow,
  MMetaList,
  MSectionHead,
  MTOPBAR_H,
  MTopBar,
} from "@/components/detail/mobile-shared";
import {
  EASE_OUT,
  ExternalIdLink,
  Eyebrow,
  Legend,
  MetaInline,
  SeasonSortToggle,
  StarRating,
  StatusPill,
  formatDate,
  groupSeasons,
  imdbUrl,
  isEpisodeUnaired,
  tmdbUrl,
  tvdbUrl,
  type DetailEpisode,
  type SeasonOrder,
} from "@/components/detail/shared";
import type { SeriesDetail, WatchlistItem } from "@/lib/api";
import { t } from "@/i18n";

type Boundary = { season: number; episode: number } | null;

interface SeriesIndexMobileProps {
  series: SeriesDetail;
  item?: WatchlistItem | null;
}

function statusKindOf(status?: string): "returning" | "ended" | "planned" {
  if (/return|continu/i.test(status ?? "")) return "returning";
  if (/end|cancel/i.test(status ?? "")) return "ended";
  return "planned";
}

const pad2 = (n: number) => String(n).padStart(2, "0");

const nowMs = () => Date.now();

export function SeriesIndexMobile({ series: s, item }: SeriesIndexMobileProps) {
  const router = useRouter();
  const genres = s.genre ?? s.genres ?? [];
  const inWatchlist = !!item;

  const itemLastSeason = item?.last_season_watched ?? null;
  const itemLastEpisode = item?.last_episode_watched ?? null;
  const [localBoundary, setLocalBoundary] = React.useState<
    Boundary | undefined
  >(undefined);
  const boundaryKey = `${itemLastSeason}:${itemLastEpisode}`;
  const [prevBoundaryKey, setPrevBoundaryKey] = React.useState(boundaryKey);
  if (boundaryKey !== prevBoundaryKey) {
    setPrevBoundaryKey(boundaryKey);
    setLocalBoundary(undefined);
  }
  const boundary: Boundary =
    localBoundary !== undefined
      ? localBoundary
      : itemLastSeason != null && itemLastEpisode != null
        ? { season: itemLastSeason, episode: itemLastEpisode }
        : null;

  const ordered = [...(s.videos ?? [])]
    .filter((e) => e.season !== 0)
    .sort((a, b) => a.season - b.season || a.episode - b.episode);
  const boundaryIndex = boundary
    ? ordered.findIndex(
        (e) => e.season === boundary.season && e.episode === boundary.episode,
      )
    : -1;
  const orderedEps: DetailEpisode[] = ordered.map((e, i) => ({
    ...e,
    watched: i <= boundaryIndex,
  }));

  const seasons = groupSeasons(orderedEps);
  const totalEps = orderedEps.length;
  const watchedEps = boundaryIndex + 1;
  const minSeason = ordered[0]?.season ?? 1;
  const next = orderedEps.find((e) => !e.watched && !isEpisodeUnaired(e)) ?? null;

  const [openSeason, setOpenSeason] = React.useState<number | null>(() => {
    if (itemLastSeason != null && itemLastSeason !== 0) return itemLastSeason;
    return ordered[0]?.season ?? null;
  });
  const [seasonOrder, setSeasonOrder] = React.useState<SeasonOrder>("oldest");
  const displaySeasons =
    seasonOrder === "newest" ? [...seasons].reverse() : seasons;

  const updateProgress = useUpdateProgress();
  const upsert = useUpsertWatchlistItem();
  const removeItem = useDeleteWatchlistItem();
  const watchlistBusy = upsert.isPending || removeItem.isPending;
  const toggleWatchlist = () => {
    if (item) removeItem.mutate(item.id);
    else upsert.mutate(buildWatchlistItem(s, "plan_to_watch"));
  };

  const toggleEpisode = (ep: DetailEpisode) => {
    const idx = orderedEps.findIndex((e) => e.id === ep.id);
    const newIdx = ep.watched ? idx - 1 : idx;
    const target = newIdx >= 0 ? orderedEps[newIdx] : null;
    const nextBoundary: Boundary = target
      ? { season: target.season, episode: target.episode }
      : null;
    setLocalBoundary(nextBoundary);

    const episodesWatched = newIdx + 1;
    const episodesTotal = orderedEps.length;
    const status = showStatusFromEpisodes(episodesWatched, episodesTotal);
    const lastSeasonWatched = nextBoundary ? nextBoundary.season : minSeason;
    const lastEpisodeWatched = nextBoundary ? nextBoundary.episode : 0;
    const lastUpdated = nowMs();

    if (item) {
      updateProgress.mutate(
        {
          id: item.id,
          req: {
            episodes_watched: episodesWatched,
            episodes_total: episodesTotal,
            status,
            last_season_watched: lastSeasonWatched,
            last_episode_watched: lastEpisodeWatched,
            last_updated: lastUpdated,
          },
        },
        { onError: () => setLocalBoundary(undefined) },
      );
      return;
    }

    if (!nextBoundary) return;
    upsert.mutate(
      {
        ...buildWatchlistItem(s, status),
        episodes_watched: episodesWatched,
        episodes_total: episodesTotal,
        last_season_watched: lastSeasonWatched,
        last_episode_watched: lastEpisodeWatched,
        last_updated: lastUpdated,
      },
      { onError: () => setLocalBoundary(undefined) },
    );
  };

  const statusKind = statusKindOf(s.status);
  const statusShort =
    statusKind === "returning"
      ? t.detail.status.returning
      : statusKind === "ended"
        ? t.detail.status.ended
        : s.status;
  const pctDone = totalEps ? Math.round((watchedEps / totalEps) * 100) : 0;

  return (
    <div
      style={{
        background: "var(--bg)",
        color: "var(--fg)",
        minHeight: "100%",
        paddingBottom: MACTIONBAR_H,
        position: "relative",
      }}
    >
      <MTopBar title={s.name} onBack={() => router.back()} />

      {/* HERO */}
      <section
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(440px, 66vh, 560px)",
          marginTop: -MTOPBAR_H,
          background: "var(--ink-950)",
          overflow: "hidden",
        }}
      >
        {s.background && (
          <img
            src={s.background}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.9,
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 26%, rgba(0,0,0,0.5) 58%, var(--bg) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: DPAD,
            right: DPAD,
            bottom: 20,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <Eyebrow color="var(--marquee-500)">
              {t.detail.eyebrow.series}
              {s.releaseInfo ? ` · ${s.releaseInfo}` : ""}
            </Eyebrow>
            {statusShort && (
              <StatusPill kind={statusKind}>{statusShort}</StatusPill>
            )}
            {inWatchlist &&
              watchedEps > 0 &&
              (watchedEps >= totalEps && totalEps > 0 ? (
                <StatusPill kind="watched">
                  {t.detail.status.watched}
                </StatusPill>
              ) : (
                <StatusPill kind="watching">
                  {t.detail.status.watching}
                </StatusPill>
              ))}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 56,
              lineHeight: 0.9,
              letterSpacing: "-0.015em",
              color: "white",
              margin: 0,
              fontStyle: "italic",
              textWrap: "balance",
            }}
          >
            {s.name}
          </h1>
          <MetaInline
            color="rgba(255,255,255,0.85)"
            items={[
              s.imdbRating ? (
                <StarRating key="r" value={s.imdbRating} size={12} />
              ) : null,
              seasons.length ? t.detail.meta.seasons(seasons.length) : null,
              totalEps ? t.detail.meta.episodes(totalEps) : null,
              genres.length ? (
                <span
                  key="genre"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {genres.join(" · ")}
                </span>
              ) : null,
            ]}
          />
        </div>
      </section>

      {/* DESCRIPTION */}
      {s.description && (
        <section style={{ padding: `10px ${DPAD}px 0` }}>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-sans)",
              fontSize: 14.5,
              lineHeight: 1.6,
              color: "var(--fg)",
              textWrap: "pretty",
            }}
          >
            {s.description}
          </p>
        </section>
      )}

      {/* PROGRESS MAP */}
      <section style={{ marginTop: 30 }}>
        <MSectionHead
          title={t.detail.meta.countShort(watchedEps, totalEps)}
          eyebrow={t.detail.sections.progressMap}
          right={t.detail.meta.pctDone(pctDone)}
          style={{ marginBottom: 16 }}
        />

        {/* legend */}
        <div style={{ display: "flex", gap: 16, padding: `0 ${DPAD}px 16px` }}>
          <Legend
            swatch="var(--marquee-500)"
            label={t.detail.legend.watched}
          />
          <Legend
            swatch="rgba(228,79,47,0.22)"
            border="var(--marquee-500)"
            label={t.detail.legend.upNext}
          />
          <Legend
            swatch="transparent"
            border="var(--border-strong)"
            label={t.detail.legend.unseen}
          />
        </div>

        {seasons.length > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: `0 ${DPAD}px 14px`,
            }}
          >
            <SeasonSortToggle value={seasonOrder} onChange={setSeasonOrder} />
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            background: "var(--border)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {displaySeasons.map((season) => {
            const isOpen = openSeason === season.season;
            return (
              <div key={season.season} style={{ background: "var(--bg)" }}>
                <button
                  type="button"
                  onClick={() => setOpenSeason(isOpen ? null : season.season)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                    background: isOpen ? "var(--bg-elev)" : "var(--bg)",
                    padding: `16px ${DPAD}px`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    transition: `background 160ms ${EASE_OUT}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        minWidth: 0,
                      }}
                    >
                      <Eyebrow color="var(--fg-subtle)">
                        {t.detail.meta.episodes(season.total)}
                      </Eyebrow>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 24,
                          lineHeight: 1,
                          letterSpacing: "-0.005em",
                          color: "var(--fg-strong)",
                        }}
                      >
                        {t.detail.season.labelPadded(pad2(season.season))}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 16,
                          color: "var(--fg)",
                        }}
                      >
                        {season.watched}
                        <span style={{ color: "var(--fg-subtle)" }}>
                          /{season.total}
                        </span>
                      </span>
                      <div
                        style={{
                          transition: `transform 220ms ${EASE_OUT}`,
                          transform: isOpen ? "rotate(90deg)" : "none",
                        }}
                      >
                        <ChevronRight
                          size={14}
                          style={{ color: "var(--fg-muted)" }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* episode pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {season.episodes.map((ep) => {
                      const isNext = !!next && ep.id === next.id;
                      return (
                        <div
                          key={ep.id}
                          title={`E${ep.episode} · ${ep.title}`}
                          style={{
                            width: 30,
                            height: 26,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: ep.watched
                              ? "var(--marquee-500)"
                              : isNext
                                ? "rgba(228,79,47,0.18)"
                                : "transparent",
                            border: ep.watched
                              ? "1px solid var(--marquee-500)"
                              : isNext
                                ? "1px solid var(--marquee-500)"
                                : "1px solid var(--border-strong)",
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            fontWeight: 500,
                            color: ep.watched
                              ? "var(--ink-50)"
                              : isNext
                                ? "var(--marquee-500)"
                                : "var(--fg-subtle)",
                            letterSpacing: "0.02em",
                          }}
                        >
                          {pad2(ep.episode)}
                        </div>
                      );
                    })}
                  </div>
                </button>

                {/* expanded list */}
                {isOpen && (
                  <div>
                    {season.episodes.map((ep) => (
                      <MEpisodeRow
                        key={ep.id}
                        ep={ep}
                        isNext={!!next && ep.id === next.id}
                        onToggle={toggleEpisode}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CAST */}
      {s.cast && s.cast.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <MSectionHead
            title={t.detail.sections.cast}
            right={t.detail.meta.credited(s.cast.length)}
            style={{ marginBottom: 14 }}
          />
          <MCastScroll cast={s.cast} />
        </section>
      )}

      {/* META */}
      <section style={{ padding: `28px ${DPAD}px 0` }}>
        <MMetaList
          rows={[
            s.director?.length
              ? { label: t.detail.labels.creator, value: s.director.join(", ") }
              : null,
            genres.length
              ? { label: t.detail.labels.genres, value: genres.join(", ") }
              : null,
            s.status ? { label: t.detail.labels.status, value: s.status } : null,
            s.released
              ? {
                  label: t.detail.labels.firstAired,
                  value: formatDate(s.released),
                  mono: true,
                }
              : null,
            s.country
              ? { label: t.detail.labels.country, value: s.country }
              : null,
            s.imdb_id
              ? {
                  label: t.detail.labels.imdb,
                  value: (
                    <ExternalIdLink href={imdbUrl(s.imdb_id)!}>
                      {s.imdb_id}
                    </ExternalIdLink>
                  ),
                }
              : null,
            s.moviedb_id != null
              ? {
                  label: t.detail.labels.tmdb,
                  value: (
                    <ExternalIdLink href={tmdbUrl(s.moviedb_id, "tv")!}>
                      {s.moviedb_id}
                    </ExternalIdLink>
                  ),
                }
              : null,
            s.tvdb_id != null
              ? {
                  label: t.detail.labels.tvdb,
                  value: (
                    <ExternalIdLink href={tvdbUrl(s.tvdb_id)!}>
                      {s.tvdb_id}
                    </ExternalIdLink>
                  ),
                }
              : null,
          ].filter((r): r is NonNullable<typeof r> => !!r)}
        />
      </section>

      <div style={{ height: 16 }} />

      {/* ACTION BAR */}
      <MActionBar>
        <HomeIconButton
          size={44}
          variant={inWatchlist ? "secondary" : "outline"}
          onClick={toggleWatchlist}
          disabled={watchlistBusy}
          aria-label={
            inWatchlist
              ? t.detail.actions.removeFromWatchlist
              : t.detail.actions.addToWatchlist
          }
        >
          {inWatchlist ? <BookmarkCheck /> : <Bookmark />}
        </HomeIconButton>
      </MActionBar>
    </div>
  );
}
