import { CreditCard } from "lucide-react";

import { usePayments } from "@/features/admin/hooks/use-admin";

export function AdminPaymentsPage() {
  const { data, isPending, isError } = usePayments();
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
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-600">
            Finance
          </p>
          <h1 className="font-display mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            Payments
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {data.meta.total} payment records.
          </p>
        </div>
        <CreditCard className="h-7 w-7 text-amber-500" />
      </div>
      <div className="mt-7 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60">
            <tr>
              <th className="px-5 py-4 text-slate-500">Order</th>
              <th className="px-5 py-4 text-slate-500">Payment ID</th>
              <th className="px-5 py-4 text-slate-500">Amount</th>
              <th className="px-5 py-4 text-slate-500">Status</th>
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
                  ₹{payment.totalAmount.toFixed(2)}
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
    </main>
  );
}
