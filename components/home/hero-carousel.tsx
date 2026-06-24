"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Plus, Info } from "lucide-react";
import { HomeButton, homeButtonVariants } from "@/components/home/home-button";
import { cn, detailHref } from "@/lib/utils";
import type { DiscoverItem } from "@/lib/api";

const SLIDE_DURATION = 7000;

function typeLabel(type: string) {
  return type === "movie" ? "Movie" : "Show";
}

export function HeroCarousel({ items }: { items: DiscoverItem[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div className="relative -mt-16 aspect-21/9 max-h-[640px] min-h-90 w-full overflow-hidden bg-neutral-900 pt-16 md:min-h-120 min-[1500px]:max-h-[760px]">
      {items.map((item, i) => (
        <div
          key={item.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === active ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          {(item.background ?? item.poster) && (
            <Image
              src={item.background ?? item.poster!}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,transparent_28%,rgba(0,0,0,0.35)_60%,var(--background)_100%),linear-gradient(90deg,rgba(0,0,0,0.7)_0%,transparent_55%)]" />
          {item.imdb_rating && (
            <div className="pointer-events-none absolute inset-x-0 top-16 md:top-[88px]">
              <div className="mx-auto max-w-[1440px] px-5 md:px-12">
                <div className="pointer-events-auto inline-flex items-center gap-1 bg-neutral-950 px-1.5 py-1 font-mono text-[10px] font-medium text-neutral-50">
                  <Star size={9} className="text-marquee" />
                  {item.imdb_rating}
                </div>
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-8 md:bottom-14">
            <div className="mx-auto max-w-[1440px] px-5 md:px-12">
              <div className="pointer-events-auto flex max-w-[720px] flex-col gap-3.5">
                <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-white/75 uppercase">
                  Trending now
                </span>
                <h1 className="font-display text-[44px] leading-[0.92] tracking-[-0.01em] text-white md:text-[92px]">
                  {item.title}
                </h1>
                <div className="mt-1 flex items-center gap-3.5 text-white/85">
                  <span className="font-mono text-xs tracking-wide uppercase">
                    {typeLabel(item.type)}
                  </span>
                  {item.year && (
                    <>
                      <span className="text-white/40">·</span>
                      <span className="font-mono text-xs tracking-wide uppercase">
                        {item.year}
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-2.5 flex flex-col gap-2 md:flex-row md:gap-2.5">
                  <Link
                    href={detailHref(item.type, item.id, "from=home")}
                    className={cn(
                      homeButtonVariants({ variant: "primary", size: "lg" }),
                      "w-full md:w-auto",
                    )}
                  >
                    <Info /> View details
                  </Link>
                  <HomeButton
                    variant="outlineLight"
                    size="lg"
                    className="w-full md:w-auto"
                  >
                    <Plus /> Add to watchlist
                  </HomeButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 md:bottom-5">
        <div className="mx-auto flex max-w-[1440px] justify-end px-5 md:px-12">
          <div className="pointer-events-auto flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                aria-label={`Show slide ${i + 1}`}
                onClick={() => setActive(i)}
                className={cn(
                  "h-1 w-6 cursor-pointer transition-colors",
                  i === active ? "bg-marquee" : "bg-white/25 hover:bg-white/45",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
