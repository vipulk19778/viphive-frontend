import { useState } from "react";
import { PackageCheck } from "lucide-react";

import { AdminPagination } from "@/features/admin/components/AdminPagination";
import { AdminSearch } from "@/features/admin/components/AdminSearch";
import { AdminSortableHeader } from "@/features/admin/components/AdminSortableHeader";
import { useAdminPageSize } from "@/features/admin/hooks/use-admin-page-size";
import {
  useAllOrders,
  useUpdateOrderStatus,
} from "@/features/orders/hooks/use-orders";
import { formatCurrency } from "@/utils/format-currency";

export function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const defaultLimit = useAdminPageSize();
  const [limit, setLimit] = useState(defaultLimit);
  const [sort, setSort] = useState("createdAt-desc");
  const { data, isPending, isError } = useAllOrders(page, limit, search, sort);
  const updateStatus = useUpdateOrderStatus();

  if (isPending)
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        Loading orders...
      </div>
    );
  if (isError)
    return (
      <div className="rounded-2xl bg-rose-50 p-6 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
        Unable to load orders.
      </div>
    );

  return (
    <main>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            Orders
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Keep every customer order moving.
          </p>
        </div>
        <PackageCheck className="brand-accent hidden h-7 w-7 sm:block" />
      </div>
      <div className="mt-6">
        <AdminSearch
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search orders"
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
                  label="Customer"
                  sortKey="customer"
                  activeSort={sort}
                  onSort={(value) => {
                    setSort(value);
                    setPage(1);
                  }}
                />
              </th>
              <th className="px-5 py-4">
                <AdminSortableHeader
                  label="Total"
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
                  sortKey="status"
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
            {data.data.map((order) => (
              <tr
                key={order._id}
                className="border-b border-slate-100 last:border-0 dark:border-slate-800"
              >
                <td className="px-5 py-4 font-bold text-slate-950 dark:text-white">
                  #{order._id.slice(-8)}
                </td>
                <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                  {order.address.fullName}
                </td>
                <td className="px-5 py-4 font-semibold text-slate-950 dark:text-white">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className="px-5 py-4">
                  <select
                    value={order.status}
                    disabled={updateStatus.isPending}
                    onChange={(event) =>
                      updateStatus.mutate({
                        orderId: order._id,
                        status: event.target.value,
                      })
                    }
                    className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
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
