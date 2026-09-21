import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">VIPHive</h1>

        <p className="mt-2 text-gray-600">Welcome to your dashboard</p>
      </div>
    </main>
  );
}
