import { createFileRoute } from "@tanstack/react-router";

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

  if (isPending) return <p className="p-6">Loading orders...</p>;
  if (isError)
    return <p className="p-6 text-red-600">Unable to load orders.</p>;

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="text-2xl font-bold">All Orders</h1>
      <div className="mt-6 overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((order) => (
              <tr key={order._id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">
                  #{order._id.slice(-8)}
                </td>
                <td className="px-4 py-3">{order.address.fullName}</td>
                <td className="px-4 py-3">₹{order.totalAmount.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    disabled={updateStatus.isPending}
                    onChange={(event) =>
                      updateStatus.mutate({
                        orderId: order._id,
                        status: event.target.value,
                      })
                    }
                    className="rounded-md border px-2 py-1"
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
