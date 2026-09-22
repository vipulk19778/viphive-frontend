import { createFileRoute, redirect } from "@tanstack/react-router";

import { UserLayout } from "@/components/layouts/UserLayout";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    const { user, token } = useAuthStore.getState();
    const isAuthenticated = Boolean(user && token);

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },

  component: UserLayout,
});
