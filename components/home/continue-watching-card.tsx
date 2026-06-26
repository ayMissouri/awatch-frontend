import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { ReactNode } from "react";
import { HomeButton } from "@/components/home/home-button";
import { nextEpisode } from "@/lib/watchlist-status";
import { detailHref, imageUrl } from "@/lib/utils";
import type { WatchlistItem } from "@/lib/api";
import { t } from "@/i18n";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function ProgressBar({
  watched,
  duration,
}: {
  watched: number;
  duration: number;
}) {
  const pct = Math.max(0, Math.min(100, (watched / duration) * 100));
  return (
    <div className="h-0.5 w-full bg-white/10">
      <div className="h-full bg-marquee" style={{ width: `${pct}%` }} />
    </div>
  );
}

// Continue watching/Up next rail cards
function CardFrame({
  item,
  eyebrow,
  eyebrowClassName = "text-marquee",
  subtitle,
  children,
}: {
  item: WatchlistItem;
  eyebrow: string;
  eyebrowClassName?: string;
  subtitle?: ReactNode;
  children: ReactNode;
}) {
  const poster = imageUrl(item.poster_path, "original");

  return (
    <Link
      href={detailHref(item.type, item.imdb_id || item.id, "from=home")}
      className="relative grid grid-cols-[88px_1fr] border border-border bg-card transition-colors hover:border-white/30 md:grid-cols-[140px_1fr]"
    >
      <div className="relative aspect-2/3 bg-neutral-900">
        {poster && (
          <Image
            src={poster}
            alt=""
            fill
            sizes="(max-width: 768px) 88px, 140px"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-2 p-3 px-3.5 md:p-4 md:px-[18px]">
        <span
          className={`font-mono text-[10px] font-medium tracking-[0.16em] uppercase ${eyebrowClassName}`}
        >
          {eyebrow}
        </span>
        <span className="line-clamp-2 font-display text-xl leading-tight tracking-[-0.005em] text-foreground md:text-2xl">
          {item.title}
        </span>
        {subtitle}
        <div className="mt-auto flex flex-col gap-2">{children}</div>
      </div>
    </Link>
  );
}

export function ContinueWatchingCard({ item }: { item: WatchlistItem }) {
  // Shows fill the bar by episodes watched and count episodes left; movies use
  // the watched/duration and count minutes left.
  const isTv = item.type === "tv";
  const watched = isTv ? (item.episodes_watched ?? 0) : item.progress.watched;
  const total = isTv ? (item.episodes_total ?? 0) : item.progress.duration;
  const remaining = isTv
    ? Math.max(0, total - watched)
    : Math.round((item.progress.duration - item.progress.watched) / 60);
  const remainingLabel = isTv
    ? t.home.card.episodesLeft(remaining)
    : t.home.card.minLeft(remaining);

  const subtitle =
    isTv && item.last_season_watched != null ? (
      <span className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
        S{pad(item.last_season_watched)} · E
        {pad(item.last_episode_watched ?? 0)}
      </span>
    ) : null;

  return (
    <CardFrame item={item} eyebrow={t.home.card.continueWatching} subtitle={subtitle}>
      <ProgressBar watched={watched} duration={total} />
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[9px] tracking-wide text-muted-foreground uppercase">
          {remainingLabel}
        </span>
        <HomeButton
          variant="secondary"
          size="xs"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Play /> {t.home.card.resume}
        </HomeButton>
      </div>
    </CardFrame>
  );
}

export function UpNextCard({ item }: { item: WatchlistItem }) {
  const isTv = item.type === "tv";
  const started = isTv && (item.episodes_watched ?? 0) > 0;
  const next = started ? nextEpisode(item) : null;

  const subtitle = next ? (
    <span className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
      S{pad(next.season)} · E{pad(next.episode)}
    </span>
  ) : null;

  return (
    <CardFrame
      item={item}
      eyebrow={t.home.card.upNext}
      eyebrowClassName="text-muted-foreground"
      subtitle={subtitle}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[9px] tracking-wide text-muted-foreground uppercase">
          {started ? t.home.card.nextEpisode : t.home.card.notStarted}
        </span>
        <HomeButton
          variant="secondary"
          size="xs"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Play /> {t.home.card.play}
        </HomeButton>
      </div>
    </CardFrame>
  );
}
