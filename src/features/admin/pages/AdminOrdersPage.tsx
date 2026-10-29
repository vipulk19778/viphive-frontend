import { useEffect, useMemo, useState } from "react";
import { PackageCheck } from "lucide-react";

import { AdminPagination } from "@/features/admin/components/AdminPagination";
import { AdminEmptyState } from "@/features/admin/components/AdminEmptyState";
import { AdminDataTable } from "@/features/admin/components/AdminDataTable";
import { createAdminColumnHelper } from "@/features/admin/lib/admin-table";
import { useAdminPageSize } from "@/features/admin/hooks/use-admin-page-size";
import {
  useAllOrders,
  useUpdateOrderStatus,
} from "@/features/orders/hooks/use-orders";
import { formatCurrency } from "@/utils/format-currency";
import type { Order } from "@/features/orders/types/order.types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useAdminSearchStore } from "@/stores/admin-search.store";
import { QueryError } from "@/components/common/QueryError";

const columnHelper = createAdminColumnHelper<Order>();

export function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const search = useDebouncedValue(useAdminSearchStore((state) => state.query));
  const defaultLimit = useAdminPageSize();
  const [limit, setLimit] = useState(defaultLimit);
  const [sort, setSort] = useState("createdAt-desc");
  const { data, isPending, isError, error, refetch } = useAllOrders(
    page,
    limit,
    search,
    sort,
  );
  const updateStatus = useUpdateOrderStatus();
  const isUpdatingStatus = updateStatus.isPending;
  const { mutate: changeStatus } = updateStatus;

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor((order) => order._id, {
          id: "createdAt",
          header: "Order",
          cell: (info) => (
            <span className="font-bold text-slate-950 dark:text-white">
              #{info.getValue().slice(-8)}
            </span>
          ),
        }),
        columnHelper.accessor((order) => order.address.fullName, {
          id: "customer",
          header: "Customer",
          cell: (info) => (
            <span className="text-slate-600 dark:text-slate-300">
              {info.getValue()}
            </span>
          ),
        }),
        columnHelper.accessor("totalAmount", {
          header: "Total",
          cell: (info) => (
            <span className="font-semibold text-slate-950 dark:text-white">
              {formatCurrency(info.getValue())}
            </span>
          ),
        }),
        columnHelper.accessor("status", {
          header: "Status",
          cell: (info) => (
            <select
              value={info.getValue()}
              disabled={isUpdatingStatus}
              onChange={(event) =>
                changeStatus({
                  orderId: info.row.original._id,
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
          ),
        }),
      ]),
    [isUpdatingStatus, changeStatus],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setPage(1), 0);
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  if (isPending)
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        Loading orders...
      </div>
    );
  if (isError)
    return (
      <QueryError
        error={error}
        fallback="Unable to load orders."
        onRetry={() => void refetch()}
      />
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
      <AdminDataTable
        data={data.data}
        columns={columns}
        sort={sort}
        onSortChange={(value) => {
          setSort(value);
          setPage(1);
        }}
        getRowId={(order) => order._id}
        emptyState={
          <AdminEmptyState searched={Boolean(search)} resource="orders" />
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
