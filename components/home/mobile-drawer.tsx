"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog as DialogPrimitive } from "radix-ui";
import {
  Bookmark,
  Calendar,
  Film,
  LogOut,
  type LucideIcon,
  Search,
  Settings,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HomeIconButton } from "@/components/home/home-button";
import { AppearanceToggle } from "@/components/home/nav-shared";
import { useAuthStore } from "@/lib/store";
import { useNavUI } from "@/lib/ui-store";
import { cn } from "@/lib/utils";

interface DrawerUser {
  username: string;
  avatar?: string;
}

type DrawerNavItem = {
  id: string;
  icon: LucideIcon;
  label: string;
  href: string;
  count?: boolean;
};

const PRIMARY_NAV: DrawerNavItem[] = [
  { id: "home", icon: Film, label: "Home", href: "/" },
  { id: "discover", icon: Search, label: "Discover", href: "/discover" },
  {
    id: "watchlist",
    icon: Bookmark,
    label: "Watchlist",
    href: "/watchlist",
    count: true,
  },
  { id: "calendar", icon: Calendar, label: "Calendar", href: "/calendar" },
];

export function MobileDrawer({
  user,
  active = "home",
  watchlistCount,
}: {
  user: DrawerUser;
  active?: string;
  watchlistCount?: number;
}) {
  const router = useRouter();
  const open = useNavUI((s) => s.drawerOpen);
  const setOpen = useNavUI((s) => s.setDrawerOpen);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const close = () => setOpen(false);
  const signOut = () => {
    close();
    clearAuth();
    router.push("/");
  };

  const navLink = (n: DrawerNavItem) => {
    const on = n.id === active;
    const Icon = n.icon;
    return (
      <Link
        key={n.id}
        href={n.href}
        onClick={close}
        className={cn(
          "flex h-11.5 items-center gap-3.5 border-l-2 px-3 transition-colors",
          on
            ? "border-marquee bg-white/[0.05]"
            : "border-transparent hover:bg-white/[0.03]",
        )}
      >
        <Icon
          size={18}
          className={on ? "text-foreground" : "text-muted-foreground"}
        />
        <span
          className={cn(
            "flex-1 text-[14.5px] font-medium",
            on ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {n.label}
        </span>
        {n.count && watchlistCount != null && (
          <span className="font-mono text-[10.5px] text-muted-foreground/80">
            {watchlistCount}
          </span>
        )}
      </Link>
    );
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-190 bg-black/60 duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 md:hidden" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 left-0 z-190 flex w-74 max-w-[85vw] flex-col border-r border-[var(--border-strong)] bg-popover shadow-[0_24px_64px_-12px_rgba(0,0,0,0.8)] outline-none duration-200 data-open:animate-in data-open:slide-in-from-left data-closed:animate-out data-closed:slide-out-to-left md:hidden"
        >
          {/* Account header */}
          <div className="border-b border-border px-4.5 pt-5 pb-4.5">
            <div className="flex items-center justify-between">
              <DialogPrimitive.Title asChild>
                <span className="text-lg font-semibold tracking-[-0.025em] text-white select-none">
                  awatch<span className="text-marquee">.</span>fun
                </span>
              </DialogPrimitive.Title>
              <HomeIconButton
                variant="ghost"
                size={32}
                onClick={close}
                aria-label="Close menu"
              >
                <X />
              </HomeIconButton>
            </div>
            <div className="mt-4.5 flex items-center gap-[11px]">
              <Avatar size="lg">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback>
                  {user.username.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-white">
                  {user.username}
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div className="flex-1 overflow-y-auto p-2.5">
            {PRIMARY_NAV.map(navLink)}

            <div className="mx-3 my-2.5 h-px bg-border" />

            <button
              type="button"
              className="flex h-11.5 w-full items-center gap-3.5 px-3 text-left transition-colors hover:bg-white/[0.03]"
            >
              <Settings size={18} className="text-muted-foreground" />
              <span className="flex-1 text-[14.5px] font-medium text-muted-foreground">
                Settings
              </span>
            </button>
            <button
              type="button"
              onClick={signOut}
              className="flex h-11.5 w-full items-center gap-3.5 px-3 text-left transition-colors hover:bg-destructive/10"
            >
              <LogOut size={18} className="text-destructive" />
              <span className="flex-1 text-[14.5px] font-medium text-destructive">
                Sign out
              </span>
            </button>
          </div>

          {/* Appearance */}
          <div className="border-t border-border p-4">
            <div className="mb-2.5 font-mono text-[9px] tracking-[0.14em] text-muted-foreground/80 uppercase">
              Appearance
            </div>
            <AppearanceToggle />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
