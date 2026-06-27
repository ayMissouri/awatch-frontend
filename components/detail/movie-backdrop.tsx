/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Eye,
  EyeOff,
  MoreHorizontal,
} from "lucide-react";
import { Header } from "@/components/home/header";
import { HomeButton, HomeIconButton } from "@/components/home/home-button";
import {
  useDeleteWatchlistItem,
  useUpdateWatchlistStatus,
  useUpsertWatchlistItem,
} from "@/hooks/use-watchlist";
import { buildWatchlistItem } from "@/lib/utils";
import { DetailCrumbs } from "@/components/breadcrumbs";
import {
  CastGrid,
  DetailProgressBar,
  Eyebrow,
  MetaInline,
  MetaRow,
  StarRating,
  StatusPill,
  TrailerTile,
} from "@/components/detail/shared";
import type { MovieDetail, WatchlistItem } from "@/lib/api";
import { t } from "@/i18n";

interface MovieBackdropProps {
  movie: MovieDetail;
  item?: WatchlistItem | null;
  user?: { username: string; avatar?: string } | null;
}

function formatDate(value?: string) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const LINK_LABELS: Record<string, string> = {
  imdb: t.detail.labels.imdb,
  tmdb: t.detail.labels.tmdb,
  share: t.detail.labels.share,
};

const CONTENT_MAX = 1180;

