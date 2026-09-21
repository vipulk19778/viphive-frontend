import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";

export const Route = createFileRoute("/admin/users/")({
  component: UsersAdminPage,
});

function UsersAdminPage() {
  return (
    <main>
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-600">
        People
      </p>
      <h1 className="font-display mt-2 text-3xl font-bold text-slate-950 dark:text-white">
        Users
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        A clear view of the VIPHive community.
      </p>
      <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400">
          <Users className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">
          User management is ready for API data
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          The backend does not currently expose an admin users endpoint. This
          workspace is ready for it when that contract is added.
        </p>
      </div>
    </main>
  );
}
