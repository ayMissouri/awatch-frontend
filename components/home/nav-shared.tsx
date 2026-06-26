"use client";

import Image from "next/image";
import { ChevronRight, Film, Moon, Star, Sun, Tv } from "lucide-react";
import { cn, imageUrl } from "@/lib/utils";
import type { DiscoverItem } from "@/lib/api";
import { t } from "@/i18n";

export type SearchScope = "movie" | "tv";

// Rating chip
export function Rating({
  value,
  size = 11,
}: {
  value?: string;
  size?: number;
}) {
  if (!value) return null;
  return (
    <span
      className="inline-flex items-center gap-1 font-mono font-medium text-foreground"
      style={{ fontSize: size }}
    >
      <Star size={size} className="text-marquee" />
      {value}
    </span>
  );
}

export function ScopeToggle({
  scope,
  onChange,
  size = "sm",
}: {
  scope: SearchScope;
  onChange: (scope: SearchScope) => void;
  size?: "sm" | "lg";
}) {
  const options: { value: SearchScope; label: string; icon: typeof Film }[] = [
    { value: "movie", label: t.home.scope.movies, icon: Film },
    { value: "tv", label: t.home.scope.shows, icon: Tv },
  ];
  return (
    <div className="flex w-full border border-border bg-background">
      {options.map((o, i) => {
        const active = o.value === scope;
        const Icon = o.icon;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-1.5 font-medium tracking-[-0.005em] transition-colors",
              size === "lg" ? "h-9 text-[12.5px]" : "h-[30px] text-[11.5px]",
              i > 0 && "border-l border-border",
              active
                ? "bg-neutral-50 text-neutral-950"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon size={13} />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// Search result row
export function SearchResultRow({
  item,
  active = false,
  onSelect,
  onMouseEnter,
}: {
  item: DiscoverItem;
  active?: boolean;
  onSelect: () => void;
  onMouseEnter?: () => void;
}) {
  const poster = imageUrl(item.poster, "w185");
  const typeLabel = item.type === "movie" ? t.home.typeLabel.movie : t.home.typeLabel.show;
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      className={cn(
        "grid w-full grid-cols-[34px_1fr_auto] items-center gap-3 px-2.5 py-2 text-left transition-colors",
        active ? "bg-white/[0.055]" : "hover:bg-white/[0.04]",
      )}
    >
      <div className="relative h-[50px] w-[34px] shrink-0 overflow-hidden bg-neutral-900">
        {poster && (
          <Image
            src={poster}
            alt=""
            fill
            sizes="34px"
            className="object-cover"
          />
        )}
      </div>
      <div className="min-w-0">
        <div className="truncate text-[13.5px] leading-tight font-semibold text-foreground">
          {item.title}
        </div>
        <div className="mt-0.5 font-mono text-[9.5px] tracking-wide text-muted-foreground/80 uppercase">
          {typeLabel}
          {item.year ? ` · ${item.year}` : ""}
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <Rating value={item.imdb_rating} />
        {active && <ChevronRight size={14} className="text-muted-foreground" />}
      </div>
    </button>
  );
}

// Appearance toggle
export function AppearanceToggle() {
  return (
    <div className="flex w-full border border-border bg-background">
      <button
        type="button"
        disabled
        className="inline-flex flex-1 cursor-not-allowed items-center justify-center gap-1.5 py-2 text-[11.5px] font-medium text-muted-foreground/60"
      >
        <Sun size={13} /> {t.home.appearance.light}
      </button>
      <button
        type="button"
        className="inline-flex flex-1 items-center justify-center gap-1.5 border-l border-border bg-neutral-50 py-2 text-[11.5px] font-medium text-neutral-950"
      >
        <Moon size={13} /> {t.home.appearance.dark}
      </button>
    </div>
  );
}