export function MovieBackdrop({ movie: m, item, user }: MovieBackdropProps) {
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
  const externalLinks = (m.links ?? []).filter((l) =>
    /^https?:\/\//i.test(l.url),
  );

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
              opacity: 0.85,
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
              "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 30%, rgba(0,0,0,0.45) 65%, var(--bg) 100%)," +
              "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, transparent 60%)",
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: CONTENT_MAX,
            margin: "0 auto",
            padding: "32px 48px 40px",
          }}
        >
          <DetailCrumbs current={m.name} />

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
            {/* Floating poster */}
            <div
              style={{
                aspectRatio: "2 / 3",
                background: "var(--ink-900)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
                overflow: "hidden",
              }}
            >
              {m.poster && (
                <img
                  src={m.poster}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>

            {/* Title block */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
                maxWidth: 780,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                  fontSize: 84,
                  lineHeight: 0.92,
                  letterSpacing: "-0.012em",
                  color: "white",
                  margin: 0,
                }}
              >
                {m.name}
              </h1>

              <MetaInline
                color="rgba(255,255,255,0.85)"
                items={[
                  m.imdbRating ? (
                    <StarRating key="r" value={m.imdbRating} size={13} />
                  ) : null,
                  m.runtime,
                  m.year,
                  genres.length ? (
                    <span
                      key="genre"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {genres.join(" · ")}
                    </span>
                  ) : null,
                  m.country,
                ]}
              />

              {m.description && (
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-sans)",
                    fontSize: 15.5,
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.86)",
                    maxWidth: 620,
                    textWrap: "pretty",
                  }}
                >
                  {m.description}
                </p>
              )}

              {/* Progress strip */}
              {hasProgress && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    maxWidth: 460,
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
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    <span>
                      {m.runtime
                        ? t.detail.meta.watchedOfRuntime(
                            watchedMin,
                            m.runtime,
                            Math.round(pct),
                          )
                        : t.detail.meta.watchedMinutes(
                            watchedMin,
                            Math.round(pct),
                          )}
                    </span>
                    <span>{t.detail.meta.minutesLeft(leftMin)}</span>
                  </div>
                </div>
              )}

              {/* Primary actions */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 6,
                  flexWrap: "wrap",
                }}
              >
                {inWatchlist ? (
                  <HomeButton
                    variant="outlineLight"
                    size="lg"
                    onClick={toggleWatchlist}
                    disabled={busy}
                  >
                    <BookmarkCheck /> {t.detail.actions.inYourWatchlist}
                  </HomeButton>
                ) : (
                  <HomeButton
                    variant="outlineLight"
                    size="lg"
                    onClick={toggleWatchlist}
                    disabled={busy}
                  >
                    <Bookmark /> {t.detail.actions.addToWatchlist}
                  </HomeButton>
                )}
                <HomeButton
                  variant="outlineLight"
                  size="lg"
                  onClick={toggleWatched}
                  disabled={busy}
                >
                  {isWatched ? (
                    <>
                      <Eye /> {t.detail.actions.watched}
                    </>
                  ) : (
                    <>
                      <EyeOff /> {t.detail.actions.markWatched}
                    </>
                  )}
                </HomeButton>
                <HomeIconButton variant="outlineLight" size={44}>
                  <MoreHorizontal />
                </HomeIconButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <div
        style={{
          maxWidth: CONTENT_MAX,
          margin: "0 auto",
          padding: "0 48px 96px",
        }}
      >
        <div
          style={{
            marginTop: 56,
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 56,
            alignItems: "flex-start",
          }}
        >
          {/* LEFT */}
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 36,
                lineHeight: 1,
                letterSpacing: "-0.005em",
                margin: 0,
              }}
            >
              {t.detail.sections.story}
            </h2>
            {m.description && (
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 15.5,
                  lineHeight: 1.65,
                  color: "var(--fg)",
                  marginTop: 18,
                  maxWidth: 680,
                  textWrap: "pretty",
                }}
              >
                {m.description}
              </p>
            )}

            {/* Cast */}
            {m.cast && m.cast.length > 0 && (
              <div style={{ marginTop: 56 }}>
                <CastGrid cast={m.cast} columns={2} />
              </div>
            )}

            {/* Trailers */}
            {trailers.length > 0 && (
              <div style={{ marginTop: 56 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    marginBottom: 14,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 28,
                      lineHeight: 1,
                      letterSpacing: "-0.005em",
                      margin: 0,
                    }}
                  >
                    {t.detail.sections.trailersAndTeasers}
                  </h3>
                  <Eyebrow color="var(--fg-subtle)">
                    {t.detail.meta.clips(trailers.length)}
                  </Eyebrow>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  {trailers.map((t) => (
                    <TrailerTile key={t.ytId} trailer={t} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside>
            <Eyebrow color="var(--fg-subtle)">
              {t.detail.sections.catalog}
            </Eyebrow>
            <div style={{ marginTop: 14 }}>
              {m.director && m.director.length > 0 && (
                <MetaRow label={t.detail.labels.director}>
                  {m.director.join(", ")}
                </MetaRow>
              )}
              {m.writer && m.writer.length > 0 && (
                <MetaRow label={t.detail.labels.writers}>
                  {m.writer.join(", ")}
                </MetaRow>
              )}
              {genres.length > 0 && (
                <MetaRow label={t.detail.labels.genre}>
                  {genres.join(", ")}
                </MetaRow>
              )}
              {m.runtime && (
                <MetaRow label={t.detail.labels.runtime}>
                  <span style={{ fontFamily: "var(--font-mono)" }}>
                    {m.runtime}
                  </span>
                </MetaRow>
              )}
              {m.released && (
                <MetaRow label={t.detail.labels.released}>
                  <span style={{ fontFamily: "var(--font-mono)" }}>
                    {formatDate(m.released)}
                  </span>
                </MetaRow>
              )}
              {m.country && (
                <MetaRow label={t.detail.labels.country}>{m.country}</MetaRow>
              )}
              {m.imdb_id && (
                <MetaRow label={t.detail.labels.imdb}>
                  <span style={{ fontFamily: "var(--font-mono)" }}>
                    {m.imdb_id}
                  </span>
                </MetaRow>
              )}
              {m.awards && (
                <MetaRow label={t.detail.labels.awards}>
                  <span style={{ color: "var(--fg-muted)", fontSize: 12.5 }}>
                    {m.awards}
                  </span>
                </MetaRow>
              )}
            </div>

            {/* Links */}
            {externalLinks.length > 0 && (
              <div style={{ marginTop: 28 }}>
                <Eyebrow color="var(--fg-subtle)">
                  {t.detail.sections.links}
                </Eyebrow>
                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {externalLinks.map((l, i) => (
                    <a
                      key={`${l.category}-${i}`}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 12px",
                        border: "1px solid var(--border)",
                        fontFamily: "var(--font-sans)",
                        fontSize: 13,
                        color: "var(--fg)",
                        cursor: "pointer",
                      }}
                    >
                      <span>{LINK_LABELS[l.category] ?? l.name}</span>
                      <ChevronRight
                        size={12}
                        style={{ color: "var(--fg-subtle)" }}
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
