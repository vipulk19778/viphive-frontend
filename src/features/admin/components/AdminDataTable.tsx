import { useMemo, type ReactNode } from "react";
import {
  useTable,
  type SortingState,
  type Updater,
} from "@tanstack/react-table";

import {
  adminTableFeatures,
  type AdminColumnDef,
} from "@/features/admin/lib/admin-table";
import { AdminSortableHeader } from "@/features/admin/components/AdminSortableHeader";

export function AdminTableHeaderLabel({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <span
      className={`font-bold uppercase tracking-wider text-slate-500 ${className}`}
    >
      {children}
    </span>
  );
}

// The API takes sort as "field-asc" / "field-desc"
const parseSort = (sort: string): SortingState => {
  const separator = sort.lastIndexOf("-");
  if (separator === -1) return [];

  return [
    {
      id: sort.slice(0, separator),
      desc: sort.slice(separator + 1) === "desc",
    },
  ];
};

const serializeSort = (sorting: SortingState) =>
  sorting[0] ? `${sorting[0].id}-${sorting[0].desc ? "desc" : "asc"}` : "";

type AdminDataTableProps<TData extends object> = {
  data: TData[];
  columns: AdminColumnDef<TData>[];
  sort: string;
  onSortChange: (sort: string) => void;
  getRowId: (row: TData) => string;
  emptyState: ReactNode;
};

export function AdminDataTable<TData extends object>({
  data,
  columns,
  sort,
  onSortChange,
  getRowId,
  emptyState,
}: AdminDataTableProps<TData>) {
  const sorting = useMemo(() => parseSort(sort), [sort]);

  const table = useTable({
    features: adminTableFeatures,
    columns,
    data,
    getRowId,
    // Sorting happens on the server; the table only tracks the sort state
    manualSorting: true,
    enableSortingRemoval: false,
    state: { sorting },
    onSortingChange: (updater: Updater<SortingState>) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      const serialized = serializeSort(next);
      if (serialized) onSortChange(serialized);
    },
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="mt-7 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-5 py-4">
                  {header.isPlaceholder ? null : header.column.getCanSort() ? (
                    <AdminSortableHeader
                      direction={header.column.getIsSorted()}
                      onToggle={() =>
                        header.column.toggleSorting(
                          header.column.getIsSorted() === "asc",
                        )
                      }
                    >
                      <table.FlexRender header={header} />
                    </AdminSortableHeader>
                  ) : (
                    <table.FlexRender header={header} />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>{emptyState}</td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-100 last:border-0 dark:border-slate-800"
              >
                {row.getAllCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-4">
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
