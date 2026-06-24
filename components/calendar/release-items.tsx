"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bell, Film, Tv } from "lucide-react";
import { cn, imageUrl } from "@/lib/utils";
import { type CalendarRelease, releaseSub, releaseTag } from "./calendar-data";

export function ReleaseRow({
  r,
  reminded,
  onRemind,
  compact = false,
}: {
  r: CalendarRelease;
  reminded: boolean;
  onRemind: (id: number) => void;
  compact?: boolean;
}) {
  const router = useRouter();
  const poster = imageUrl(r.poster_path, "w185");
  const sub = releaseSub(r);
  const TypeIcon = r.media_type === "tv" ? Tv : Film;

  return (
    <div
      role={r.link ? "link" : undefined}
      onClick={() => r.link && router.push(r.link)}
      className={cn(
        "grid items-center transition-colors hover:bg-card",
        r.link && "cursor-pointer",
        compact
          ? "grid-cols-[34px_minmax(0,1fr)_auto] gap-[11px] px-1 py-2"
          : "grid-cols-[44px_minmax(0,1fr)_auto] gap-3.5 px-2 py-3",
      )}
    >
      <div
        className={cn(
          "aspect-2/3 shrink-0 overflow-hidden bg-neutral-900",
          compact ? "w-[34px]" : "w-11",
        )}
      >
        {poster && (
          <Image
            src={poster}
            alt=""
            width={compact ? 34 : 44}
            height={compact ? 51 : 66}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="min-w-0">
        <div
          className={cn(
            "truncate font-semibold tracking-[-0.01em] text-foreground",
            compact ? "text-[13px]" : "text-sm",
          )}
        >
          {r.title}
        </div>
        <div className="mt-[3px] flex items-center gap-2 font-mono text-[10px] tracking-[0.05em] whitespace-nowrap text-muted-foreground/70 uppercase">
          <span className="text-muted-foreground">{releaseTag(r)}</span>
          {sub && (
            <>
              <span>·</span>
              <span className="truncate normal-case">{sub}</span>
            </>
          )}
        </div>
        {!compact && (
          <div className="mt-1.5 flex items-center gap-[7px]">
            <TypeIcon size={11} className="text-muted-foreground/70" />
            <span className="font-mono text-[10px] tracking-[0.05em] text-muted-foreground/70 uppercase">
              {r.media_type === "tv" ? "Series" : "Movie"}
            </span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemind(r.id);
        }}
        title={reminded ? "Reminder set" : "Remind me"}
        className={cn(
          "inline-flex shrink-0 items-center justify-center border transition-colors",
          compact ? "size-[30px]" : "size-[34px]",
          reminded
            ? "border-marquee bg-marquee/10"
            : "border-border hover:border-white/30",
        )}
      >
        <Bell
          size={14}
          className={reminded ? "text-marquee" : "text-muted-foreground"}
        />
      </button>
    </div>
  );
}

export function ReleaseChip({
  r,
  dim = false,
}: {
  r: CalendarRelease;
  dim?: boolean;
}) {
  const poster = imageUrl(r.poster_path, "w92");
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-[7px] border border-border bg-card py-[3px] pr-[5px] pl-[3px]",
        dim && "opacity-45",
      )}
    >
      <div className="h-6 w-4 shrink-0 overflow-hidden bg-neutral-900">
        {poster && (
          <Image
            src={poster}
            alt=""
            width={16}
            height={24}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[11.5px] leading-[1.25] font-medium text-foreground">
          {r.title}
        </div>
        <div className="truncate font-mono text-[8.5px] tracking-[0.04em] text-muted-foreground/70 uppercase">
          {releaseTag(r)}
        </div>
      </div>
      <span
        className={cn(
          "size-[5px] shrink-0 rounded-full",
          r.media_type === "tv" ? "bg-marquee" : "bg-muted-foreground",
        )}
      />
    </div>
  );
}
