import { Ellipsis, Trash2 } from "lucide-react";
import { t } from "@/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HomeIconButton } from "@/components/home/home-button";
import { cn } from "@/lib/utils";
import { STATUS_META, STATUS_ORDER } from "@/lib/watchlist-status";
import type { WatchlistStatus } from "@/lib/api";
import type { ReactNode } from "react";

export function StatusMenu({
  status,
  onChange,
  onRemove,
  align = "end",
  trigger,
}: {
  status: WatchlistStatus;
  onChange: (status: WatchlistStatus) => void;
  onRemove: () => void;
  align?: "start" | "end";
  trigger?: ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <HomeIconButton variant="ghost" size={32}>
            <Ellipsis />
          </HomeIconButton>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-52">
        <DropdownMenuLabel>{t.watchlist.status.setStatus}</DropdownMenuLabel>
        {STATUS_ORDER.map((s) => {
          const meta = STATUS_META[s];
          const active = s === status;
          return (
            <DropdownMenuItem key={s} onClick={() => onChange(s)}>
              <span className={cn("size-2 shrink-0 rounded-full", meta.dot)} />
              <span className="flex-1">{meta.label}</span>
              {active && (
                <span className="text-xs text-muted-foreground">
                  {t.watchlist.status.current}
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onRemove}>
          <Trash2 /> {t.watchlist.status.removeFromList}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
