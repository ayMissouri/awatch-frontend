"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { authApi } from "@/lib/api";

function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      router.replace("/");
      return;
    }

    useAuthStore.setState({ token });
    authApi
      .me()
      .then((user) => {
        setAuth(token, user);
        router.replace("/");
      })
      .catch(() => {
        useAuthStore.getState().clearAuth();
        router.replace("/");
      });
  }, [router, searchParams, setAuth]);

  return null;
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <AuthCallback />
    </Suspense>
  );
}
