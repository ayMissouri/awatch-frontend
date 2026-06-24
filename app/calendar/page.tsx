"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/home/header";
import { MobileBottomNav } from "@/components/home/mobile-bottom-nav";
import { CalendarDesktop } from "@/components/calendar/calendar-desktop";
import { CalendarMobile } from "@/components/calendar/calendar-mobile";
import {
  type CalendarRelease,
  toRelease,
} from "@/components/calendar/calendar-data";
import { useCalendar, useRefreshCalendar } from "@/hooks/use-calendar";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useAuthStore } from "@/lib/store";

export default function CalendarPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.token !== null);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isMobile = useIsMobile();

  const { data, isLoading } = useCalendar();
  const refresh = useRefreshCalendar();

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) router.replace("/");
  }, [hasHydrated, isAuthenticated, router]);

  const releases = useMemo<CalendarRelease[]>(
    () =>
      (data?.items ?? [])
        .map(toRelease)
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
    [data],
  );

  if (!hasHydrated || !isAuthenticated) return null;

  const variantProps = {
    releases,
    isLoading,
    onRefresh: () => refresh.mutate(),
    refreshing: refresh.isPending,
  };

  return (
    <div className="min-h-full bg-background pb-24 text-foreground md:pb-0">
      <Header user={user} active="calendar" />
      {isMobile ? (
        <CalendarMobile {...variantProps} />
      ) : (
        <CalendarDesktop {...variantProps} />
      )}
      <MobileBottomNav active="watchlist" />
    </div>
  );
}
