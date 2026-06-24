"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import {
  Bookmark,
  Calendar,
  Clock,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppearanceToggle } from "@/components/home/nav-shared";
import {
  navMenuContentClass,
  NavMenuItem,
  NavMenuLabel,
  NavMenuSeparator,
} from "@/components/home/nav-menu";
import { useAuthStore } from "@/lib/store";

interface AccountUser {
  username: string;
  avatar?: string;
}

export function AccountMenu({
  user,
  watchlistCount,
  trigger,
}: {
  user: AccountUser;
  watchlistCount?: number;
  trigger: ReactNode;
}) {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const signOut = () => {
    clearAuth();
    router.push("/");
  };

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={8}
          className={navMenuContentClass}
          style={{ width: 264 }}
        >
          {/* Identity */}
          <div className="flex items-center gap-[11px] px-2.5 pt-2 pb-3">
            <Avatar size="lg">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>
                {user.username.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-sm leading-tight font-semibold text-white">
                {user.username}
              </div>
            </div>
          </div>

          <NavMenuSeparator />

          {/* Profile/Settings are placeholders until I create them. */}
          <NavMenuItem icon={User} label="Your profile" href="/watchlist" />
          <NavMenuItem
            icon={Bookmark}
            label="Watchlist"
            href="/watchlist"
            trailing={
              watchlistCount != null ? (
                <span className="font-mono text-[10px] text-muted-foreground/80">
                  {watchlistCount}
                </span>
              ) : undefined
            }
          />
          <NavMenuItem icon={Calendar} label="Calendar" href="/calendar" />
          <NavMenuItem icon={Clock} label="Continue watching" href="/" />

          <NavMenuSeparator />

          <NavMenuLabel>Appearance</NavMenuLabel>
          <div className="px-2.5 pb-2">
            <AppearanceToggle />
          </div>
          <NavMenuItem icon={Settings} label="Settings" shortcut="⌘," />

          <NavMenuSeparator />

          <NavMenuItem
            icon={LogOut}
            label="Sign out"
            danger
            onSelect={signOut}
          />
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
