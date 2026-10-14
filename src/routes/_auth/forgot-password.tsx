import { createFileRoute, redirect } from "@tanstack/react-router";

import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/_auth/forgot-password")({
  beforeLoad: () => {
    const { user, accessToken, refreshToken } = useAuthStore.getState();

    if (user && accessToken && refreshToken) {
      throw redirect({ to: "/" });
    }
  },
  component: ForgotPasswordPage,
});
