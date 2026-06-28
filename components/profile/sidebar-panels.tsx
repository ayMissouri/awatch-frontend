import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn, detailHref } from "@/lib/utils";
import { t } from "@/i18n";
import type { Genre, UpcomingItem } from "@/components/profile/profile-data";

export function SidebarPanel({
  title,
  action,
  href,
  children,
}: {
  title: string;
  action?: string;
  href?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-2xl leading-none tracking-[-0.005em] text-foreground">
          {title}
        </h3>
        {action && href && (
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {action}
            <ChevronRight size={12} />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

export function GenreBreakdown({ genres }: { genres: Genre[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      {genres.map((g, i) => (
        <div
          key={g.name}
          className="grid grid-cols-[88px_1fr_34px] items-center gap-3.5"
        >
          <span className="text-[13px] font-medium text-foreground">
            {g.name}
          </span>
          <div className="h-1.5 w-full bg-white/[0.08]">
            <div
              className={cn("h-full", i === 0 ? "bg-marquee" : "bg-muted-foreground/40")}
              style={{ width: `${g.pct}%` }}
            />
          </div>
          <span className="text-right font-mono text-xs text-muted-foreground">
            {g.count}
          </span>
        </div>
      ))}
    </div>
  );
}

export function UpcomingWeek({ items }: { items: UpcomingItem[] }) {
  return (
    <div className="flex flex-col">
      {items.map((it, i) => (
        <Link
          key={it.id}
          href={detailHref(it.type, it.id, "from=profile")}
          className={cn(
            "grid grid-cols-[40px_36px_1fr] items-center gap-3.5 py-3",
            i > 0 && "border-t border-border",
          )}
        >
          <div className="flex flex-col items-start gap-0.5">
            <span
              className={cn(
                "font-mono text-[10px] tracking-[0.06em] uppercase",
                it.today ? "text-marquee" : "text-[var(--fg-subtle)]",
              )}
            >
              {it.today ? t.profile.upcoming.today : it.dow}
            </span>
            <span
              className={cn(
                "font-mono text-xl font-medium leading-none",
                it.today ? "text-[var(--fg-strong)]" : "text-foreground",
              )}
            >
              {it.day}
            </span>
          </div>
          <div className="relative aspect-2/3 w-9 shrink-0 overflow-hidden bg-[var(--ink-900)]">
            {it.poster && (
              <Image src={it.poster} alt="" fill sizes="36px" className="object-cover" />
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="truncate text-[13px] font-medium text-foreground">
              {it.title}
            </span>
            <div className="flex min-w-0 items-baseline gap-1.5">
              <span className="shrink-0 text-[10px] font-semibold tracking-[0.05em] text-marquee uppercase">
                {it.tag}
              </span>
              <span className="truncate font-mono text-[10px] tracking-[0.03em] text-[var(--fg-subtle)]">
                {it.sub}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
