"use client";

import * as React from "react";
import {
  DiscordCTA,
  Eyebrow,
  HomeWordmark,
  LegalNote,
  PosterColumn,
  PosterWallStyles,
  RecDot,
  SHADOW_LG,
  usePosterColumns,
} from "@/components/auth/poster-wall-shared";

const COLS = 3;
const TILES_PER_COL = 8;
const TILE_GAP = 10;

export function PosterWallMobile() {
  const columns = usePosterColumns(COLS, TILES_PER_COL);

  return (
    <div
      style={{
        width: "100%",
        height: "100dvh",
        background: "var(--ink-950)",
        color: "var(--fg)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
      }}
    >
      <PosterWallStyles />

      {columns.length > 0 && (
        <div
          style={{
            position: "absolute",
            inset: "-8% -12%",
            display: "flex",
            gap: TILE_GAP,
            alignItems: "flex-start",
            transform: "rotate(-3deg) scale(1.08)",
            transformOrigin: "center",
            pointerEvents: "none",
          }}
        >
          {columns.map((col, ci) => (
            <PosterColumn
              key={ci}
              posters={col}
              up={ci % 2 === 0}
              duration={80 + (ci % 3) * 20}
              gap={TILE_GAP}
            />
          ))}
        </div>
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 55% at 50% 50%, #0a0a0a8c 0%, #0a0a0af0 75%), #0a0a0a99",
        }}
      />

      <header
        style={{
          position: "absolute",
          top: "calc(env(safe-area-inset-top, 0px) + 18px)",
          left: 22,
          right: 22,
          display: "flex",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <HomeWordmark size={17} />
      </header>

      <main
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding:
            "calc(env(safe-area-inset-top, 0px) + 72px) 22px calc(env(safe-area-inset-bottom, 0px) + 40px)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            pointerEvents: "auto",
            width: "100%",
            padding: "32px 28px 28px",
            background: "#0a0a0ad6",
            border: "1px solid var(--border-strong)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            gap: 22,
            boxShadow: SHADOW_LG,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Eyebrow>
              <RecDot /> Sign in
            </Eyebrow>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 38,
                lineHeight: 1.0,
                letterSpacing: "-0.01em",
                fontWeight: 400,
                color: "var(--fg-strong)",
                margin: 0,
              }}
            >
              Your watchlist,
              <br />
              <span style={{ fontStyle: "italic" }}>properly kept.</span>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                lineHeight: 1.55,
                color: "var(--fg-muted)",
                margin: 0,
              }}
            >
              Continue with Discord to access your library.
            </p>
          </div>

          <DiscordCTA />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              paddingTop: 14,
              borderTop: "1px solid var(--border)",
            }}
          >
            <LegalNote />
          </div>
        </div>
      </main>
    </div>
  );
}
