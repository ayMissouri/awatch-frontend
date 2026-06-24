"use client";

import { useParams } from "next/navigation";
import { LoaderCircle, Tv } from "lucide-react";
import { Header } from "@/components/home/header";
import { SeriesIndex } from "@/components/detail/series-index";
import { SeriesIndexMobile } from "@/components/detail/series-mobile";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useSeriesMeta, useWatchlistItem } from "@/hooks/use-meta";
import { useAuthStore } from "@/lib/store";
import { watchlistId } from "@/lib/utils";

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

export default function SeriesPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isMobile = useIsMobile();

  const meta = useSeriesMeta(id);
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
        <Tv size={28} className="text-muted-foreground/60" />
        <div className="font-display text-2xl text-foreground">
          Series not found
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">
          We couldn&apos;t load this title. It may not exist in the catalog.
        </p>
      </DetailShell>
    );
  }

  return isMobile ? (
    <SeriesIndexMobile series={meta.data} item={item.data} />
  ) : (
    <SeriesIndex series={meta.data} item={item.data} user={user} />
  );
}
