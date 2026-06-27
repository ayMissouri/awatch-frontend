/* eslint-disable @next/next/no-img-element */
"use client";

import {
  DPAD,
  MACTIONBAR_H,
  MActionBar,
  MCastScroll,
  MMetaList,
  MSectionHead,
  MTOPBAR_H,
  MTopBar,
} from "@/components/detail/mobile-shared";
import {
  DetailProgressBar,
  Eyebrow,
  MetaInline,
  StarRating,
  StatusPill,
  TrailerTile,
} from "@/components/detail/shared";
import { HomeIconButton } from "@/components/home/home-button";
import {
  useDeleteWatchlistItem,
  useUpdateWatchlistStatus,
  useUpsertWatchlistItem,
} from "@/hooks/use-watchlist";
import type { MovieDetail, WatchlistItem } from "@/lib/api";
import { buildWatchlistItem } from "@/lib/utils";
import { Bookmark, BookmarkCheck, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { t } from "@/i18n";

interface MovieBackdropMobileProps {
  movie: MovieDetail;
  item?: WatchlistItem | null;
}

function formatDate(value?: string) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function MovieBackdropMobile({
  movie: m,
  item,
}: MovieBackdropMobileProps) {
  const router = useRouter();
  const genres = m.genre ?? m.genres ?? [];
  const inWatchlist = !!item;
  const progress = item?.progress;
  const hasProgress =
    !!progress && progress.duration > 0 && progress.watched > 0;
  const pct = hasProgress ? (progress.watched / progress.duration) * 100 : 0;
  const watchedMin = hasProgress ? Math.round(progress.watched / 60) : 0;
  const leftMin = hasProgress
    ? Math.round((progress.duration - progress.watched) / 60)
    : 0;
  const trailers = m.trailerStreams ?? [];

  const upsert = useUpsertWatchlistItem();
  const removeItem = useDeleteWatchlistItem();
  const updateStatus = useUpdateWatchlistStatus();
  const busy =
    upsert.isPending || removeItem.isPending || updateStatus.isPending;
  const isWatched = item?.status === "watched";

  const toggleWatchlist = () => {
    if (item) removeItem.mutate(item.id);
    else upsert.mutate(buildWatchlistItem(m, "plan_to_watch"));
  };
  const toggleWatched = () => {
    if (item)
      updateStatus.mutate({
        id: item.id,
        status: isWatched ? "plan_to_watch" : "watched",
      });
    else upsert.mutate(buildWatchlistItem(m, "watched"));
  };

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
      <MTopBar title={m.name} onBack={() => router.back()} />

      {/* HERO */}
      <section
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(420px, 64vh, 540px)",
          marginTop: -MTOPBAR_H,
          background: "var(--ink-950)",
          overflow: "hidden",
        }}
      >
        {m.background && (
          <img
            src={m.background}
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
              "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 28%, rgba(0,0,0,0.5) 62%, var(--bg) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: DPAD,
            right: DPAD,
            bottom: 22,
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
              {t.detail.eyebrow.featureFilm}
              {m.year ? ` · ${m.year}` : ""}
            </Eyebrow>
            {inWatchlist && hasProgress && (
              <StatusPill kind="watching">
                {t.detail.status.inProgress}
              </StatusPill>
            )}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 52,
              lineHeight: 0.92,
              letterSpacing: "-0.012em",
              color: "white",
              margin: 0,
              textWrap: "balance",
            }}
          >
            {m.name}
          </h1>
          <MetaInline
            color="rgba(255,255,255,0.85)"
            items={[
              m.imdbRating ? (
                <StarRating key="r" value={m.imdbRating} size={12} />
              ) : null,
              m.runtime,
              m.year,
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
          {/* progress */}
          {hasProgress && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 7,
                marginTop: 4,
              }}
            >
              <DetailProgressBar
                value={progress.watched}
                max={progress.duration}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-mono)",
                  fontSize: 9.5,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                <span>
                  {m.runtime
                    ? t.detail.meta.watchedOfRuntime(
                        watchedMin,
                        m.runtime,
                        Math.round(pct),
                      )
                    : t.detail.meta.watchedMinutes(watchedMin, Math.round(pct))}
                </span>
                <span>{t.detail.meta.minutesLeft(leftMin)}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* STORY */}
      {m.description && (
        <section style={{ padding: `8px ${DPAD}px 0` }}>
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
            {m.description}
          </p>
        </section>
      )}

      {/* META LIST */}
      <section style={{ padding: `28px ${DPAD}px 0` }}>
        <MMetaList
          rows={[
            m.director?.length
              ? { label: t.detail.labels.director, value: m.director.join(", ") }
              : null,
            m.writer?.length
              ? { label: t.detail.labels.writers, value: m.writer.join(", ") }
              : null,
            genres.length
              ? { label: t.detail.labels.genre, value: genres.join(", ") }
              : null,
            m.runtime
              ? { label: t.detail.labels.runtime, value: m.runtime, mono: true }
              : null,
            m.released
              ? {
                  label: t.detail.labels.released,
                  value: formatDate(m.released),
                  mono: true,
                }
              : null,
            m.country
              ? { label: t.detail.labels.country, value: m.country }
              : null,
            m.imdb_id
              ? { label: t.detail.labels.imdb, value: m.imdb_id, mono: true }
              : null,
            m.awards ? { label: t.detail.labels.awards, value: m.awards } : null,
          ].filter((r): r is NonNullable<typeof r> => !!r)}
        />
      </section>

      {/* CAST */}
      {m.cast && m.cast.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <MSectionHead
            title={t.detail.sections.cast}
            right={t.detail.meta.credited(m.cast.length)}
            style={{ marginBottom: 14 }}
          />
          <MCastScroll cast={m.cast} />
        </section>
      )}

      {/* TRAILERS */}
      {trailers.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <MSectionHead
            title={t.detail.sections.trailers}
            right={t.detail.meta.clips(trailers.length)}
            style={{ marginBottom: 14 }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              padding: `0 ${DPAD}px`,
            }}
          >
            {trailers.map((t) => (
              <TrailerTile key={t.ytId} trailer={t} />
            ))}
          </div>
        </section>
      )}

      <div style={{ height: 16 }} />

      {/* ACTION BAR */}
      <MActionBar>
        <HomeIconButton
          size={44}
          variant={inWatchlist ? "secondary" : "outline"}
          onClick={toggleWatchlist}
          disabled={busy}
          aria-label={
            inWatchlist
              ? t.detail.actions.removeFromWatchlist
              : t.detail.actions.addToWatchlist
          }
        >
          {inWatchlist ? <BookmarkCheck /> : <Bookmark />}
        </HomeIconButton>
        <HomeIconButton
          size={44}
          variant={isWatched ? "secondary" : "outline"}
          onClick={toggleWatched}
          disabled={busy}
          aria-label={
            isWatched
              ? t.detail.actions.markUnwatched
              : t.detail.actions.markWatched
          }
        >
          {isWatched ? <Eye /> : <EyeOff />}
        </HomeIconButton>
      </MActionBar>
    </div>
  );
}
