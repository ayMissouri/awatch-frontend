"use client";

import { useParams } from "next/navigation";
import { Film, LoaderCircle } from "lucide-react";
import { Header } from "@/components/home/header";
import { MovieBackdrop } from "@/components/detail/movie-backdrop";
import { MovieBackdropMobile } from "@/components/detail/movie-mobile";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useMovieMeta, useWatchlistItem } from "@/hooks/use-meta";
import { useAuthStore } from "@/lib/store";
import { watchlistId } from "@/lib/utils";
import { t } from "@/i18n";

function DetailShell({
  user,
  children,
}: {
  user: { username: string; avatar?: string } | null;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header user={user} active="" />
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        {children}
      </div>
    </div>
  );
}

export default function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isMobile = useIsMobile();

  const meta = useMovieMeta(id);
  const wlId = meta.data
    ? watchlistId(meta.data.type, meta.data.moviedb_id, meta.data.imdb_id)
    : "";
  const item = useWatchlistItem(wlId);

  if (!hasHydrated || meta.isLoading || item.isLoading) {
    return (
      <DetailShell user={user}>
        <LoaderCircle
          size={26}
          className="animate-spin text-muted-foreground"
        />
      </DetailShell>
    );
  }

  if (meta.isError || !meta.data) {
    return (
      <DetailShell user={user}>
        <Film size={28} className="text-muted-foreground/60" />
        <div className="font-display text-2xl text-foreground">
          {t.detail.notFound.movieTitle}
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">
          {t.detail.notFound.description}
        </p>
      </DetailShell>
    );
  }

  return isMobile ? (
    <MovieBackdropMobile movie={meta.data} item={item.data} />
  ) : (
    <MovieBackdrop movie={meta.data} item={item.data} user={user} />
  );
}
