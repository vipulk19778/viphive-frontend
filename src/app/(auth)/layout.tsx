"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAppSelector } from "@/store/hooks";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const nextPath = searchParams.get("next");
  const redirectPath =
    nextPath?.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/";

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectPath);
    }
  }, [isAuthenticated, redirectPath, router]);

  if (isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background" />
    );
  }

  return <>{children}</>;
}
