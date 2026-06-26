"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SlidersHorizontal, Trash2 } from "lucide-react";
import { t } from "@/i18n";
import { WatchlistCheckbox } from "@/components/watchlist/checkbox";
import { StatusMenu } from "@/components/watchlist/status-menu";
import { StatusPill } from "@/components/watchlist/status-pill";
import { cn, detailHref, imageUrl } from "@/lib/utils";
import { progressBarColor, progressInfo } from "@/lib/watchlist-status";
import type { WatchlistItem, WatchlistStatus } from "@/lib/api";

export function WatchlistGridCard({
  item,
  selected,
  selectMode,
  onToggleSelect,
  onChangeStatus,
  onRemove,
}: {
  item: WatchlistItem;
  selected: boolean;
  selectMode: boolean;
  onToggleSelect: (id: string) => void;
  onChangeStatus: (id: string, status: WatchlistStatus) => void;
  onRemove: (id: string) => void;
}) {
  const [hover, setHover] = useState(false);
  const prog = progressInfo(item);
  const showCheck = selectMode || selected || hover;
  const poster = imageUrl(item.poster_path, "w342");

  return (
    <div
      className="flex cursor-pointer flex-col gap-2.5"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className={cn(
          "relative aspect-2/3 w-full overflow-hidden bg-neutral-900 transition-transform duration-200",
          hover && "-translate-y-1 shadow-[0_24px_48px_-16px_rgb(0_0_0/0.45)]",
          selected
            ? "outline-2 outline-marquee -outline-offset-2"
            : "outline -outline-offset-1 outline-border",
        )}
      >
        {poster && (
          <Image
            src={poster}
            alt=""
            fill
            sizes="(max-width: 768px) 33vw, 220px"
            className="object-cover"
          />
        )}

        <div className="absolute top-2 left-2">
          <StatusPill status={item.status} size="sm" />
        </div>

        {showCheck && (
          <div className="absolute top-2 right-2">
            <WatchlistCheckbox
              checked={selected}
              onChange={() => onToggleSelect(item.id)}
              size={20}
            />
          </div>
        )}

        <div
          className={cn(
            "absolute inset-0 flex flex-col justify-end gap-2 p-2.5 transition-opacity duration-200",
            "bg-[linear-gradient(180deg,transparent_38%,rgba(0,0,0,0.94)_100%)]",
            hover ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[9px] tracking-wide text-white/70 uppercase">
                {prog.label}
              </span>
              <span className="font-mono text-[9px] text-white/50">
                {prog.pct}%
              </span>
            </div>
            <div className="h-0.5 w-full bg-white/15">
              <div
                className={cn("h-full", progressBarColor(item))}
                style={{ width: `${prog.pct}%` }}
              />
            </div>
          </div>
          <div className="flex gap-1.5">
            <StatusMenu
              status={item.status}
              onChange={(s) => onChangeStatus(item.id, s)}
              onRemove={() => onRemove(item.id)}
              align="start"
              trigger={
                <button
                  type="button"
                  className="inline-flex h-[30px] flex-1 items-center justify-center gap-1.5 bg-neutral-50 text-xs font-semibold text-neutral-950 transition-colors hover:bg-neutral-200"
                >
                  <SlidersHorizontal size={12} /> {t.watchlist.card.status}
                </button>
              }
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.id);
              }}
              title={t.watchlist.card.remove}
              className="inline-flex h-[30px] w-[30px] items-center justify-center border border-white/25 bg-black/50 transition-colors hover:border-white/40 hover:bg-black/70"
            >
              <Trash2 size={13} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        <Link
          href={detailHref(
            item.type,
            item.imdb_id || item.id,
            "from=watchlist",
          )}
          className="block truncate text-[13px] font-medium text-foreground hover:text-marquee"
        >
          {item.title}
        </Link>
        <div className="font-mono text-[9px] tracking-wide text-muted-foreground uppercase">
          {item.type === "tv"
            ? t.watchlist.mediaType.series
            : t.watchlist.mediaType.film}
        </div>
      </div>
    </div>
  );
}
