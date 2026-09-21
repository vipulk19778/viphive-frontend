import { createFileRoute } from "@tanstack/react-router";

import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold">Profile</h1>
      <div className="mt-6 rounded-lg border bg-white p-6">
        <p className="font-medium">{user?.name}</p>
        <p className="mt-1 text-gray-600">{user?.email}</p>
      </div>
    </main>
  );
}