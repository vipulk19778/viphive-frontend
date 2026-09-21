import { Outlet } from "@tanstack/react-router";

export function UserLayout() {
  return (
    <div className="mx-auto min-h-[calc(100vh-73px)] max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Outlet />
    </div>
  );
}
