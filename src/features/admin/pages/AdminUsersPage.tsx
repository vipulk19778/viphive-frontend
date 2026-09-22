import { useEffect, useState } from "react";

import { AdminPagination } from "@/features/admin/components/AdminPagination";
import { AdminEmptyState } from "@/features/admin/components/AdminEmptyState";
import { AdminSortableHeader } from "@/features/admin/components/AdminSortableHeader";
import { useAdminPageSize } from "@/features/admin/hooks/use-admin-page-size";
import { useUsers } from "@/features/admin/hooks/use-admin";
import { useAdminSearchStore } from "@/stores/admin-search.store";

export function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const search = useAdminSearchStore((state) => state.query);
  const defaultLimit = useAdminPageSize();
  const [limit, setLimit] = useState(defaultLimit);
  const [sort, setSort] = useState("createdAt-desc");
  const { data, isPending, isError } = useUsers(page, limit, search, sort);
  useEffect(() => {
    const timeoutId = window.setTimeout(() => setPage(1), 0);
    return () => window.clearTimeout(timeoutId);
  }, [search]);
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
              <th className="px-5 py-4">
                <AdminSortableHeader
                  label="User"
                  sortKey="name"
                  activeSort={sort}
                  onSort={(value) => {
                    setSort(value);
                    setPage(1);
                  }}
                />
              </th>
              <th className="px-5 py-4">
                <AdminSortableHeader
                  label="Email"
                  sortKey="email"
                  activeSort={sort}
                  onSort={(value) => {
                    setSort(value);
                    setPage(1);
                  }}
                />
              </th>
              <th className="px-5 py-4">
                <AdminSortableHeader
                  label="Role"
                  sortKey="role"
                  activeSort={sort}
                  onSort={(value) => {
                    setSort(value);
                    setPage(1);
                  }}
                />
              </th>
              <th className="px-5 py-4">
                <AdminSortableHeader
                  label="Status"
                  sortKey="verified"
                  activeSort={sort}
                  onSort={(value) => {
                    setSort(value);
                    setPage(1);
                  }}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {data.data.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <AdminEmptyState
                    searched={Boolean(search)}
                    resource="users"
                  />
                </td>
              </tr>
            ) : (
              data.data.map((user) => (
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
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${user.verified ? "bg-emerald-100 text-emerald-700" : "brand-accent-soft"}`}
                    >
                      {user.verified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <AdminPagination
        page={data.meta.page}
        limit={limit}
        totalPages={data.meta.totalPages}
        onPageChange={setPage}
        onLimitChange={(value) => {
          setLimit(value);
          setPage(1);
        }}
      />
    </main>
  );
}
