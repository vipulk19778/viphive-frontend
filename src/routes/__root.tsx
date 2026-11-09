import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";

import { AppHeader } from "@/components/common/AppHeader";

export function RootLayout() {
  const { pathname } = useLocation();
  const isAuthPage = [
    "/login",
    "/register",
    "/verify-otp",
    "/forgot-password",
    "/change-password",
    "/reset-password",
  ].includes(pathname);

  return (
    <div className="min-h-screen overflow-x-clip bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      {!isAuthPage && <AppHeader />}

      <main>
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  );
}
