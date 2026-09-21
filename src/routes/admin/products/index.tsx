import { createFileRoute } from "@tanstack/react-router";
import { Boxes, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/products/")({
  component: ProductsAdminPage,
});

function ProductsAdminPage() {
  return (
    <main>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-600">
            Catalog
          </p>
          <h1 className="font-display mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            Products
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage the collection customers see in the storefront.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white dark:bg-amber-400 dark:text-slate-950"
        >
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>
      <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400">
          <Boxes className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">
          Catalog tools are ready for products
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          Connect the product creation and editing forms here when you are ready
          to manage inventory from the admin workspace.
        </p>
      </div>
    </main>
  );
}
