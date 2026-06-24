import { ChevronDown, SlidersHorizontal, Trash2, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HomeButton, HomeIconButton } from "@/components/home/home-button";
import { cn } from "@/lib/utils";
import { STATUS_META, STATUS_ORDER } from "@/lib/watchlist-status";
import type { WatchlistStatus } from "@/lib/api";

export function BulkBar({
  count,
  onChangeStatus,
  onRemove,
  onClear,
}: {
  count: number;
  onChangeStatus: (status: WatchlistStatus) => void;
  onRemove: () => void;
  onClear: () => void;
}) {
  if (!count) return null;
  return (
    <div className="fixed bottom-22 left-1/2 z-150 flex -translate-x-1/2 items-center gap-1.5 border border-white/20 bg-card p-2 shadow-lg md:bottom-7">
      <div className="flex items-center gap-2.5 py-0 pr-3 pl-2">
        <span className="bg-marquee px-2 py-1 font-mono text-xs leading-none font-medium text-neutral-950">
          {count}
        </span>
        <span className="text-[13px] text-muted-foreground">selected</span>
      </div>
      <div className="h-6 w-px bg-border" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <HomeButton variant="ghost" size="sm">
            <SlidersHorizontal /> Set status <ChevronDown />
          </HomeButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" className="w-52">
          <DropdownMenuLabel>Move selection to</DropdownMenuLabel>
          {STATUS_ORDER.map((s) => {
            const meta = STATUS_META[s];
            return (
              <DropdownMenuItem key={s} onClick={() => onChangeStatus(s)}>
                <span
                  className={cn("size-2 shrink-0 rounded-full", meta.dot)}
                />
                {meta.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <HomeButton
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="text-[#e86a62]"
      >
        <Trash2 /> Remove
      </HomeButton>
      <div className="h-6 w-px bg-border" />
      <HomeIconButton variant="ghost" size={32} onClick={onClear}>
        <X />
      </HomeIconButton>
    </div>
  );
}
