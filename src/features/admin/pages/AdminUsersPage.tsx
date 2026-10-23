import { useEffect, useState } from "react";

import { AdminPagination } from "@/features/admin/components/AdminPagination";
import { AdminEmptyState } from "@/features/admin/components/AdminEmptyState";
import { AdminDataTable } from "@/features/admin/components/AdminDataTable";
import { createAdminColumnHelper } from "@/features/admin/lib/admin-table";
import { useAdminPageSize } from "@/features/admin/hooks/use-admin-page-size";
import { useUsers } from "@/features/admin/hooks/use-admin";
import type { AdminUser } from "@/features/admin/types/admin.types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useAdminSearchStore } from "@/stores/admin-search.store";

const columnHelper = createAdminColumnHelper<AdminUser>();

const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "User",
    cell: (info) => (
      <span className="font-bold text-slate-950 dark:text-white">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => <span className="text-slate-500">{info.getValue()}</span>,
  }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: (info) => (
      <span className="capitalize text-slate-500">
        {info.getValue() ?? "user"}
      </span>
    ),
  }),
  columnHelper.accessor("verified", {
    header: "Status",
    cell: (info) => (
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-bold ${info.getValue() ? "bg-emerald-100 text-emerald-700" : "brand-accent-soft"}`}
      >
        {info.getValue() ? "Verified" : "Unverified"}
      </span>
    ),
  }),
]);

export function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const search = useDebouncedValue(useAdminSearchStore((state) => state.query));
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
      <AdminDataTable
        data={data.data}
        columns={columns}
        sort={sort}
        onSortChange={(value) => {
          setSort(value);
          setPage(1);
        }}
        getRowId={(user) => user._id}
        emptyState={
          <AdminEmptyState searched={Boolean(search)} resource="users" />
        }
      />
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
