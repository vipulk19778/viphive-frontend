import {
  Outlet,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";

import { AppHeader } from "@/components/common/AppHeader";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isAuthPage = ["/login", "/register", "/verify-otp"].includes(pathname);

  return (
    <div className="min-h-screen overflow-x-clip bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      {!isAuthPage && <AppHeader />}

      <main>
        <Outlet />
      </main>
    </div>
  );
}
