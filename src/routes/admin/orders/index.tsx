import { createFileRoute } from "@tanstack/react-router";
import { PackageCheck } from "lucide-react";

import {
  useAllOrders,
  useUpdateOrderStatus,
} from "@/features/orders/hooks/use-orders";

export const Route = createFileRoute("/admin/orders/")({
  component: AdminOrdersPage,
});

function AdminOrdersPage() {
  const { data, isPending, isError } = useAllOrders();
  const updateStatus = useUpdateOrderStatus();

  if (isPending)
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        Loading orders...
      </p>
    );
  if (isError)
    return (
      <p className="rounded-2xl bg-rose-50 p-6 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
        Unable to load orders.
      </p>
    );

  return (
    <main>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-600">
            Operations
          </p>
          <h1 className="font-display mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            Orders
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Keep every customer order moving.
          </p>
        </div>
        <div className="hidden rounded-2xl bg-amber-100 p-3 text-amber-700 dark:bg-amber-400/15 dark:text-amber-400 sm:block">
          <PackageCheck className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-7 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60">
            <tr>
              <th className="px-5 py-4 font-semibold text-slate-500">Order</th>
              <th className="px-5 py-4 font-semibold text-slate-500">
                Customer
              </th>
              <th className="px-5 py-4 font-semibold text-slate-500">Total</th>
              <th className="px-5 py-4 font-semibold text-slate-500">Status</th>
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
                  ₹{order.totalAmount.toFixed(2)}
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
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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
    </main>
  );
}
