"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAppSelector } from "@/store/hooks";

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-6 text-sm text-muted-foreground">
        Taking you to sign in…
      </main>
    );
  }

  return <>{children}</>;
}
