import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },

  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
