"use client";

import { FormEvent, useState } from "react";
import { BarChart3, Check, Pencil, Plus, Trash2 } from "lucide-react";

import { useGetProductsQuery } from "@/services/api/products.api";
import {
  useCreateAdminProductMutation,
  useDeleteAdminProductMutation,
  useGetAdminOrdersQuery,
  useGetAdminPaymentsQuery,
  useGetAdminUsersQuery,
  useGetAnalyticsQuery,
  useUpdateAdminProductMutation,
  useUpdateOrderStatusMutation,
} from "@/services/api/admin.api";
import type { Product } from "@/types/product";
import type { AdminOrder, AdminProductInput } from "@/features/admin/types";
import {
  Empty,
  ErrorState,
  Loading,
  money,
  Panel,
  StatusPill,
  TableHeading,
  date,
} from "./admin-ui";

export function OverviewView() {
  const [days, setDays] = useState(30);
  const { data, isLoading, isError } = useGetAnalyticsQuery(days);
  if (isLoading) return <Loading />;
  if (isError || !data)
    return <ErrorState message="Analytics could not be loaded." />;
  const cards = [
    ["Revenue", money(data.summary.totalRevenue), "Verified payments"],
    [
      "Orders",
      data.summary.totalOrders.toLocaleString("en-IN"),
      `${data.summary.successRate}% success rate`,
    ],
    [
      "Paid",
      data.summary.verifiedPayments.toLocaleString("en-IN"),
      "Verified payments",
    ],
    [
      "Needs attention",
      (
        data.summary.createdPayments + data.summary.failedPayments
      ).toLocaleString("en-IN"),
      "Created or failed",
    ],
  ];
  const peak = Math.max(...data.recentTrend.map((item) => item.revenue), 1);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Performance snapshot</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Store overview
          </h1>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Window
          <select
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className="h-9 rounded-lg border bg-background px-3 text-foreground"
          >
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
            <option value={365}>1 year</option>
          </select>
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, caption]) => (
          <Panel key={label} className="p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-3 text-2xl font-semibold">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{caption}</p>
          </Panel>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Revenue trend</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Verified payments by day
              </p>
            </div>
            <BarChart3 className="size-5 text-muted-foreground" />
          </div>
          <div className="mt-6 space-y-3">
            {data.recentTrend.length ? (
              data.recentTrend.slice(-10).map((item) => (
                <div
                  key={item._id}
                  className="grid grid-cols-[5rem_1fr_5rem] items-center gap-3 text-sm"
                >
                  <span className="text-muted-foreground">
                    {item._id.slice(5)}
                  </span>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${Math.max(4, (item.revenue / peak) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-right font-medium">
                    {money(item.revenue)}
                  </span>
                </div>
              ))
            ) : (
              <Empty text="No verified payments in this window." />
            )}
          </div>
        </Panel>
        <Panel className="p-5">
          <h2 className="font-semibold">Payment status</h2>
          <div className="mt-5 space-y-4">
            {data.statusBreakdown.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2">
                  <StatusPill value={item._id} />
                  <span className="text-sm text-muted-foreground">
                    {item.count} orders
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {money(item.revenue)}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

export function OrdersView() {
  const { data, isLoading, isError } = useGetAdminOrdersQuery({
    page: 1,
    limit: 100,
  });
  const [updateStatus] = useUpdateOrderStatusMutation();
  if (isLoading) return <Loading />;
  if (isError || !data)
    return <ErrorState message="Orders could not be loaded." />;
  return (
    <Panel>
      <TableHeading
        title="Orders"
        count={data.meta?.total ?? data.data.length}
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Payment</th>
              <th className="px-5 py-3 font-medium">Fulfilment</th>
              <th className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((order) => (
              <tr key={order._id} className="border-b last:border-0">
                <td className="px-5 py-4 font-medium">
                  #{order._id.slice(-8)}
                </td>
                <td className="px-5 py-4">
                  <p>{order.user?.name ?? "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.user?.email}
                  </p>
                </td>
                <td className="px-5 py-4">{money(order.totalAmount)}</td>
                <td className="px-5 py-4">
                  <StatusPill value={order.paymentStatus} />
                </td>
                <td className="px-5 py-4">
                  <select
                    value={order.status}
                    onChange={(event) =>
                      updateStatus({
                        id: order._id,
                        status: event.target.value as AdminOrder["status"],
                      })
                    }
                    className="h-8 rounded-md border bg-background px-2 text-xs capitalize"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {date(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export function PaymentsView() {
  const { data, isLoading, isError } = useGetAdminPaymentsQuery({
    page: 1,
    limit: 100,
  });
  if (isLoading) return <Loading />;
  if (isError || !data)
    return <ErrorState message="Payments could not be loaded." />;
  return (
    <Panel>
      <TableHeading
        title="Payments"
        count={data.meta?.total ?? data.data.length}
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Payment ID</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((payment) => (
              <tr key={payment._id} className="border-b last:border-0">
                <td className="px-5 py-4 font-medium">
                  #{payment._id.slice(-8)}
                </td>
                <td className="px-5 py-4">
                  {payment.user?.email ?? "Unknown"}
                </td>
                <td className="px-5 py-4">{money(payment.totalAmount)}</td>
                <td className="px-5 py-4">
                  <StatusPill value={payment.paymentStatus} />
                </td>
                <td className="px-5 py-4 text-xs text-muted-foreground">
                  {payment.paymentId ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label>
      <span className="text-sm font-medium">{label}</span>
      <input
        required
        type={type}
        min={type === "number" ? 0 : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

export function ProductsView() {
  const { data, isLoading, isError } = useGetProductsQuery({
    page: 1,
    limit: 100,
  });
  const [createProduct, createState] = useCreateAdminProductMutation();
  const [updateProduct, updateState] = useUpdateAdminProductMutation();
  const [deleteProduct] = useDeleteAdminProductMutation();
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AdminProductInput>({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
  });
  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", price: 0, category: "", stock: 0 });
    setShowForm(true);
  };
  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
    setShowForm(true);
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editing) await updateProduct({ id: editing._id, input: form }).unwrap();
    else await createProduct(form).unwrap();
    setShowForm(false);
  };
  if (isLoading) return <Loading />;
  if (isError || !data)
    return <ErrorState message="Products could not be loaded." />;
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Catalog management</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Products
          </h1>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          <Plus className="size-4" /> Add product
        </button>
      </div>
      {showForm && (
        <Panel className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">
              {editing ? "Edit product" : "Add product"}
            </h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-muted-foreground"
            >
              Cancel
            </button>
          </div>
          <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field
              label="Name"
              value={form.name}
              onChange={(value) => setForm({ ...form, name: value })}
            />
            <Field
              label="Category"
              value={form.category}
              onChange={(value) => setForm({ ...form, category: value })}
            />
            <Field
              label="Price"
              type="number"
              value={String(form.price)}
              onChange={(value) => setForm({ ...form, price: Number(value) })}
            />
            <Field
              label="Stock"
              type="number"
              value={String(form.stock)}
              onChange={(value) => setForm({ ...form, stock: Number(value) })}
            />
            <label className="sm:col-span-2">
              <span className="text-sm font-medium">Description</span>
              <textarea
                required
                minLength={10}
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                className="mt-2 min-h-24 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="text-sm font-medium">
                Image {editing ? "(optional)" : ""}
              </span>
              <input
                required={!editing}
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setForm({ ...form, image: event.target.files?.[0] })
                }
                className="mt-2 block w-full text-sm"
              />
            </label>
            <button
              disabled={createState.isLoading || updateState.isLoading}
              className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground sm:col-span-2"
            >
              {editing ? "Save changes" : "Create product"}
            </button>
          </form>
        </Panel>
      )}
      <Panel>
        <TableHeading title="Catalog" count={data.total} />
        <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.products.map((product) => (
            <article key={product._id} className="rounded-xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-medium">{product.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {product.category}
                  </p>
                </div>
                <StatusPill value={`${product.stock} in stock`} />
              </div>
              <p className="mt-4 text-lg font-semibold">
                {money(product.price)}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(product)}
                  className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs font-medium"
                >
                  <Pencil className="size-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() =>
                    window.confirm(`Delete ${product.name}?`) &&
                    deleteProduct(product._id)
                  }
                  className="inline-flex items-center gap-1 rounded-md border border-destructive/30 px-3 py-2 text-xs font-medium text-destructive"
                >
                  <Trash2 className="size-3.5" /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function UsersView() {
  const { data, isLoading, isError } = useGetAdminUsersQuery();
  if (isLoading) return <Loading />;
  if (isError || !data)
    return <ErrorState message="Users could not be loaded." />;
  return (
    <Panel>
      <TableHeading title="Users" count={data.length} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Verified</th>
              <th className="px-5 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user._id} className="border-b last:border-0">
                <td className="px-5 py-4 font-medium">{user.name}</td>
                <td className="px-5 py-4">{user.email}</td>
                <td className="px-5 py-4">
                  <StatusPill value={user.role} />
                </td>
                <td className="px-5 py-4">
                  {user.verified ? (
                    <Check className="size-4 text-emerald-600" />
                  ) : (
                    "No"
                  )}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {date(user.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
