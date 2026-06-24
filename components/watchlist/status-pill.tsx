import { cn } from "@/lib/utils";
import { STATUS_META } from "@/lib/watchlist-status";
import type { WatchlistStatus } from "@/lib/api";

export function StatusPill({
  status,
  size = "md",
  className,
}: {
  status: WatchlistStatus;
  size?: "sm" | "md";
  className?: string;
}) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border font-mono whitespace-nowrap uppercase tracking-[0.1em] leading-none",
        meta.tint,
        meta.border,
        meta.text,
        size === "sm"
          ? "px-1.5 py-1 text-[9px] gap-1"
          : "px-2.5 py-1 text-[10px]",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}
