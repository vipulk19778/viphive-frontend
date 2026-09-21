import { createFileRoute, redirect } from "@tanstack/react-router";

import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/_auth/register")({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) throw redirect({ to: "/" });
  },
  component: RegisterPage,
});