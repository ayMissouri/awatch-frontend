import Image from "next/image";
import Link from "next/link";
import { detailHref, imageUrl } from "@/lib/utils";
import type { WatchlistItem } from "@/lib/api";
import { t } from "@/i18n";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function MobileContinueCard({ item }: { item: WatchlistItem }) {
  const isTv = item.type === "tv";
  const watched = isTv ? (item.episodes_watched ?? 0) : item.progress.watched;
  const total = isTv ? (item.episodes_total ?? 0) : item.progress.duration;
  const pct = total > 0 ? Math.max(0, Math.min(100, (watched / total) * 100)) : 0;
  const remaining = isTv
    ? t.home.card.episodesLeft(Math.max(0, total - watched))
    : t.home.card.minLeft(
        Math.max(0, Math.round((item.progress.duration - item.progress.watched) / 60)),
      );
  const updated = new Date(item.last_updated).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const img = imageUrl(item.backdrop_path, "w1280") || imageUrl(item.poster_path, "w780");

  return (
    <Link
      href={detailHref(item.type, item.imdb_id || item.id, "from=profile")}
      className="block border border-border bg-[var(--bg-elev)] transition-colors hover:border-[var(--border-strong)]"
    >
      <div className="relative aspect-video overflow-hidden bg-[var(--ink-900)]">
        {img && <Image src={img} alt="" fill sizes="100vw" className="object-cover" />}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(0,0,0,0.85)_100%)]" />
        <div className="absolute inset-x-3.5 bottom-3">
          <div className="truncate text-base font-semibold text-white">{item.title}</div>
          {isTv && item.last_season_watched != null && (
            <div className="mt-0.5 font-mono text-[10px] tracking-[0.05em] text-white/80 uppercase">
              S{pad(item.last_season_watched)} · E{pad(item.last_episode_watched ?? 0)}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2.5 p-3 px-3.5">
        <div className="h-[3px] w-full bg-white/10">
          <div className="h-full bg-marquee" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.05em] text-[var(--fg-subtle)] uppercase">
          <span>{remaining}</span>
          <span>{t.profile.continue.updated(updated)}</span>
        </div>
      </div>
    </Link>
  );
}

export function MobileContinueList({ items }: { items: WatchlistItem[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      {items.map((it) => (
        <MobileContinueCard key={it.id} item={it} />
      ))}
    </div>
  );
}
