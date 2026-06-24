"use client";

import Image from "next/image";
import Link from "next/link";
import { Ellipsis, Film, Tv } from "lucide-react";
import { WatchlistCheckbox } from "@/components/watchlist/checkbox";
import { StatusMenu } from "@/components/watchlist/status-menu";
import { StatusPill } from "@/components/watchlist/status-pill";
import { cn, detailHref, imageUrl } from "@/lib/utils";
import { progressBarColor, progressInfo } from "@/lib/watchlist-status";
import type { WatchlistItem, WatchlistStatus } from "@/lib/api";

export function WatchlistRow({
  item,
  selected,
  selectMode,
  onToggleSelect,
  onChangeStatus,
  onRemove,
  onOpenSheet,
}: {
  item: WatchlistItem;
  selected: boolean;
  selectMode: boolean;
  onToggleSelect: (id: string) => void;
  onChangeStatus: (id: string, status: WatchlistStatus) => void;
  onRemove: (id: string) => void;
  onOpenSheet?: (item: WatchlistItem) => void;
}) {
  const prog = progressInfo(item);
  const showCheck = selectMode || selected;
  const poster = imageUrl(item.poster_path, "w185");

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 border-b border-border px-4 py-2.5 transition-colors md:gap-4",
        selected ? "bg-marquee/5" : "hover:bg-card",
      )}
    >
      <button
        type="button"
        aria-label={`Manage ${item.title}`}
        onClick={() =>
          selectMode ? onToggleSelect(item.id) : onOpenSheet?.(item)
        }
        className="absolute inset-0 z-0 sm:hidden"
      />

      {showCheck && (
        <div className="relative z-10">
          <WatchlistCheckbox
            checked={selected}
            onChange={() => onToggleSelect(item.id)}
          />
        </div>
      )}

      <div className="h-16 w-11 shrink-0 overflow-hidden bg-neutral-900">
        {poster && (
          <Image
            src={poster}
            alt=""
            width={44}
            height={64}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <Link
          href={detailHref(
            item.type,
            item.imdb_id || item.id,
            "from=watchlist",
          )}
          className="relative z-10 block truncate text-[15px] font-semibold tracking-[-0.01em] text-foreground hover:text-marquee"
        >
          {item.title}
        </Link>
        <div className="mt-0.5 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
          {item.type === "tv" ? "Series" : "Film"}
        </div>
        <div className="mt-1.5 flex items-center gap-2 md:hidden">
          <div className="h-0.5 flex-1 bg-white/12">
            <div
              className={cn("h-full", progressBarColor(item))}
              style={{ width: `${prog.pct}%` }}
            />
          </div>
          <span className="font-mono text-[9px] whitespace-nowrap text-muted-foreground">
            {prog.label}
          </span>
        </div>
      </div>

      <div className="hidden w-16 shrink-0 items-center gap-1.5 font-mono text-[10px] tracking-wide text-muted-foreground uppercase md:flex">
        {item.type === "tv" ? <Tv size={13} /> : <Film size={13} />}
        {item.type === "tv" ? "TV" : "Movie"}
      </div>

      <div className="hidden w-36 shrink-0 flex-col gap-1.5 lg:flex">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10px] tracking-wide text-muted-foreground">
            {prog.label}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/70">
            {prog.pct}%
          </span>
        </div>
        <div className="h-0.5 w-full bg-white/12">
          <div
            className={cn("h-full", progressBarColor(item))}
            style={{ width: `${prog.pct}%` }}
          />
        </div>
      </div>

      <div className="hidden shrink-0 sm:block">
        <StatusMenu
          status={item.status}
          onChange={(s) => onChangeStatus(item.id, s)}
          onRemove={() => onRemove(item.id)}
          align="start"
          trigger={
            <button
              type="button"
              className="inline-flex cursor-pointer transition-opacity hover:opacity-80"
            >
              <StatusPill status={item.status} />
            </button>
          }
        />
      </div>

      <div className="relative z-10 hidden shrink-0 sm:block">
        <StatusMenu
          status={item.status}
          onChange={(s) => onChangeStatus(item.id, s)}
          onRemove={() => onRemove(item.id)}
        />
      </div>

      <div className="relative z-10 shrink-0 sm:hidden">
        <Ellipsis size={16} className="text-muted-foreground/60" />
      </div>
    </div>
  );
}
