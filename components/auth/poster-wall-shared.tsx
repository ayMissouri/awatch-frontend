/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { HomeButton } from "@/components/home/home-button";
import { useDiscoverAll } from "@/hooks/use-discover";
import { imageUrl } from "@/lib/utils";
import { t } from "@/i18n";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const SHADOW_LG =
  "0 24px 48px -12px rgb(0 0 0 / 0.7), 0 4px 8px -4px rgb(0 0 0 / 0.4)";

export function Wordmark({ size = 20 }: { size?: number }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        letterSpacing: "-0.025em",
        fontSize: size,
        color: "var(--fg-strong)",
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "baseline",
      }}
    >
      awatch<span style={{ color: "var(--marquee-500)" }}>.</span>fun
    </span>
  );
}
export function HomeWordmark({ size = 20 }: { size?: number }) {
  return (
    <Link
      href="/"
      aria-label={t.auth.login.wordmarkHomeLabel}
      style={{ display: "inline-flex" }}
    >
      <Wordmark size={size} />
    </Link>
  );
}

export function Eyebrow({
  children,
  color = "var(--marquee-500)",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {children}
    </span>
  );
}

export function RecDot({ size = 6 }: { size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: "var(--marquee-500)",
        display: "inline-block",
        animation: "awAuthBlink 1.6s ease-in-out infinite",
      }}
    />
  );
}

export function DiscordGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
    </svg>
  );
}

export function DiscordCTA() {
  return (
    <HomeButton
      asChild
      variant="secondary"
      size="xl"
      href={`${API_URL}/auth/login`}
      className="w-full"
    >
      <DiscordGlyph /> {t.auth.login.continueWith("Discord")}
    </HomeButton>
  );
}

export function LegalNote() {
  return (
    <span
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: 11,
        color: "var(--fg-subtle)",
      }}
    >
      {t.auth.login.legal.prefix}
      <a
        href="#"
        style={{
          color: "var(--fg-muted)",
          textDecoration: "underline",
          textUnderlineOffset: 3,
        }}
      >
        {t.auth.login.legal.terms}
      </a>
      {t.auth.login.legal.conjunction}
      <a
        href="#"
        style={{
          color: "var(--fg-muted)",
          textDecoration: "underline",
          textUnderlineOffset: 3,
        }}
      >
        {t.auth.login.legal.privacy}
      </a>
      .
    </span>
  );
}

export function PosterWallStyles() {
  return (
    <style>{`
      @keyframes awAuthBlink { 0%,100% { opacity: 1 } 50% { opacity: .35 } }
      @keyframes awPwUp { from { transform: translateY(0) } to { transform: translateY(-50%) } }
      @keyframes awPwDown { from { transform: translateY(-50%) } to { transform: translateY(0) } }
      @media (prefers-reduced-motion: reduce) { .aw-pw-track { animation: none !important } }
    `}</style>
  );
}

export function usePosterColumns(
  cols: number,
  tilesPerCol: number,
): string[][] {
  const { data: discover } = useDiscoverAll();

  return React.useMemo<string[][]>(() => {
    if (!discover) return [];
    const urls = Array.from(
      new Set(
        [
          ...discover.popular_movies,
          ...discover.popular_shows,
          ...discover.top_rated_movies,
          ...discover.top_rated_shows,
        ]
          .map((it) => imageUrl(it.poster, "w185"))
          .filter((u): u is string => !!u),
      ),
    );
    if (urls.length === 0) return [];

    let pool = urls;
    while (pool.length < cols * tilesPerCol) pool = pool.concat(urls);

    const out: string[][] = Array.from({ length: cols }, () => []);
    pool.forEach((p, i) => out[i % cols].push(p));
    return out.map((c) => c.slice(0, tilesPerCol));
  }, [discover, cols, tilesPerCol]);
}

export function PosterColumn({
  posters,
  up,
  duration,
  gap,
}: {
  posters: string[];
  up: boolean;
  duration: number;
  gap: number;
}) {
  const loop = [...posters, ...posters];
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        className="aw-pw-track"
        style={{
          display: "flex",
          flexDirection: "column",
          animation: `${up ? "awPwUp" : "awPwDown"} ${duration}s linear infinite`,
          willChange: "transform",
        }}
      >
        {loop.map((src, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "2 / 3",
              marginBottom: gap,
              background: "var(--ink-900)",
              border: "1px solid var(--border)",
              overflow: "hidden",
            }}
          >
            <img
              src={src}
              alt=""
              draggable={false}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
