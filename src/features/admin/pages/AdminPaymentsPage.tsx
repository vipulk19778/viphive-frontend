import { useState } from "react";
import { CreditCard } from "lucide-react";

import { AdminPagination } from "@/features/admin/components/AdminPagination";
import { AdminSearch } from "@/features/admin/components/AdminSearch";
import { AdminSortableHeader } from "@/features/admin/components/AdminSortableHeader";
import { useAdminPageSize } from "@/features/admin/hooks/use-admin-page-size";
import { usePayments } from "@/features/admin/hooks/use-admin";
import { formatCurrency } from "@/utils/format-currency";

export function AdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const defaultLimit = useAdminPageSize();
  const [limit, setLimit] = useState(defaultLimit);
  const [sort, setSort] = useState("createdAt-desc");
  const { data, isPending, isError } = usePayments(page, limit, search, sort);
  if (isPending)
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        Loading payments...
      </div>
    );
  if (isError)
    return (
      <div className="rounded-2xl bg-rose-50 p-6 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
        Unable to load payments.
      </div>
    );
  return (
    <main>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            Payments
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {data.meta.total} payment records.
          </p>
        </div>
        <CreditCard className="brand-accent h-7 w-7" />
      </div>
      <div className="mt-6">
        <AdminSearch
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search payments"
        />
      </div>
      <div className="mt-7 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60">
            <tr>
              <th className="px-5 py-4">
                <AdminSortableHeader
                  label="Order"
                  sortKey="createdAt"
                  activeSort={sort}
                  onSort={(value) => {
                    setSort(value);
                    setPage(1);
                  }}
                />
              </th>
              <th className="px-5 py-4">
                <AdminSortableHeader
                  label="Payment ID"
                  sortKey="paymentId"
                  activeSort={sort}
                  onSort={(value) => {
                    setSort(value);
                    setPage(1);
                  }}
                />
              </th>
              <th className="px-5 py-4">
                <AdminSortableHeader
                  label="Amount"
                  sortKey="totalAmount"
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
                  sortKey="paymentStatus"
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
            {data.data.map((payment) => (
              <tr
                key={payment._id}
                className="border-b border-slate-100 last:border-0 dark:border-slate-800"
              >
                <td className="px-5 py-4 font-bold text-slate-950 dark:text-white">
                  #{payment._id.slice(-8)}
                </td>
                <td className="px-5 py-4 text-slate-500">
                  {payment.paymentId ?? "Not paid"}
                </td>
                <td className="px-5 py-4 font-semibold text-slate-950 dark:text-white">
                  {formatCurrency(payment.totalAmount)}
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {payment.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
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
