import { useState, type FormEvent } from "react";
import { ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react";

import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from "@/features/products/hooks/use-products";
import type {
  Product,
  ProductInput,
} from "@/features/products/types/product.types";

const emptyForm: ProductInput = {
  name: "",
  description: "",
  price: 0,
  category: "",
  stock: 0,
};

export function AdminProductsPage() {
  const { data, isPending, isError } = useProducts(1, 100);
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setIsOpen(true);
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
    setError("");
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
    setEditing(null);
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !form.name ||
      !form.description ||
      !form.category ||
      form.price <= 0 ||
      form.stock < 0 ||
      (!editing && !form.image)
    ) {
      setError("Complete all fields and choose an image for a new product.");
      return;
    }
    try {
      if (editing)
        await updateMutation.mutateAsync({
          productId: editing._id,
          input: form,
        });
      else await createMutation.mutateAsync(form);
      close();
    } catch {
      setError("Unable to save this product.");
    }
  };

  if (isPending)
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        Loading products...
      </div>
    );
  if (isError)
    return (
      <div className="rounded-2xl bg-rose-50 p-6 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
        Unable to load products.
      </div>
    );

  return (
    <main>
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="brand-accent text-sm font-bold uppercase tracking-[0.18em]">
            Catalog
          </p>
          <h1 className="font-display mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            Products
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {data.meta.total} products in your catalog.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="brand-primary brand-primary-hover inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition"
        >
          <Plus className="h-4 w-4" /> Add product
        </button>
      </header>
      <div className="mt-7 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="min-w-220">
          <div className="grid grid-cols-[minmax(280px,1fr)_160px_120px_100px_96px] items-center gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/60">
            <span>Product</span>
            <span>Category</span>
            <span className="text-center">Price</span>
            <span className="text-center">Stock</span>
            <span className="text-right">Actions</span>
          </div>
          {data.data.map((product) => (
            <div
              key={product._id}
              className="grid grid-cols-[minmax(280px,1fr)_160px_120px_100px_96px] items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <img
                  src={product.imageUrl}
                  alt=""
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">
                    {product.name}
                  </p>
                  <p className="max-w-xs truncate text-xs text-slate-500">
                    {product.description}
                  </p>
                </div>
              </div>
              <span
                className="truncate text-sm text-slate-500"
                title={product.category}
              >
                {product.category}
              </span>
              <span className="text-center font-semibold text-slate-950 dark:text-white">
                ₹{product.price.toFixed(2)}
              </span>
              <span
                className={
                  product.stock < 5
                    ? "text-center font-semibold text-rose-500"
                    : "text-center text-slate-500"
                }
              >
                {product.stock}
              </span>
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(product)}
                  aria-label={`Edit ${product.name}`}
                  className="brand-accent-hover cursor-pointer rounded-lg p-2 text-slate-500"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete ${product.name}?`))
                      deleteMutation.mutate(product._id);
                  }}
                  aria-label={`Delete ${product.name}`}
                  className="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-4 sm:items-center">
          <form
            onSubmit={submit}
            className="my-4 w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:my-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="brand-accent text-sm font-bold uppercase tracking-wider">
                  Catalog editor
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
                  {editing ? "Edit product" : "Add product"}
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="cursor-pointer"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Name
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
              <label className="sm:col-span-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Description
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Price
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Stock
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: Number(e.target.value) })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
              <label className="sm:col-span-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Category
                <input
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </label>
              <label className="sm:col-span-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 p-4 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                <ImagePlus className="brand-accent h-5 w-5" />
                {form.image?.name ??
                  (editing
                    ? "Replace image (optional)"
                    : "Choose product image")}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.files?.[0] })
                  }
                />
              </label>
            </div>
            {error && (
              <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="brand-primary brand-primary-hover mt-6 w-full cursor-pointer rounded-xl px-4 py-3 font-bold transition disabled:cursor-not-allowed"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : "Save product"}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
