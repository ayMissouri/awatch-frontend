/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { Check, Play, Star } from "lucide-react";
import type { Episode } from "@/lib/api";
import { t } from "@/i18n";

export const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

export type DetailEpisode = Episode & { watched: boolean; runtime?: string };

export function isEpisodeUnaired(ep: DetailEpisode): boolean {
  if (ep.released) {
    const releasedAt = new Date(ep.released).getTime();
    return Number.isNaN(releasedAt) || releasedAt > Date.now();
  }
  return !ep.thumbnail && !ep.overview;
}

export function isEpisodeTBA(ep: DetailEpisode): boolean {
  return isEpisodeUnaired(ep) && !ep.thumbnail && !ep.overview;
}

export interface SeasonGroup {
  season: number;
  episodes: DetailEpisode[];
  total: number;
  watched: number;
}

export function Eyebrow({
  children,
  color = "var(--fg-subtle)",
  style,
}: {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: "0.10em",
        textTransform: "uppercase",
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function StarRating({
  value,
  size = 13,
}: {
  value: string;
  size?: number;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontFamily: "var(--font-mono)",
        fontSize: size,
        letterSpacing: "0.02em",
      }}
    >
      <Star
        size={Math.round(size * 0.92)}
        style={{ color: "var(--marquee-500)" }}
        fill="var(--marquee-500)"
      />
      {value}
    </span>
  );
}

export function DetailProgressBar({
  value,
  max,
}: {
  value: number;
  max: number;
}) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div
      style={{ height: 3, width: "100%", background: "var(--border-strong)" }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: "var(--marquee-500)",
        }}
      />
    </div>
  );
}

export function MetaInline({
  items,
  color = "var(--fg-muted)",
  sep = "·",
  style,
}: {
  items: React.ReactNode[];
  color?: string;
  sep?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
        color,
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        ...style,
      }}
    >
      {items.filter(Boolean).map((it, i) => {
        const numeric = typeof it === "string" && /^\d/.test(it);
        return (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ opacity: 0.5 }}>{sep}</span>}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: numeric ? "var(--font-mono)" : "inherit",
                letterSpacing: numeric ? "0.02em" : 0,
              }}
            >
              {it}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function MetaRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "110px 1fr",
        gap: 16,
        padding: "12px 0",
        borderBottom: "1px solid var(--border)",
        alignItems: "baseline",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          fontWeight: 500,
          color: "var(--fg-subtle)",
          letterSpacing: "0.10em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: "var(--fg)",
          lineHeight: 1.5,
        }}
      >
        {children}
      </span>
    </div>
  );
}

// status pill
type StatusKind = "watching" | "watched" | "planned" | "ended" | "returning";

const STATUS_PALETTES: Record<
  StatusKind,
  { bg: string; bd: string; fg: string }
> = {
  watching: {
    bg: "rgba(228, 79, 47, 0.10)",
    bd: "rgba(228, 79, 47, 0.35)",
    fg: "var(--marquee-500)",
  },
  watched: {
    bg: "rgba(34, 139, 87, 0.10)",
    bd: "rgba(34, 139, 87, 0.32)",
    fg: "#7ec19a",
  },
  planned: {
    bg: "rgba(255,255,255,0.04)",
    bd: "var(--border)",
    fg: "var(--fg-muted)",
  },
  ended: {
    bg: "rgba(255,255,255,0.04)",
    bd: "var(--border)",
    fg: "var(--fg-muted)",
  },
  returning: {
    bg: "rgba(228, 79, 47, 0.08)",
    bd: "rgba(228, 79, 47, 0.30)",
    fg: "var(--marquee-500)",
  },
};

export function StatusPill({
  kind,
  children,
  style,
}: {
  kind: StatusKind;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const p = STATUS_PALETTES[kind] ?? STATUS_PALETTES.planned;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.10em",
        textTransform: "uppercase",
        padding: "4px 8px",
        background: p.bg,
        border: `1px solid ${p.bd}`,
        color: p.fg,
        lineHeight: 1,
        ...style,
      }}
    >
      <span
        style={{ width: 5, height: 5, background: p.fg, borderRadius: 999 }}
      />
      {children}
    </span>
  );
}

