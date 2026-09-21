import { createFileRoute, redirect } from "@tanstack/react-router";

import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/_auth/forgot-password")({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) throw redirect({ to: "/" });
  },
  component: ForgotPasswordPage,
});