import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <main className="p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

        <p className="mt-1 text-gray-600">Manage VIPHive from here.</p>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="mt-2 text-2xl font-bold">—</p>
        </div>

        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="mt-2 text-2xl font-bold">—</p>
        </div>

        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="mt-2 text-2xl font-bold">—</p>
        </div>

        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="mt-2 text-2xl font-bold">—</p>
        </div>
      </section>
    </main>
  );
}