// Cast
export function CastGrid({
  cast,
  columns = 4,
  title = t.detail.sections.cast,
}: {
  cast: string[];
  columns?: number;
  title?: string | null;
}) {
  return (
    <div>
      {title && (
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
            {title}
          </h3>
          <Eyebrow color="var(--fg-subtle)">
            {t.detail.meta.credited(cast.length)}
          </Eyebrow>
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 14,
        }}
      >
        {cast.map((name, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              border: "1px solid var(--border)",
              background: "var(--bg-elev)",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                background:
                  "linear-gradient(135deg, var(--ink-700), var(--ink-900))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontSize: 16,
                color: "var(--fg-muted)",
                flexShrink: 0,
              }}
            >
              {name
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  fontWeight: 500,
                  lineHeight: 1.3,
                  color: "var(--fg)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {name}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "var(--fg-subtle)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                {t.detail.episode.cast}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Trailer + still tiles
export function TrailerTile({
  trailer,
  big = false,
}: {
  trailer: { ytId: string; title: string };
  big?: boolean;
}) {
  const [hover, setHover] = React.useState(false);
  const thumb = `https://i.ytimg.com/vi/${trailer.ytId}/${big ? "maxresdefault" : "hqdefault"}.jpg`;
  return (
    <a
      href={`https://www.youtube.com/watch?v=${trailer.ytId}`}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        display: "block",
        aspectRatio: "16 / 9",
        background: "var(--ink-900)",
        overflow: "hidden",
        border: hover
          ? "1px solid var(--border-strong)"
          : "1px solid var(--border)",
        cursor: "pointer",
        transition: `border-color 160ms ${EASE_OUT}`,
      }}
    >
      <img
        src={thumb}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: hover ? 1 : 0.85,
          transition: "opacity 220ms",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: big ? 60 : 44,
            height: big ? 60 : 44,
            background: "rgba(0,0,0,0.65)",
            border: "1px solid rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: hover ? "scale(1.06)" : "scale(1)",
            transition: `transform 220ms ${EASE_OUT}`,
          }}
        >
          <Play size={big ? 22 : 16} style={{ color: "#fff" }} fill="#fff" />
        </div>
      </div>
      {/* <div
        style={{
          position: "absolute",
          left: 12,
          bottom: 10,
          right: 12,
          fontFamily: "var(--font-sans)",
          fontSize: big ? 14 : 12,
          fontWeight: 500,
          color: "white",
          textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {trailer.title}
      </div> */}
    </a>
  );
}

