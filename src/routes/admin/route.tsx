import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

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

function AdminLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
