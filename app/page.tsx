"use client";

import { HomeSignedIn } from "@/components/home/home-signed-in";
import { HomeColdOpen } from "@/components/home/home-cold-open";
import { useAuthStore } from "@/lib/store";

export default function Home() {
  const isAuthenticated = useAuthStore((s) => s.token !== null);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  if (!hasHydrated) return null;

  return isAuthenticated ? <HomeSignedIn /> : <HomeColdOpen />;
}
