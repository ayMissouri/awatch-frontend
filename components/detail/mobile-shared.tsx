/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { Check, ChevronLeft, MoreHorizontal, Play } from "lucide-react";
import { HomeIconButton } from "@/components/home/home-button";
import {
  EASE_OUT,
  Eyebrow,
  MetaInline,
  StarRating,
  type DetailEpisode,
} from "@/components/detail/shared";
import { t } from "@/i18n";

export const DPAD = 20;
export const MTOPBAR_H = 52;

export function MTopBar({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  const [solid, setSolid] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 55,
        height: MTOPBAR_H,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `0 ${DPAD - 6}px`,
        background: solid ? "rgba(10,10,10,0.8)" : "transparent",
        backdropFilter: solid ? "blur(16px)" : "none",
        WebkitBackdropFilter: solid ? "blur(16px)" : "none",
        borderBottom: solid
          ? "1px solid var(--border)"
          : "1px solid transparent",
        transition: `background 200ms ${EASE_OUT}, border-color 200ms ${EASE_OUT}`,
      }}
    >
      {!solid && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: -1,
            pointerEvents: "none",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)",
          }}
        />
      )}
      <HomeIconButton
        size={38}
        variant={solid ? "ghost" : "outlineLight"}
        onClick={onBack}
        aria-label={t.detail.topBar.goBack}
      >
        <ChevronLeft />
      </HomeIconButton>
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 15,
          fontWeight: 600,
          color: "var(--fg)",
          letterSpacing: "-0.01em",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: 200,
          opacity: solid ? 1 : 0,
          transition: "opacity 200ms",
        }}
      >
        {title}
      </span>
      <HomeIconButton
        size={38}
        variant={solid ? "ghost" : "outlineLight"}
        aria-label={t.detail.topBar.more}
      >
        <MoreHorizontal />
      </HomeIconButton>
    </div>
  );
}

export const MACTIONBAR_H = 92;
export function MActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 60,
        background: "rgba(10,10,10,0.82)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid var(--border)",
        padding: `12px ${DPAD}px calc(14px + env(safe-area-inset-bottom))`,
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>{children}</div>
    </div>
  );
}

export function MSectionHead({
  title,
  eyebrow,
  right,
  italic = false,
  divider = true,
  style,
}: {
  title: React.ReactNode;
  eyebrow?: string;
  right?: React.ReactNode;
  italic?: boolean;
  divider?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ padding: `0 ${DPAD}px`, ...style }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 12,
          paddingBottom: divider ? 12 : 0,
          borderBottom: divider ? "1px solid var(--border)" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            minWidth: 0,
          }}
        >
          {eyebrow && <Eyebrow color="var(--fg-subtle)">{eyebrow}</Eyebrow>}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              lineHeight: 1,
              letterSpacing: "-0.008em",
              color: "var(--fg-strong)",
              margin: 0,
              fontStyle: italic ? "italic" : "normal",
            }}
          >
            {title}
          </h2>
        </div>
        {right && (
          <Eyebrow
            color="var(--fg-subtle)"
            style={{ fontSize: 9, flexShrink: 0 }}
          >
            {right}
          </Eyebrow>
        )}
      </div>
    </div>
  );
}

export interface MMetaRow {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}
export function MMetaList({ rows }: { rows: MMetaRow[] }) {
  return (
    <div>
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "96px 1fr",
            gap: 14,
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
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {r.label}
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--fg)",
              lineHeight: 1.5,
            }}
          >
            {r.mono ? (
              <span style={{ fontFamily: "var(--font-mono)" }}>{r.value}</span>
            ) : (
              r.value
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

export function MCastScroll({ cast }: { cast: string[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridAutoFlow: "column",
        gridAutoColumns: "max-content",
        gap: 10,
        overflowX: "auto",
        padding: `0 ${DPAD}px 4px`,
      }}
    >
      {cast.map((name, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            width: 200,
            padding: "11px 13px",
            border: "1px solid var(--border)",
            background: "var(--bg-elev)",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 999,
              flexShrink: 0,
              background:
                "linear-gradient(135deg, var(--ink-700), var(--ink-900))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontSize: 16,
              color: "var(--fg-muted)",
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
                lineHeight: 1.25,
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
                marginTop: 3,
              }}
            >
              {t.detail.episode.cast}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MEpisodeRow({
  ep,
  isNext,
  onToggle,
}: {
  ep: DetailEpisode;
  isNext?: boolean;
  onToggle?: (ep: DetailEpisode) => void;
}) {
  const showOverview = isNext || !ep.watched;
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        padding: "16px 0",
        borderTop: "1px solid var(--border)",
        opacity: ep.watched && !isNext ? 0.6 : 1,
        borderLeft: isNext
          ? "2px solid var(--marquee-500)"
          : "2px solid transparent",
        paddingLeft: isNext ? DPAD - 2 : DPAD,
        paddingRight: DPAD,
        transition: `opacity 160ms ${EASE_OUT}`,
      }}
    >
      {/* thumbnail */}
      <div
        style={{
          width: 116,
          flexShrink: 0,
          aspectRatio: "16 / 10",
          background: "var(--ink-900)",
          overflow: "hidden",
          position: "relative",
          alignSelf: "flex-start",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontSize: 15,
            color: "var(--fg-subtle)",
            padding: 6,
            textAlign: "center",
            lineHeight: 1.05,
          }}
        >
          {ep.title}
        </div>
        {ep.thumbnail && (
          <img
            src={ep.thumbnail}
            alt=""
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            top: 5,
            left: 5,
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            fontWeight: 600,
            color: isNext ? "var(--marquee-500)" : "white",
            background: "rgba(0,0,0,0.7)",
            padding: "2px 5px",
            lineHeight: 1,
          }}
        >
          E{String(ep.episode).padStart(2, "0")}
        </div>
        {isNext && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: "var(--marquee-500)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Play size={13} style={{ color: "#fff" }} fill="#fff" />
            </div>
          </div>
        )}
      </div>
      {/* text */}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            {isNext && (
              <div style={{ marginBottom: 3 }}>
                <Eyebrow color="var(--marquee-500)" style={{ fontSize: 8.5 }}>
                  {t.detail.episode.upNext}
                </Eyebrow>
              </div>
            )}
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 19,
                lineHeight: 1.05,
                letterSpacing: "-0.005em",
                color: "var(--fg-strong)",
              }}
            >
              {ep.title}
            </div>
          </div>
          {/* watched toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.(ep);
            }}
            style={{
              width: 26,
              height: 26,
              flexShrink: 0,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: ep.watched ? "var(--marquee-500)" : "transparent",
              border: ep.watched
                ? "1px solid var(--marquee-500)"
                : "1px solid var(--border-strong)",
              cursor: "pointer",
              transition: `all 160ms ${EASE_OUT}`,
            }}
          >
            {ep.watched && <Check size={13} style={{ color: "#fff" }} />}
          </button>
        </div>
        <div style={{ marginTop: 6 }}>
          <MetaInline
            color="var(--fg-subtle)"
            items={[
              ep.runtime,
              ep.released &&
                new Date(ep.released).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                }),
              ep.imdbRating ? (
                <StarRating key="r" value={ep.imdbRating} size={10} />
              ) : null,
            ]}
          />
        </div>
        {showOverview && ep.overview && (
          <p
            style={{
              margin: "9px 0 0",
              fontFamily: "var(--font-sans)",
              fontSize: 12.5,
              lineHeight: 1.5,
              color: "var(--fg-muted)",
              textWrap: "pretty",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {ep.overview}
          </p>
        )}
      </div>
    </div>
  );
}