export function Still({ src, label }: { src: string; label?: string }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        aspectRatio: "16 / 9",
        background: "var(--ink-900)",
        overflow: "hidden",
        border: hover
          ? "1px solid var(--border-strong)"
          : "1px solid var(--border)",
        cursor: "pointer",
        transition: `border-color 160ms ${EASE_OUT}`,
      }}
    >
      <img
        src={src}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      {label && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "rgba(0,0,0,0.7)",
            color: "white",
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "3px 6px",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

// Episode list row
export function EpisodeRow({
  ep,
  isNext,
  onToggle,
}: {
  ep: DetailEpisode;
  isNext?: boolean;
  onToggle?: (ep: DetailEpisode) => void;
}) {
  const [hover, setHover] = React.useState(false);
  const unaired = isEpisodeUnaired(ep);
  const tba = isEpisodeTBA(ep);
  const showNext = isNext && !unaired;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "52px 220px 1fr auto",
        gap: 20,
        padding: "16px 0",
        borderTop: "1px solid var(--border)",
        alignItems: "flex-start",
        opacity: ep.watched ? 0.62 : unaired ? 0.7 : 1,
        transition: `opacity 160ms ${EASE_OUT}`,
      }}
    >
      {/* episode number */}
      <div style={{ paddingTop: 4 }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 38,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: showNext ? "var(--marquee-500)" : "var(--fg-subtle)",
            fontStyle: showNext ? "italic" : "normal",
          }}
        >
          {String(ep.episode).padStart(2, "0")}
        </span>
      </div>
      {/* thumbnail (or placeholder) */}
      <div
        style={{
          aspectRatio: "16 / 9",
          background: "var(--ink-900)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {ep.thumbnail ? (
          <img
            src={ep.thumbnail}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontSize: 20,
              color: "var(--fg-subtle)",
              padding: 8,
              textAlign: "center",
              lineHeight: 1,
            }}
          >
            {tba ? t.detail.episode.tba : ep.title}
          </div>
        )}
      </div>
      {/* title + overview */}
      <div style={{ minWidth: 0, paddingTop: 2 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            marginBottom: 4,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              lineHeight: 1.05,
              letterSpacing: "-0.005em",
              color: "var(--fg-strong)",
            }}
          >
            {ep.title}
          </span>
          {showNext && (
            <Eyebrow color="var(--marquee-500)">
              {t.detail.episode.upNext}
            </Eyebrow>
          )}
          {tba && (
            <Eyebrow color="var(--fg-subtle)">{t.detail.episode.tba}</Eyebrow>
          )}
        </div>
        <MetaInline
          color="var(--fg-subtle)"
          items={[
            ep.runtime,
            ep.released &&
              new Date(ep.released).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            ep.imdbRating ? (
              <StarRating key="r" value={ep.imdbRating} size={11} />
            ) : null,
          ]}
        />
        {ep.overview && (
          <p
            style={{
              margin: "10px 0 0",
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              lineHeight: 1.55,
              color: "var(--fg-muted)",
              maxWidth: 640,
              textWrap: "pretty",
            }}
          >
            {ep.overview}
          </p>
        )}
      </div>
      {/* watched toggle */}
      <div style={{ paddingTop: 6 }}>
        <button
          type="button"
          disabled={unaired}
          aria-label={t.detail.actions.markWatched}
          onClick={(e) => {
            e.stopPropagation();
            if (unaired) return;
            onToggle?.(ep);
          }}
          style={{
            width: 28,
            height: 28,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: ep.watched ? "var(--marquee-500)" : "transparent",
            border: ep.watched
              ? "1px solid var(--marquee-500)"
              : hover && !unaired
                ? "1px solid var(--border-strong)"
                : "1px solid var(--border)",
            transition: `all 160ms ${EASE_OUT}`,
            cursor: unaired ? "not-allowed" : "pointer",
            opacity: unaired ? 0.4 : 1,
          }}
        >
          {ep.watched && <Check size={14} style={{ color: "#fff" }} />}
        </button>
      </div>
    </div>
  );
}

// Progressmap
export function Legend({
  swatch,
  border,
  label,
}: {
  swatch: string;
  border?: string;
  label: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--fg-muted)",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 14,
          height: 14,
          background: swatch,
          border: border ? `1px solid ${border}` : "none",
        }}
      />
      {label}
    </span>
  );
}

export function isEpisodeWatched(
  ep: { season: number; episode: number },
  lastSeason?: number | null,
  lastEpisode?: number | null,
): boolean {
  if (lastSeason == null || lastEpisode == null) return false;
  if (ep.season < lastSeason) return true;
  return ep.season === lastSeason && ep.episode <= lastEpisode;
}

export function enrichEpisodes(
  videos: Episode[],
  lastSeason?: number | null,
  lastEpisode?: number | null,
): DetailEpisode[] {
  return videos.map((ep) => ({
    ...ep,
    watched: isEpisodeWatched(ep, lastSeason, lastEpisode),
  }));
}

export function groupSeasons(videos: DetailEpisode[]): SeasonGroup[] {
  const map = new Map<number, DetailEpisode[]>();
  for (const ep of videos) {
    if (!map.has(ep.season)) map.set(ep.season, []);
    map.get(ep.season)!.push(ep);
  }
  return Array.from(map.entries())
    .map(([season, eps]) => ({
      season,
      episodes: [...eps].sort((a, b) => a.episode - b.episode),
      total: eps.length,
      watched: eps.filter((e) => e.watched).length,
    }))
    .sort((a, b) => a.season - b.season);
}

export function firstUnwatched(seasons: SeasonGroup[]): DetailEpisode | null {
  for (const s of seasons) {
    for (const e of s.episodes) {
      if (!e.watched) return e;
    }
  }
  return null;
}
