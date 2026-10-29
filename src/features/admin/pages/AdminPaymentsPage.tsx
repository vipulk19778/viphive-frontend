import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";

import { AdminPagination } from "@/features/admin/components/AdminPagination";
import { AdminEmptyState } from "@/features/admin/components/AdminEmptyState";
import { AdminDataTable } from "@/features/admin/components/AdminDataTable";
import { createAdminColumnHelper } from "@/features/admin/lib/admin-table";
import { useAdminPageSize } from "@/features/admin/hooks/use-admin-page-size";
import { usePayments } from "@/features/admin/hooks/use-admin";
import { formatCurrency } from "@/utils/format-currency";
import type { AdminPayment } from "@/features/admin/types/admin.types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useAdminSearchStore } from "@/stores/admin-search.store";
import { QueryError } from "@/components/common/QueryError";

const columnHelper = createAdminColumnHelper<AdminPayment>();

const columns = columnHelper.columns([
  columnHelper.accessor((payment) => payment._id, {
    id: "createdAt",
    header: "Order",
    cell: (info) => (
      <span className="font-bold text-slate-950 dark:text-white">
        #{info.getValue().slice(-8)}
      </span>
    ),
  }),
  columnHelper.accessor((payment) => payment.paymentId, {
    id: "paymentId",
    header: "Payment ID",
    cell: (info) => (
      <span className="text-slate-500">{info.getValue() ?? "Not paid"}</span>
    ),
  }),
  columnHelper.accessor("totalAmount", {
    header: "Amount",
    cell: (info) => (
      <span className="font-semibold text-slate-950 dark:text-white">
        {formatCurrency(info.getValue())}
      </span>
    ),
  }),
]);

export function AdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const search = useDebouncedValue(useAdminSearchStore((state) => state.query));
  const defaultLimit = useAdminPageSize();
  const [limit, setLimit] = useState(defaultLimit);
  const [sort, setSort] = useState("createdAt-desc");
  const { data, isPending, isError, error, refetch } = usePayments(
    page,
    limit,
    search,
    sort,
  );
  useEffect(() => {
    const timeoutId = window.setTimeout(() => setPage(1), 0);
    return () => window.clearTimeout(timeoutId);
  }, [search]);
  if (isPending)
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        Loading payments...
      </div>
    );
  if (isError)
    return (
      <QueryError
        error={error}
        fallback="Unable to load payments."
        onRetry={() => void refetch()}
      />
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
      <AdminDataTable
        data={data.data}
        columns={columns}
        sort={sort}
        onSortChange={(value) => {
          setSort(value);
          setPage(1);
        }}
        getRowId={(payment) => payment._id}
        emptyState={
          <AdminEmptyState searched={Boolean(search)} resource="payments" />
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
