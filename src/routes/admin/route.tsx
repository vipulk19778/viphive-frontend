import { createFileRoute, redirect } from "@tanstack/react-router";

import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState();

    if (!isAuthenticated) {
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
