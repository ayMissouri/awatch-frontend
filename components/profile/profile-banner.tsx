import Image from "next/image";
import { SlidersHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import { handleFromUsername } from "@/components/profile/profile-data";
import { t } from "@/i18n";

export interface ProfileIdentity {
  displayName: string;
  username: string;
  avatar?: string;
  backdrop?: string;
  memberSince?: string;
}

function ProfileAvatar({ name, src }: { name: string; src?: string }) {
  return (
    <Avatar className="size-24 shrink-0 border border-[var(--border-strong)] shadow-[0_0_0_5px_var(--bg)] md:size-36">
      <AvatarImage src={src} alt={name} />
      <AvatarFallback className="bg-[var(--bg-subtle)] font-display text-4xl text-white md:text-6xl">
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

export function ProfileBanner({ user }: { user: ProfileIdentity }) {
  return (
    <div className="relative h-60 w-full overflow-hidden bg-[var(--ink-900)] md:h-90">
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

      <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1280px] items-end justify-between gap-6 px-5 pb-7 md:px-10 md:pb-9">
        <div className="flex min-w-0 items-end gap-4 md:gap-6">
          <ProfileAvatar name={user.displayName} src={user.avatar} />
          <div className="flex min-w-0 flex-col gap-1.5 pb-1 md:gap-2.5">
            <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-white/70 uppercase">
              {t.profile.eyebrow}
            </span>
            <h1 className="truncate font-display text-[44px] leading-[0.9] tracking-[-0.01em] text-white md:text-[76px]">
              {user.displayName}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.06em] text-white/80 uppercase md:text-[11px]">
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
        <div className="hidden pb-1 md:block">
          <ProfileActions displayName={user.displayName} username={user.username} />
        </div>
      </div>
    </div>
  );
}
