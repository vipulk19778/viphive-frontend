import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">VIPHive</h1>

        <p className="mt-2 text-gray-600">Frontend application</p>
      </div>
    </main>
  );
}
