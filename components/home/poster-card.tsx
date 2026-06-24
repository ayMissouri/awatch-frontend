"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Plus } from "lucide-react";
import { HomeButton } from "@/components/home/home-button";
import { cn, detailHref } from "@/lib/utils";

export interface HomePosterItem {
  id: string;
  type: string;
  title: string;
  poster?: string;
  year?: string;
  rating?: string;
}

function typeLabel(type: string) {
  return type === "movie" ? "Movie" : "Show";
}

export function PosterCard({
  item,
  size = "md",
  from = "from=home",
}: {
  item: HomePosterItem;
  size?: "sm" | "md" | "lg";
  from?: string;
}) {
  const [hover, setHover] = useState(false);
  const titleFs =
    size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-[22px]";

  return (
    <Link
      href={detailHref(item.type, item.id, from)}
      className="flex cursor-pointer flex-col gap-2"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className={cn(
          "relative aspect-2/3 w-full overflow-hidden bg-neutral-900 transition-transform duration-200",
          hover && "-translate-y-1 shadow-[0_24px_64px_-12px_rgb(0_0_0/0.8)]",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center p-3.5 text-center font-display leading-none text-neutral-50",
            titleFs,
          )}
        >
          {item.title}
        </div>
        {item.poster && (
          <Image
            src={item.poster}
            alt=""
            fill
            sizes="(max-width: 768px) 33vw, 220px"
            className="object-cover"
          />
        )}
        {item.rating && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-neutral-950 px-1.5 py-1 font-mono text-[10px] font-medium text-neutral-50">
            <Star size={9} className="text-marquee" />
            {item.rating}
          </div>
        )}
        <div
          className={cn(
            "absolute inset-0 flex flex-col justify-end gap-2 p-3 transition-opacity duration-200",
            "bg-[linear-gradient(180deg,transparent_30%,rgba(0,0,0,0.92)_100%)]",
            hover ? "opacity-100" : "opacity-0",
          )}
        >
          <div>
            <div className="text-[13px] leading-tight font-semibold text-white">
              {item.title}
            </div>
            <div className="mt-1 font-mono text-[9px] tracking-wide text-white/70 uppercase">
              {typeLabel(item.type)}
              {item.year ? ` · ${item.year}` : ""}
            </div>
          </div>
          <HomeButton
            variant="secondary"
            size="xs"
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Plus /> Add
          </HomeButton>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 pt-0.5">
        <div className="truncate text-[12.5px] font-medium text-foreground">
          {item.title}
        </div>
        <div className="font-mono text-[9px] tracking-wide text-muted-foreground uppercase">
          {item.year}
          {item.year ? ` · ${typeLabel(item.type)}` : typeLabel(item.type)}
        </div>
      </div>
    </Link>
  );
}
