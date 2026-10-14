import { createFileRoute, redirect } from "@tanstack/react-router";

import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/_auth/register")({
  beforeLoad: () => {
    const { user, accessToken, refreshToken } = useAuthStore.getState();

    if (user && accessToken && refreshToken) {
      throw redirect({ to: "/" });
    }
  },
  component: RegisterPage,
});
