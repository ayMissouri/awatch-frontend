import { t } from "@/i18n";
import { cn } from "@/lib/utils";
import { STATUS_META, STATUS_ORDER } from "@/lib/watchlist-status";
import type { WatchlistStatus } from "@/lib/api";

type Tab = "all" | WatchlistStatus;

export function StatusChips({
  value,
  onChange,
  counts,
}: {
  value: Tab;
  onChange: (value: Tab) => void;
  counts: Record<string, number>;
}) {
  const chips: { id: Tab; label: string; dot?: string }[] = [
    { id: "all", label: t.watchlist.filter.all },
    ...STATUS_ORDER.map((s) => ({
      id: s as Tab,
      label: STATUS_META[s].label,
      dot: STATUS_META[s].dot,
    })),
  ];

  return (
    <div
      className="flex gap-2 overflow-x-auto py-0.5 scrollbar-none"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, #000 calc(100% - 16px), transparent)",
        maskImage:
          "linear-gradient(to right, #000 calc(100% - 16px), transparent)",
      }}
    >
      {chips.map((c) => {
        const active = value === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap border px-3 py-2 text-[12.5px] font-medium transition-colors",
              active
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-muted-foreground hover:border-white/25 hover:text-foreground",
            )}
          >
            {c.dot && (
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  active ? "bg-background" : c.dot,
                )}
              />
            )}
            {c.label}
            <span className="font-mono text-[10px] opacity-70">
              {counts[c.id] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
