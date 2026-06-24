"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PosterWall } from "@/components/auth/poster-wall";
import { PosterWallMobile } from "@/components/auth/poster-wall-mobile";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useAuthStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.token !== null);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (hasHydrated && isAuthenticated) router.replace("/");
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated || isAuthenticated) return null;

  return isMobile ? <PosterWallMobile /> : <PosterWall />;
}
