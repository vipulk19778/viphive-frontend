import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuthStore } from "@/stores/auth.store";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, accessToken, refreshToken } = useAuthStore();

  if (!user || !accessToken || !refreshToken) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
