"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HomeIconButton } from "@/components/home/home-button";
import { PosterCard, type HomePosterItem } from "@/components/home/poster-card";
import { t } from "@/i18n";

export function SeeAll({
  href,
  children = t.home.rails.seeAll,
}: {
  href: string;
  children?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex cursor-pointer items-center gap-1 px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      {children} <ChevronRight size={12} />
    </Link>
  );
}

export function CardRow({
  title,
  action,
  cardWidth = 360,
  children,
}: {
  title: string;
  action?: ReactNode;
  cardWidth?: number;
  children: ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth - 100), behavior: "smooth" });
  };

  return (
    <section className="mt-9 md:mt-14">
      <div className="mb-3.5 flex items-baseline justify-between md:mb-[18px]">
        <h2 className="font-display text-2xl leading-none tracking-[-0.005em] text-foreground md:text-[32px]">
          {title}
        </h2>
        <div className="flex items-center gap-1.5">
          {action}
          <HomeIconButton onClick={() => scroll(-1)} className="hidden md:flex">
            <ChevronLeft />
          </HomeIconButton>
          <HomeIconButton onClick={() => scroll(1)} className="hidden md:flex">
            <ChevronRight />
          </HomeIconButton>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="-mx-5 grid auto-cols-[86%] grid-flow-col gap-2.5 overflow-x-auto px-5 py-2 [scrollbar-width:none] md:mx-0 md:auto-cols-[var(--card-w)] md:gap-[18px] md:px-0 [&::-webkit-scrollbar]:hidden"
        style={{ "--card-w": `${cardWidth}px` } as React.CSSProperties}
      >
        {children}
      </div>
    </section>
  );
}

export function PosterRow({
  title,
  eyebrow,
  items,
  action,
  cardWidth = 160,
}: {
  title: string;
  eyebrow?: string;
  items: HomePosterItem[];
  action?: ReactNode;
  cardWidth?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth - 100), behavior: "smooth" });
  };

  return (
    <section className="mt-9 md:mt-14">
      <div className="mb-3.5 flex items-baseline justify-between md:mb-[18px]">
        <div className="flex items-baseline gap-3.5">
          {eyebrow && (
            <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              {eyebrow}
            </span>
          )}
          <h2 className="font-display text-2xl leading-none tracking-[-0.005em] text-foreground md:text-[32px]">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          {action}
          <HomeIconButton onClick={() => scroll(-1)} className="hidden md:flex">
            <ChevronLeft />
          </HomeIconButton>
          <HomeIconButton onClick={() => scroll(1)} className="hidden md:flex">
            <ChevronRight />
          </HomeIconButton>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="-mx-5 grid auto-cols-[116px] grid-flow-col gap-2.5 overflow-x-auto overflow-y-visible px-5 py-2 pb-2 [scrollbar-width:none] md:mx-0 md:auto-cols-[var(--card-w)] md:gap-4 md:px-0 [&::-webkit-scrollbar]:hidden"
        style={{ "--card-w": `${cardWidth}px` } as React.CSSProperties}
      >
        {items.map((item) => (
          <div key={item.id} className="snap-start">
            <PosterCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
