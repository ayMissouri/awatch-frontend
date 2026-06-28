"use client";

import Image from "next/image";
import { SlidersHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import { handleFromUsername } from "@/components/profile/profile-data";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";
import { t } from "@/i18n";

export interface ProfileIdentity {
  displayName: string;
  username: string;
  avatar?: string;
  backdrop?: string;
  memberSince?: string;
}

function ProfileAvatar({
  name,
  src,
  className,
  fallbackClassName,
}: {
  name: string;
  src?: string;
  className?: string;
  fallbackClassName?: string;
}) {
  return (
    <Avatar className={cn("shrink-0 border border-[var(--border-strong)]", className)}>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback className={cn("bg-[var(--bg-subtle)] font-display text-white", fallbackClassName)}>
        {(name || "?").slice(0, 1).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

function ProfileActions({
  displayName,
  username,
}: {
  displayName: string;
  username: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <EditProfileDialog displayName={displayName} username={username} />
      <button
        type="button"
        aria-label={t.profile.preferences}
        className="inline-flex size-9 items-center justify-center border border-white/40 bg-black/30 text-white transition-colors hover:bg-black/45"
      >
        <SlidersHorizontal size={15} />
      </button>
    </div>
  );
}

function MobileProfileBanner({ user }: { user: ProfileIdentity }) {
  return (
    <div className="relative w-full bg-background">
      <div className="relative h-50 w-full overflow-hidden bg-[var(--ink-900)]">
        {user.backdrop && (
          <Image
            src={user.backdrop}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_0%,transparent_35%,var(--bg)_100%)]" />
      </div>

      <div className="relative -mt-13 flex flex-col gap-3.5 px-[18px] pb-1">
        <div className="flex items-end justify-between gap-3">
          <ProfileAvatar
            name={user.displayName}
            src={user.avatar}
            className="size-21 shadow-[0_0_0_4px_var(--bg)]"
            fallbackClassName="text-[40px]"
          />
          <EditProfileDialog
            displayName={user.displayName}
            username={user.username}
            triggerClassName="inline-flex h-9 items-center gap-2 border border-[var(--border-strong)] bg-[var(--bg-elev)] px-3.5 text-[13px] font-medium text-foreground transition-colors hover:border-white/40"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="truncate font-display text-[46px] leading-[0.92] tracking-[-0.01em] text-foreground">
            {user.displayName}
          </h1>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[10.5px] tracking-[0.05em] text-muted-foreground uppercase">
            <span className="truncate">@{handleFromUsername(user.username)}</span>
            {user.memberSince && (
              <>
                <span className="text-[var(--fg-subtle)]">·</span>
                <span className="whitespace-nowrap">
                  {t.profile.memberSince(user.memberSince)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopProfileBanner({ user }: { user: ProfileIdentity }) {
  return (
    <div className="relative h-90 w-full overflow-hidden bg-[var(--ink-900)]">
      {user.backdrop && (
        <Image
          src={user.backdrop}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,transparent_30%,rgba(0,0,0,0.5)_70%,var(--bg)_100%)]" />

      <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1280px] items-end justify-between gap-6 px-10 pb-9">
        <div className="flex min-w-0 items-end gap-6">
          <ProfileAvatar
            name={user.displayName}
            src={user.avatar}
            className="size-36 shadow-[0_0_0_5px_var(--bg)]"
            fallbackClassName="text-6xl"
          />
          <div className="flex min-w-0 flex-col gap-2.5 pb-1">
            <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-white/70 uppercase">
              {t.profile.eyebrow}
            </span>
            <h1 className="truncate font-display text-[76px] leading-[0.9] tracking-[-0.01em] text-white">
              {user.displayName}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.06em] text-white/80 uppercase">
              <span className="truncate">@{handleFromUsername(user.username)}</span>
              {user.memberSince && (
                <>
                  <span className="opacity-50">·</span>
                  <span className="whitespace-nowrap">
                    {t.profile.memberSince(user.memberSince)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="pb-1">
          <ProfileActions displayName={user.displayName} username={user.username} />
        </div>
      </div>
    </div>
  );
}

export function ProfileBanner({ user }: { user: ProfileIdentity }) {
  const isMobile = useIsMobile();
  return isMobile ? (
    <MobileProfileBanner user={user} />
  ) : (
    <DesktopProfileBanner user={user} />
  );
}
