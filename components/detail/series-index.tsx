/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import {
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { Header } from "@/components/home/header";
import { HomeButton, HomeIconButton } from "@/components/home/home-button";
import { DetailCrumbs } from "@/components/breadcrumbs";
import {
  CastGrid,
  EASE_OUT,
  EpisodeRow,
  ExternalIdLink,
  Eyebrow,
  Legend,
  MetaInline,
  MetaRow,
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
import {
  useDeleteWatchlistItem,
  useUpdateProgress,
  useUpsertWatchlistItem,
} from "@/hooks/use-watchlist";
import { buildWatchlistItem } from "@/lib/utils";
import { showStatusFromEpisodes } from "@/lib/watchlist-status";
import type { SeriesDetail, WatchlistItem } from "@/lib/api";
import { t } from "@/i18n";

type Boundary = { season: number; episode: number } | null;

interface SeriesIndexProps {
  series: SeriesDetail;
  item?: WatchlistItem | null;
  user?: { username: string; avatar?: string } | null;
}

function statusKindOf(status?: string): "returning" | "ended" | "planned" {
  if (/return|continu/i.test(status ?? "")) return "returning";
  if (/end|cancel/i.test(status ?? "")) return "ended";
  return "planned";
}

const pad2 = (n: number) => String(n).padStart(2, "0");

const nowMs = () => Date.now();

const STRIP_NUMBERED_MAX = 36;

function SeasonStrip({
  episodes,
  total,
  nextId,
}: {
  episodes: DetailEpisode[];
  total: number;
  nextId?: string | null;
}) {
  const numbered = total <= STRIP_NUMBERED_MAX;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))`,
        gap: numbered ? 4 : total > 100 ? 1 : 2,
      }}
    >
      {episodes.map((ep) => {
        const isNext = !!nextId && ep.id === nextId;
        return (
          <div
            key={ep.id}
            title={`E${ep.episode} · ${ep.title}`}
            style={{
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: ep.watched
                ? "var(--marquee-500)"
                : isNext
                  ? numbered
                    ? "rgba(228,79,47,0.18)"
                    : "rgba(228,79,47,0.55)"
                  : numbered
                    ? "transparent"
                    : "var(--border-strong)",
              border: numbered
                ? ep.watched || isNext
                  ? "1px solid var(--marquee-500)"
                  : "1px solid var(--border-strong)"
                : "none",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fontWeight: 500,
              color: ep.watched
                ? "var(--ink-50)"
                : isNext
                  ? "var(--marquee-500)"
                  : "var(--fg-subtle)",
              letterSpacing: "0.04em",
            }}
          >
            {numbered ? pad2(ep.episode) : null}
          </div>
        );
      })}
    </div>
  );
}

export function SeriesIndex({ series: s, item, user }: SeriesIndexProps) {
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
  const [hoverSeason, setHoverSeason] = React.useState<number | null>(null);
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

  return (
    <div
      style={{ background: "var(--bg)", color: "var(--fg)", minHeight: "100%" }}
    >
      <Header user={user} active="" />

      {/* HERO */}
      <section
        style={{
          position: "relative",
          marginTop: -64,
          paddingTop: 64,
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
              opacity: 0.8,
              filter: "blur(20px)",
              transform: "scale(1.12)",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.4) 55%, var(--bg) 100%)," +
              "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: 1180,
            margin: "0 auto",
            padding: "32px 48px 40px",
          }}
        >
          <DetailCrumbs current={s.name} />

          {/* Title strip */}
          <div
            style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns: "220px 1fr",
              gap: 36,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                aspectRatio: "2 / 3",
                background: "var(--ink-900)",
                overflow: "hidden",
                boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
              }}
            >
              {s.poster && (
                <img
                  src={s.poster}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>

            <div
              style={{ minWidth: 0, display: "flex", flexDirection: "column" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
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
                  fontSize: 84,
                  lineHeight: 0.92,
                  letterSpacing: "-0.012em",
                  color: "var(--fg-strong)",
                  margin: "14px 0 0",
                  fontStyle: "italic",
                }}
              >
                {s.name}
              </h1>

              <MetaInline
                style={{ marginTop: 14 }}
                color="rgba(255,255,255,0.85)"
                items={[
                  s.imdbRating ? (
                    <StarRating key="r" value={s.imdbRating} size={13} />
                  ) : null,
                  seasons.length ? t.detail.meta.seasons(seasons.length) : null,
                  totalEps ? t.detail.meta.episodes(totalEps) : null,
                  s.runtime ? t.detail.meta.avgRuntime(s.runtime) : null,
                  s.country,
                ]}
              />
              {s.description && (
                <p
                  style={{
                    margin: "18px 0 0",
                    fontFamily: "var(--font-sans)",
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.9)",
                    maxWidth: 680,
                    textWrap: "pretty",
                  }}
                >
                  {s.description}
                </p>
              )}

              {/* Action row */}
              <div
                style={{
                  marginTop: 22,
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {inWatchlist ? (
                  <HomeButton
                    variant="outlineLight"
                    size="lg"
                    onClick={toggleWatchlist}
                    disabled={watchlistBusy}
                  >
                    <BookmarkCheck /> {t.detail.actions.inYourWatchlist}
                  </HomeButton>
                ) : (
                  <HomeButton
                    variant="outlineLight"
                    size="lg"
                    onClick={toggleWatchlist}
                    disabled={watchlistBusy}
                  >
                    <Bookmark /> {t.detail.actions.addToWatchlist}
                  </HomeButton>
                )}
                <HomeIconButton variant="outlineLight" size={44}>
                  <MoreHorizontal />
                </HomeIconButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 48px 96px" }}>
        {/* PROGRESS MAP */}
        <section style={{ marginTop: 56 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 22,
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <Eyebrow color="var(--fg-subtle)">
                {t.detail.sections.progressMap}
              </Eyebrow>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 44,
                  lineHeight: 1,
                  letterSpacing: "-0.008em",
                  margin: "8px 0 0",
                }}
              >
                {t.detail.meta.episodesWatchedOf(watchedEps, totalEps)}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 14,
                    color: "var(--fg-subtle)",
                    letterSpacing: "0.06em",
                    marginLeft: 14,
                    verticalAlign: "middle",
                  }}
                >
                  {t.detail.meta.pct(
                    totalEps ? Math.round((watchedEps / totalEps) * 100) : 0,
                  )}
                </span>
              </h2>
            </div>
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Legend
                swatch="var(--marquee-500)"
                label={t.detail.legend.watched}
              />
              <Legend
                swatch="rgba(228,79,47,0.25)"
                border="var(--marquee-500)"
                label={t.detail.legend.upNext}
              />
              <Legend
                swatch="transparent"
                border="var(--border)"
                label={t.detail.legend.unwatched}
              />
            </div>
          </div>

          {seasons.length > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 14,
              }}
            >
              <SeasonSortToggle
                value={seasonOrder}
                onChange={setSeasonOrder}
              />
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              background: "var(--border)",
              border: "1px solid var(--border)",
            }}
          >
            {displaySeasons.map((season) => {
              const isOpen = openSeason === season.season;
              return (
                <div key={season.season} style={{ background: "var(--bg)" }}>
                  {/* Season row */}
                  <button
                    type="button"
                    onClick={() => setOpenSeason(isOpen ? null : season.season)}
                    onMouseEnter={() => setHoverSeason(season.season)}
                    onMouseLeave={() =>
                      setHoverSeason((prev) =>
                        prev === season.season ? null : prev,
                      )
                    }
                    style={{
                      width: "100%",
                      display: "grid",
                      gridTemplateColumns: "180px 1fr 120px 24px",
                      gap: 24,
                      alignItems: "center",
                      padding: "20px 24px",
                      background:
                        isOpen || hoverSeason === season.season
                          ? "var(--bg-elev)"
                          : "var(--bg)",
                      cursor: "pointer",
                      transition: `background 160ms ${EASE_OUT}`,
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      <Eyebrow color="var(--fg-subtle)">
                        {t.detail.meta.episodes(season.total)}
                      </Eyebrow>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 28,
                          lineHeight: 1,
                          letterSpacing: "-0.005em",
                          color: "var(--fg-strong)",
                        }}
                      >
                        {t.detail.season.label(season.season)}
                      </span>
                    </div>

                    {/* Episode strip */}
                    <SeasonStrip
                      episodes={season.episodes}
                      total={season.total}
                      nextId={next?.id}
                    />

                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 18,
                          lineHeight: 1,
                          color: "var(--fg)",
                        }}
                      >
                        {season.watched}
                        <span style={{ color: "var(--fg-subtle)" }}>
                          /{season.total}
                        </span>
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          color: "var(--fg-subtle)",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          marginTop: 4,
                        }}
                      >
                        {t.detail.meta.pctDone(
                          season.total
                            ? Math.round(
                                (season.watched / season.total) * 100,
                              )
                            : 0,
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        transition: `transform 220ms ${EASE_OUT}`,
                        transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                      }}
                    >
                      <ChevronRight
                        size={14}
                        style={{ color: "var(--fg-muted)" }}
                      />
                    </div>
                  </button>

                  {/* Expanded episode list */}
                  {isOpen && (
                    <div style={{ padding: "4px 24px 20px" }}>
                      {season.episodes.map((ep) => (
                        <EpisodeRow
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

        {/* cast/metadata */}
        <div
          style={{
            marginTop: 72,
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 56,
            alignItems: "flex-start",
          }}
        >
          {s.cast && s.cast.length > 0 ? (
            <CastGrid cast={s.cast} columns={2} />
          ) : (
            <div />
          )}
          <aside>
            <Eyebrow color="var(--fg-subtle)">
              {t.detail.sections.catalog}
            </Eyebrow>
            <div style={{ marginTop: 14 }}>
              {s.director && s.director.length > 0 && (
                <MetaRow label={t.detail.labels.creator}>
                  {s.director.join(", ")}
                </MetaRow>
              )}
              {s.writer && s.writer.length > 0 && (
                <MetaRow label={t.detail.labels.writers}>
                  {s.writer.join(", ")}
                </MetaRow>
              )}
              {genres.length > 0 && (
                <MetaRow label={t.detail.labels.genres}>
                  {genres.join(", ")}
                </MetaRow>
              )}
              {s.status && (
                <MetaRow label={t.detail.labels.status}>{s.status}</MetaRow>
              )}
              {s.released && (
                <MetaRow label={t.detail.labels.firstAired}>
                  <span style={{ fontFamily: "var(--font-mono)" }}>
                    {formatDate(s.released)}
                  </span>
                </MetaRow>
              )}
              {s.imdb_id && (
                <MetaRow label={t.detail.labels.imdb}>
                  <ExternalIdLink href={imdbUrl(s.imdb_id)!}>
                    {s.imdb_id}
                  </ExternalIdLink>
                </MetaRow>
              )}
              {s.moviedb_id != null && (
                <MetaRow label={t.detail.labels.tmdb}>
                  <ExternalIdLink href={tmdbUrl(s.moviedb_id, "tv")!}>
                    {s.moviedb_id}
                  </ExternalIdLink>
                </MetaRow>
              )}
              {s.tvdb_id != null && (
                <MetaRow label={t.detail.labels.tvdb}>
                  <ExternalIdLink href={tvdbUrl(s.tvdb_id)!}>
                    {s.tvdb_id}
                  </ExternalIdLink>
                </MetaRow>
              )}
              {s.awards && (
                <MetaRow label={t.detail.labels.awards}>
                  <span style={{ color: "var(--fg-muted)", fontSize: 12.5 }}>
                    {s.awards}
                  </span>
                </MetaRow>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
