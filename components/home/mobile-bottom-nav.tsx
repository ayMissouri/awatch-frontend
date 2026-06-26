"use client";

import Link from "next/link";
import { Film, Bookmark, Search, User } from "lucide-react";
import { useNavUI } from "@/lib/ui-store";
import { cn } from "@/lib/utils";
import { t } from "@/i18n";

export function MobileBottomNav({ active = "home" }: { active?: string }) {
  const setDrawerOpen = useNavUI((s) => s.setDrawerOpen);

  const TABS = [
    { id: "home", icon: Film, label: t.home.nav.home, href: "/" },
    {
      id: "watchlist",
      icon: Bookmark,
      label: t.home.nav.watchlist,
      href: "/watchlist",
    },
    { id: "discover", icon: Search, label: t.home.nav.discover, href: "/discover" },
    {
      id: "you",
      icon: User,
      label: t.home.nav.you,
      onClick: () => setDrawerOpen(true),
    },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 grid h-16 grid-cols-4 border-t border-border bg-black/[0.92] backdrop-blur-md md:hidden">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === active;
        const className = cn(
          "relative flex flex-col items-center justify-center gap-1.5 transition-colors",
          isActive
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
        );
        const content = (
          <>
            {isActive && (
              <span className="absolute top-0 left-1/2 h-0.5 w-7 -translate-x-1/2 bg-marquee" />
            )}
            <Icon size={18} />
            <span className="text-[10px] font-medium tracking-[-0.005em]">
              {tab.label}
            </span>
          </>
        );
        return tab.href ? (
          <Link key={tab.id} href={tab.href} className={className}>
            {content}
          </Link>
        ) : (
          <button
            key={tab.id}
            type="button"
            onClick={tab.onClick}
            className={className}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}
