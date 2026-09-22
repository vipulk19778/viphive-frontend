import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  PackageCheck,
  Truck,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { useMyOrders } from "@/features/orders/hooks/use-orders";
import { formatCurrency } from "@/utils/format-currency";

const orderStatusPresentation: Record<
  string,
  {
    label: string;
    variant: "accent" | "danger" | "neutral" | "success";
    Icon: LucideIcon;
  }
> = {
  pending: {
    label: "Pending",
    variant: "accent",
    Icon: Clock3,
  },
  shipped: {
    label: "Shipped",
    variant: "accent",
    Icon: Truck,
  },
  delivered: {
    label: "Delivered",
    variant: "success",
    Icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    variant: "danger",
    Icon: XCircle,
  },
};

const fallbackOrderStatus = {
  label: "Processing",
  variant: "neutral" as const,
  Icon: PackageCheck,
};

export function OrdersPage() {
  const { data: orders, isPending, isError } = useMyOrders();

  if (isPending)
    return <Card className="p-8 text-slate-500">Loading orders...</Card>;
  if (isError)
    return (
      <div className="rounded-2xl bg-rose-50 p-6 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
        Unable to load orders.
      </div>
    );

  return (
    <main className="mx-auto max-w-5xl">
      <p className="brand-accent text-sm font-bold uppercase tracking-[0.18em]">
        Account
      </p>
      <div className="mt-2 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-950 dark:text-white">
            My orders
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Track your VIPHive purchases in one place.
          </p>
        </div>
        <ClipboardList className="brand-accent hidden h-7 w-7 sm:block" />
      </div>
      <div className="mt-6 space-y-4">
        {orders.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
            <ClipboardList className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-3 font-semibold text-slate-950 dark:text-white">
              You have no orders yet.
            </p>
          </div>
        )}
        {orders.map((order) => {
          const status =
            orderStatusPresentation[order.status.toLowerCase()] ??
            fallbackOrderStatus;
          const StatusIcon = status.Icon;

          return (
            <Card as="article" key={order._id} className="p-5 shadow-sm">
              <div className="flex flex-wrap justify-between gap-3">
                <p className="font-bold text-slate-950 dark:text-white">
                  Order #{order._id.slice(-8)}
                </p>
                <Chip
                  variant={status.variant}
                  className="gap-1.5 border border-current/15 text-sm font-semibold"
                  title={`Order status: ${status.label}`}
                >
                  <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  {status.label}
                </Chip>
              </div>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                {order.items.length} item(s) ·{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-2 font-bold text-slate-950 dark:text-white">
                {formatCurrency(order.totalAmount)}
              </p>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
