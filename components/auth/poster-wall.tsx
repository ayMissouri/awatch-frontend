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

const COLS = 6;
const TILES_PER_COL = 8;
const TILE_GAP = 12;

export function PosterWall() {
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
            inset: "-10% -4%",
            display: "flex",
            gap: TILE_GAP,
            alignItems: "flex-start",
            transform: "rotate(-2deg) scale(1.15)",
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
            "radial-gradient(ellipse 50% 55% at 50% 50%, #0a0a0a8c 0%, #0a0a0aeb 75%), #0a0a0a8c",
        }}
      />

      <header
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          display: "flex",
          alignItems: "center",
          padding: "0 40px",
          zIndex: 2,
        }}
      >
        <HomeWordmark size={20} />
      </header>

      <main
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            pointerEvents: "auto",
            width: "min(420px, 100%)",
            padding: "44px 40px 36px",
            background: "#0a0a0ad1",
            border: "1px solid var(--border-strong)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            gap: 28,
            boxShadow: SHADOW_LG,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Eyebrow>
              <RecDot /> Sign in
            </Eyebrow>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 48,
                lineHeight: 1.02,
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
              Continue with Discord to access your library and pick up exactly
              where you left off.
            </p>
          </div>

          <DiscordCTA />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              paddingTop: 16,
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
