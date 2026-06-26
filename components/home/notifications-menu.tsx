"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { HomeButton } from "@/components/home/home-button";
import { navMenuContentClass } from "@/components/home/nav-menu";
import {
  useNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "@/hooks/use-notifications";
import { type Notification } from "@/lib/api";
import { cn, imageUrl } from "@/lib/utils";
import { t } from "@/i18n";

// compacted time stamps: "now" / "5m" / "2h" / "3d" / "1w"
function relativeTime(ms: number): string {
  const min = Math.floor((Date.now() - ms) / 60000);
  if (min < 1) return t.home.notifications.time.now;
  if (min < 60) return t.home.notifications.time.minutes(min);
  const hr = Math.floor(min / 60);
  if (hr < 24) return t.home.notifications.time.hours(hr);
  const day = Math.floor(hr / 24);
  if (day < 7) return t.home.notifications.time.days(day);
  return t.home.notifications.time.weeks(Math.floor(day / 7));
}

export function NotificationsMenu({ trigger }: { trigger: ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data } = useNotifications();
  const markAll = useMarkAllNotificationsRead();
  const markOne = useMarkNotificationRead();

  const items = data?.items ?? [];
  const hasUnread = (data?.unread ?? 0) > 0;

  const handleClick = (n: Notification) => {
    if (!n.read) markOne.mutate(n.id);
    if (n.link) {
      setOpen(false);
      router.push(n.link);
    }
  };

  return (
    <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={8}
          className={cn(navMenuContentClass, "p-0")}
          style={{ width: 332 }}
        >
          <div className="flex items-center justify-between border-b border-border px-3.5 py-3">
            <span className="text-[13px] font-semibold text-white">
              {t.home.notifications.title}
            </span>
            <button
              type="button"
              onClick={() => markAll.mutate()}
              disabled={!hasUnread || markAll.isPending}
              className="text-[11.5px] font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-default disabled:opacity-40 disabled:hover:text-muted-foreground"
            >
              {t.home.notifications.markAllRead}
            </button>
          </div>

          {items.length === 0 ? (
            <div className="px-3.5 py-12 text-center">
              <div className="text-[12.5px] font-medium text-foreground">
                {t.home.notifications.caughtUp}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {t.home.notifications.caughtUpSub}
              </div>
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              {items.map((n, i) => {
                const poster = imageUrl(n.poster_path, "w185");
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => handleClick(n)}
                    className={cn(
                      "grid w-full grid-cols-[36px_1fr_auto] items-start gap-[11px] px-3.5 py-3 text-left transition-colors hover:bg-white/[0.04]",
                      i < items.length - 1 && "border-b border-border",
                      !n.read && "bg-marquee/[0.04]",
                    )}
                  >
                    <div className="h-[52px] w-9 shrink-0 overflow-hidden bg-neutral-900">
                      {poster && (
                        <Image
                          src={poster}
                          alt=""
                          width={36}
                          height={52}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[12.5px] leading-tight font-semibold text-foreground">
                        {n.title}
                      </div>
                      {n.body && (
                        <div className="mt-0.5 whitespace-pre-line text-xs leading-snug text-muted-foreground">
                          {n.body.replace(/\\n/g, "\n")}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="font-mono text-[9.5px] text-muted-foreground/80">
                        {relativeTime(n.created_at)}
                      </span>
                      {!n.read && (
                        <span className="size-[7px] rounded-full bg-marquee" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="p-2">
            <HomeButton variant="outline" size="sm" className="w-full">
              {t.home.notifications.seeAllActivity}
            </HomeButton>
          </div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
