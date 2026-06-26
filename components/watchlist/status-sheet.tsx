"use client";

import Image from "next/image";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Check, Trash2 } from "lucide-react";
import { t } from "@/i18n";
import { cn } from "@/lib/utils";
import { STATUS_META, STATUS_ORDER } from "@/lib/watchlist-status";
import type { WatchlistItem, WatchlistStatus } from "@/lib/api";

export function StatusSheet({
  item,
  onOpenChange,
  onChangeStatus,
  onRemove,
}: {
  item: WatchlistItem | null;
  onOpenChange: (open: boolean) => void;
  onChangeStatus: (id: string, status: WatchlistStatus) => void;
  onRemove: (id: string) => void;
}) {
  const poster = item?.poster_path
    ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
    : undefined;

  return (
    <DialogPrimitive.Root open={!!item} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-180 bg-black/60 duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 z-180 border-t border-white/12 bg-neutral-950 px-4 pb-[max(env(safe-area-inset-bottom),20px)] pt-2 outline-none duration-200 data-open:animate-in data-open:slide-in-from-bottom-6 data-open:fade-in-0 data-closed:animate-out data-closed:slide-out-to-bottom-6 data-closed:fade-out-0"
        >
          {item && (
            <>
              <DialogPrimitive.Title className="sr-only">
                {t.watchlist.status.manage(item.title)}
              </DialogPrimitive.Title>
              <div className="mx-auto mb-3.5 h-1 w-10 rounded-full bg-white/15" />

              <div className="flex items-center gap-3 border-b border-border pb-3.5">
                <div className="h-14.5 w-10 shrink-0 overflow-hidden bg-neutral-900">
                  {poster && (
                    <Image
                      src={poster}
                      alt=""
                      width={40}
                      height={58}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-semibold text-foreground">
                    {item.title}
                  </div>
                  <div className="mt-1 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                    {item.type === "tv"
                      ? t.watchlist.mediaType.series
                      : t.watchlist.mediaType.film}
                  </div>
                </div>
              </div>

              <div className="px-1 py-2.5 font-mono text-[9px] tracking-[0.14em] text-muted-foreground/70 uppercase">
                {t.watchlist.status.setStatus}
              </div>
              <div className="flex flex-col">
                {STATUS_ORDER.map((s) => {
                  const meta = STATUS_META[s];
                  const active = s === item.status;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => onChangeStatus(item.id, s)}
                      className={cn(
                        "flex items-center gap-3 px-1 py-3.5 text-[15px] font-medium transition-colors",
                        active
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "size-2.25 shrink-0 rounded-full",
                          meta.dot,
                        )}
                      />
                      <span className="flex-1 text-left">{meta.label}</span>
                      {active && <Check size={16} />}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="mt-3 flex w-full items-center justify-center gap-2 border border-[#e7000b]/30 bg-[#e7000b]/8 py-3.5 text-sm font-semibold text-[#e86a62] transition-colors hover:bg-[#e7000b]/15"
              >
                <Trash2 size={15} /> {t.watchlist.status.removeFromWatchlist}
              </button>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
