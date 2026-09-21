import { Outlet, createRootRoute } from "@tanstack/react-router";

import { AppHeader } from "@/components/common/AppHeader";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <main>
        <Outlet />
      </main>
    </div>
  );
}
