"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, ChevronDown, LogIn, Search } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { HomeButton, HomeIconButton } from "@/components/home/home-button";
import { AccountMenu } from "@/components/home/account-menu";
import { NotificationsMenu } from "@/components/home/notifications-menu";
import { CommandPalette } from "@/components/home/command-palette";
import { MobileDrawer } from "@/components/home/mobile-drawer";
import { MobileSearchOverlay } from "@/components/home/mobile-search-overlay";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useNotifications } from "@/hooks/use-notifications";
import { useMe } from "@/hooks/use-profile";
import { useNavUI } from "@/lib/ui-store";
import { cn } from "@/lib/utils";
import { t } from "@/i18n";

function navItemClass(active: boolean) {
  return cn(
    "inline-flex items-center gap-1.5 border-b-[1.5px] px-3 py-2 text-[13px] font-medium transition-colors",
    active
      ? "border-marquee text-foreground"
      : "border-transparent text-muted-foreground hover:text-foreground",
  );
}

export function Header({
  user,
  active = "home",
}: {
  user?: { username: string; avatar?: string; display_name?: string } | null;
  active?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const setPaletteOpen = useNavUI((s) => s.setPaletteOpen);
  const setDrawerOpen = useNavUI((s) => s.setDrawerOpen);
  const setSearchOpen = useNavUI((s) => s.setSearchOpen);

  // Refreshes the persisted user from /auth/me (full avatar URL, display name).
  useMe();

  const { data: wl } = useWatchlist({ per_page: 1 });
  const watchlistCount = wl?.pagination.total;

  const { data: notifications } = useNotifications();
  const hasUnread = (notifications?.unread ?? 0) > 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        useNavUI.setState((s) => ({ paletteOpen: !s.paletteOpen }));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 flex h-13 items-center gap-6 px-5 transition-all duration-200 md:h-16 md:px-8",
          scrolled
            ? "border-b border-border bg-black/[0.78] backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="flex flex-1 items-center gap-8">
          <Link
            href="/"
            aria-label={t.home.header.a11y.brandHome}
            className="text-lg font-semibold tracking-[-0.025em] text-white select-none hover:text-white"
          >
            awatch<span className="text-marquee">.</span>fun
          </Link>
          <nav className="hidden gap-1 md:flex">
            <Link href="/" className={navItemClass(active === "home")}>
              {t.home.nav.home}
            </Link>
            <Link
              href="/discover"
              className={navItemClass(active === "discover")}
            >
              {t.home.nav.discover}
            </Link>
            {user && (
              <>
                <Link
                  href="/watchlist"
                  className={navItemClass(active === "watchlist")}
                >
                  {t.home.nav.watchlist}
                </Link>
                <Link
                  href="/calendar"
                  className={navItemClass(active === "calendar")}
                >
                  {t.home.nav.calendar}
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile search */}
          {user && (
            <HomeIconButton
              className="md:hidden"
              size={36}
              variant="ghost"
              onClick={() => setSearchOpen(true)}
              aria-label={t.home.header.a11y.search}
            >
              <Search />
            </HomeIconButton>
          )}

          {/* Desktop search */}
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className={cn(
              "hidden h-[34px] w-[260px] items-center gap-2.5 border border-border px-3 text-left transition-colors hover:border-white/30 md:flex",
              scrolled ? "bg-card" : "bg-black/30",
            )}
          >
            <Search size={13} className="shrink-0 text-muted-foreground/70" />
            <span className="flex-1 truncate text-[13px] text-muted-foreground/70">
              {t.home.header.searchPlaceholder}
            </span>
            <kbd className="border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              &#8984;K
            </kbd>
          </button>

          {user ? (
            <>
              {/* Notifications */}
              <NotificationsMenu
                trigger={
                  <HomeIconButton
                    size={36}
                    variant={scrolled ? "outline" : "outlineLight"}
                    className="relative"
                    aria-label={t.home.header.a11y.notifications}
                  >
                    <Bell />
                    {hasUnread && (
                      <span className="absolute top-[7px] right-[7px] size-[7px] rounded-full border-[1.5px] border-background bg-marquee" />
                    )}
                  </HomeIconButton>
                }
              />

              <button
                type="button"
                className="flex items-center outline-none transition-opacity hover:opacity-80 md:hidden"
                onClick={() => setDrawerOpen(true)}
                aria-label={t.home.header.a11y.openMenu}
              >
                <Avatar size="sm">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>
                    {user.username.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>

              <div className="hidden md:block">
                <AccountMenu
                  user={user}
                  watchlistCount={watchlistCount}
                  trigger={
                    <button
                      type="button"
                      className="flex items-center gap-1.5 pl-1 outline-none transition-opacity hover:opacity-80 data-open:opacity-90"
                      aria-label={t.home.header.a11y.accountMenu}
                    >
                      <Avatar size="sm">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback>
                          {user.username.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown
                        size={13}
                        className="text-muted-foreground"
                      />
                    </button>
                  }
                />
              </div>
            </>
          ) : (
            <>
              <Link
                href="/"
                className="hidden px-1.5 text-[13px] font-medium text-white md:inline"
              >
                {t.home.nav.browse}
              </Link>
              <HomeButton asChild variant="secondary" size="sm" href="/login">
                <LogIn /> {t.common.signIn}
              </HomeButton>
            </>
          )}
        </div>
      </header>

      <CommandPalette />
      <MobileSearchOverlay />
      {user && (
        <MobileDrawer
          user={user}
          active={active}
          watchlistCount={watchlistCount}
        />
      )}
    </>
  );
}
