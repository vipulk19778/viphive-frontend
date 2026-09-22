import { createFileRoute, redirect } from "@tanstack/react-router";

import { ChangePasswordPage } from "@/features/auth/pages/ChangePasswordPage";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/_auth/change-password")({
  beforeLoad: () => {
    const { user, token } = useAuthStore.getState();

    if (!user || !token) throw redirect({ to: "/login" });
  },
  component: ChangePasswordPage,
});
