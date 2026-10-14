import { createFileRoute, redirect } from "@tanstack/react-router";

import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    const { user, accessToken, refreshToken } = useAuthStore.getState();

    if (!user || !accessToken || !refreshToken) {
      throw redirect({
        to: "/login",
      });
    }

    if (user?.role !== "admin") {
      throw redirect({
        to: "/",
      });
    }
  },

  component: AdminLayout,
});
