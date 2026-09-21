import { useUsers } from "@/features/admin/hooks/use-admin";

export function AdminUsersPage() {
  const { data, isPending, isError } = useUsers();
  if (isPending)
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        Loading users...
      </div>
    );
  if (isError)
    return (
      <div className="rounded-2xl bg-rose-50 p-6 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
        Unable to load users.
      </div>
    );
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
      <div className="mt-7 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60">
            <tr>
              <th className="px-5 py-4 text-slate-500">User</th>
              <th className="px-5 py-4 text-slate-500">Email</th>
              <th className="px-5 py-4 text-slate-500">Role</th>
              <th className="px-5 py-4 text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr
                key={user._id}
                className="border-b border-slate-100 last:border-0 dark:border-slate-800"
              >
                <td className="px-5 py-4 font-bold text-slate-950 dark:text-white">
                  {user.name}
                </td>
                <td className="px-5 py-4 text-slate-500">{user.email}</td>
                <td className="px-5 py-4 capitalize text-slate-500">
                  {user.role ?? "user"}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${user.verified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {user.verified ? "Verified" : "Unverified"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
